/* ===== Gadgetron theme JS ===== */
(function () {
  'use strict';

  const money = (cents) =>
    (window.Shopify && Shopify.formatMoney)
      ? Shopify.formatMoney(cents, window.themeMoneyFormat)
      : '$' + (cents / 100).toFixed(2);

  /* ---- Footer year ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Mobile nav ---- */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* ---- Cart drawer ---- */
  const drawer = document.querySelector('[data-cart-drawer]');
  const openDrawer = () => { if (drawer) { drawer.classList.add('open'); document.body.style.overflow = 'hidden'; } };
  const closeDrawer = () => { if (drawer) { drawer.classList.remove('open'); document.body.style.overflow = ''; } };
  if (drawer) {
    drawer.querySelectorAll('[data-cart-close]').forEach((el) => el.addEventListener('click', closeDrawer));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });
  }

  async function refreshCart() {
    try {
      const res = await fetch('/cart.js');
      const cart = await res.json();
      document.querySelectorAll('[data-cart-count]').forEach((el) => {
        el.textContent = cart.item_count;
        el.style.display = cart.item_count > 0 ? '' : 'none';
      });
      // Re-render drawer body via section rendering if present
      const drawerItems = document.querySelector('[data-cart-drawer-items]');
      if (drawerItems) {
        const sectionRes = await fetch('/?sections=cart-drawer');
        if (sectionRes.ok) {
          const data = await sectionRes.json();
          if (data['cart-drawer']) {
            const html = new DOMParser().parseFromString(data['cart-drawer'], 'text/html');
            const fresh = html.querySelector('[data-cart-drawer-inner]');
            const target = document.querySelector('[data-cart-drawer-inner]');
            if (fresh && target) target.innerHTML = fresh.innerHTML;
          }
        }
      }
    } catch (e) { /* no-op */ }
  }

  /* ---- Add to cart (AJAX) ---- */
  document.addEventListener('submit', async (e) => {
    const form = e.target.closest('form[action$="/cart/add"], form[action*="/cart/add"]');
    if (!form || !form.hasAttribute('data-ajax-cart')) return;
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const original = btn ? btn.textContent : '';
    if (btn) { btn.textContent = 'Adding…'; btn.classList.add('is-disabled'); btn.disabled = true; }
    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(formToCartJSON(form)),
      });
      if (!res.ok) throw new Error('Add to cart failed');
      await refreshCart();
      openDrawer();
    } catch (err) {
      window.location.href = '/cart';
    } finally {
      if (btn) { btn.textContent = original; btn.classList.remove('is-disabled'); btn.disabled = false; }
    }
  });

  function formToCartJSON(form) {
    const data = new FormData(form);
    const payload = { items: [{ id: Number(data.get('id')), quantity: Number(data.get('quantity') || 1) }] };
    const sellingPlan = data.get('selling_plan');
    if (sellingPlan) payload.items[0].selling_plan = Number(sellingPlan);
    return payload;
  }

  /* ---- Quantity steppers ---- */
  document.addEventListener('click', (e) => {
    const dec = e.target.closest('[data-qty-minus]');
    const inc = e.target.closest('[data-qty-plus]');
    if (!dec && !inc) return;
    const wrap = e.target.closest('.qty-stepper');
    const input = wrap && wrap.querySelector('input');
    if (!input) return;
    let val = parseInt(input.value, 10) || 1;
    val = inc ? val + 1 : Math.max(1, val - 1);
    input.value = val;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  /* ---- Cart line quantity / remove (cart page & drawer) ---- */
  async function changeLine(key, quantity) {
    const res = await fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, quantity }),
    });
    return res.json();
  }
  document.addEventListener('click', async (e) => {
    const remove = e.target.closest('[data-cart-remove]');
    if (!remove) return;
    e.preventDefault();
    await changeLine(remove.dataset.cartRemove, 0);
    if (document.querySelector('[data-cart-drawer-items]')) {
      await refreshCart();
    } else {
      window.location.reload();
    }
  });
  document.addEventListener('change', async (e) => {
    const qty = e.target.closest('[data-cart-qty]');
    if (!qty) return;
    await changeLine(qty.dataset.cartQty, Math.max(0, parseInt(qty.value, 10) || 0));
    window.location.reload();
  });

  /* ---- Product variant selection ---- */
  document.querySelectorAll('[data-product-form]').forEach((form) => {
    const data = form.querySelector('[data-variants]');
    if (!data) return;
    let variants = [];
    try { variants = JSON.parse(data.textContent); } catch (e) { return; }
    const idInput = form.querySelector('input[name="id"]');
    const priceEl = document.querySelector('[data-product-price]');
    const addBtn = form.querySelector('[data-add-btn]');

    function selectedOptions() {
      return Array.from(form.querySelectorAll('[data-option-index]')).map((el) => {
        if (el.type === 'radio') {
          const checked = form.querySelector(`[name="${el.name}"]:checked`);
          return checked ? checked.value : null;
        }
        return el.value;
      }).filter((v) => v !== null);
    }
    function update() {
      const opts = selectedOptions();
      const match = variants.find((v) => v.options.every((o, i) => o === opts[i]));
      if (!match) return;
      idInput.value = match.id;
      if (priceEl) priceEl.innerHTML = match.available
        ? money(match.price)
        : money(match.price) + ' <span class="badge">Sold out</span>';
      if (addBtn) {
        addBtn.disabled = !match.available;
        addBtn.textContent = match.available ? (addBtn.dataset.label || 'Add to cart') : 'Sold out';
        addBtn.classList.toggle('is-disabled', !match.available);
      }
    }
    form.querySelectorAll('[data-option-index]').forEach((el) => el.addEventListener('change', update));
    update();
  });

  /* ---- Product gallery thumbs ---- */
  const gallery = document.querySelector('[data-gallery]');
  if (gallery) {
    const main = gallery.querySelector('[data-gallery-main] img');
    gallery.querySelectorAll('[data-gallery-thumb]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (main) { main.src = btn.dataset.src; main.srcset = ''; }
        gallery.querySelectorAll('[data-gallery-thumb]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  /* ---- Contact / quote form (front-end note for the section without a Shopify form) ---- */
  const note = document.getElementById('formNote');
  const quote = document.getElementById('quoteForm');
  if (quote && note && !quote.getAttribute('action')) {
    quote.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(quote);
      const name = (fd.get('name') || '').toString().trim();
      const email = (fd.get('email') || '').toString().trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!name || !emailOk) {
        note.textContent = 'Please add your name and a valid email so we can reach you.';
        note.className = 'form-note err';
        return;
      }
      note.textContent = `Thanks, ${name.split(' ')[0]}! Your request is ready — we'll be in touch soon. 🎉`;
      note.className = 'form-note ok';
      quote.reset();
    });
  }

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll('.step, .product-card, .plan, .benefits li');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealEls.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity .5s ease, transform .5s ease';
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  }
})();
