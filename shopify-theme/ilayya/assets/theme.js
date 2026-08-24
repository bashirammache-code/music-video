/* =========================================================
   ILAYYA — theme JavaScript (vanilla, no build step required)
   ========================================================= */
(function () {
  'use strict';

  var routes = { cartAdd: '/cart/add.js', cartChange: '/cart/change.js', cartGet: '/cart.js' };

  /* ---------- Utilities ---------- */
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function formatMoney(cents, format) {
    var value = (cents / 100).toFixed(2);
    return (format || '${{amount}}').replace('{{amount}}', value);
  }

  function updateCartCount(count) {
    var el = qs('#CartCount');
    if (!el) return;
    el.textContent = count;
    if (count === 0) { el.setAttribute('data-zero', ''); } else { el.removeAttribute('data-zero'); }
  }

  /* ---------- Drawers / toggles ---------- */
  function toggleHidden(el, show) {
    if (!el) return;
    if (show) { el.removeAttribute('hidden'); } else { el.setAttribute('hidden', ''); }
  }

  function initMobileMenu() {
    var toggle = qs('.site-header__menu-toggle');
    var menu = qs('#MobileMenu');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      toggleHidden(menu, !isOpen);
    });
  }

  function initSearchDrawer() {
    var toggle = qs('#SearchToggle');
    var drawer = qs('#SearchDrawer');
    var close = qs('#SearchClose');
    if (!toggle || !drawer) return;
    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      toggleHidden(drawer, !isOpen);
      if (!isOpen) { var input = qs('input[type="search"]', drawer); if (input) input.focus(); }
    });
    if (close) {
      close.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        toggleHidden(drawer, false);
      });
    }
  }

  function openCartDrawer() {
    var drawer = qs('#CartDrawer');
    var toggle = qs('#CartToggle');
    if (!drawer) return;
    toggleHidden(drawer, true);
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
  }

  function closeCartDrawer() {
    var drawer = qs('#CartDrawer');
    var toggle = qs('#CartToggle');
    if (!drawer) return;
    toggleHidden(drawer, false);
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  function initCartDrawer() {
    var toggle = qs('#CartToggle');
    if (toggle) toggle.addEventListener('click', openCartDrawer);

    document.addEventListener('click', function (e) {
      if (e.target.closest('#CartDrawerClose') || e.target.closest('#CartOverlay')) {
        closeCartDrawer();
      }
    });

    document.addEventListener('click', function (e) {
      var removeBtn = e.target.closest('.cart-drawer__item-remove');
      var qtyBtn = e.target.closest('.cart-drawer__qty .qty-btn');
      if (!removeBtn && !qtyBtn) return;

      var line = (removeBtn || qtyBtn).getAttribute('data-line') ||
        (qtyBtn && qtyBtn.closest('[data-line]') ? qtyBtn.closest('[data-line]').getAttribute('data-line') : null);
      if (!line) return;

      var quantity = 0;
      if (qtyBtn) {
        var valueEl = qtyBtn.closest('.cart-drawer__qty').querySelector('.qty-value');
        var current = parseInt(valueEl.textContent, 10) || 1;
        quantity = qtyBtn.getAttribute('data-action') === 'increase' ? current + 1 : Math.max(0, current - 1);
      }

      fetch(routes.cartChange, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line: parseInt(line, 10), quantity: quantity })
      })
        .then(function (res) { return res.json(); })
        .then(function (cart) {
          updateCartCount(cart.item_count);
          refreshCartDrawer();
        });
    });
  }

  function refreshCartDrawer() {
    fetch(window.location.pathname + '?section_id=cart-drawer')
      .then(function (res) { return res.text(); })
      .then(function (html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var newDrawer = doc.querySelector('#CartDrawer');
        var currentDrawer = qs('#CartDrawer');
        if (newDrawer && currentDrawer) {
          var wasOpen = !currentDrawer.hasAttribute('hidden');
          currentDrawer.innerHTML = newDrawer.innerHTML;
          if (wasOpen) currentDrawer.removeAttribute('hidden');
        }
      })
      .catch(function () { /* silent fail: count already updated */ });
  }

  /* ---------- Add to cart (AJAX) ---------- */
  function initProductForms() {
    document.addEventListener('submit', function (e) {
      var form = e.target.closest('#ProductForm');
      if (!form) return;
      e.preventDefault();

      var submitBtn = qs('#AddToCart', form);
      var submitText = qs('#AddToCartText', form);
      if (submitBtn) submitBtn.setAttribute('disabled', '');
      if (submitText) submitText.textContent = 'Adding…';

      var formData = new FormData(form);

      fetch(routes.cartAdd, { method: 'POST', body: formData, headers: { Accept: 'application/json' } })
        .then(function (res) { return res.json(); })
        .then(function () {
          return fetch(routes.cartGet).then(function (r) { return r.json(); });
        })
        .then(function (cart) {
          updateCartCount(cart.item_count);
          if (submitText) submitText.textContent = 'Add to Bag';
          if (submitBtn) submitBtn.removeAttribute('disabled');
          refreshCartDrawer();
          openCartDrawer();
        })
        .catch(function () {
          if (submitText) submitText.textContent = 'Something went wrong';
          if (submitBtn) submitBtn.removeAttribute('disabled');
        });
    });
  }

  /* ---------- Quantity steppers (product form) ---------- */
  function initQuantitySteppers() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.qty-stepper .qty-btn');
      if (!btn) return;
      var input = btn.closest('.qty-stepper').querySelector('input[type="number"]');
      if (!input) return;
      var value = parseInt(input.value, 10) || 1;
      var min = parseInt(input.getAttribute('min'), 10) || 1;
      value = btn.getAttribute('data-qty') === 'increase' ? value + 1 : Math.max(min, value - 1);
      input.value = value;
    });
  }

  /* ---------- Variant picker (main-product section) ---------- */
  var Ilayya = window.Ilayya || {};

  Ilayya.initProductForm = function (sectionId) {
    var section = document.querySelector('[id$="' + sectionId + '"]') || document;
    var script = document.getElementById('ProductVariants-' + sectionId);
    if (!script) return;

    var variants;
    try { variants = JSON.parse(script.textContent); } catch (err) { return; }

    var pillGroups = qsa('.product__option', document);
    var hiddenInput = qs('#ProductVariantId');
    var priceWrap = qs('#ProductPrice');
    var addBtn = qs('#AddToCart');
    var addText = qs('#AddToCartText');

    function currentSelection() {
      var selection = [];
      pillGroups.forEach(function (group) {
        var selected = qs('.option-pill.is-selected', group);
        selection.push(selected ? selected.getAttribute('data-option-value') : null);
      });
      return selection;
    }

    function findVariant(selection) {
      return variants.find(function (v) {
        var opts = [v.option1, v.option2, v.option3];
        return selection.every(function (val, i) { return val === null || opts[i] === val; });
      });
    }

    function renderMoney(cents) {
      return '$' + (cents / 100).toFixed(2);
    }

    function updateForVariant(variant) {
      if (!variant) return;
      hiddenInput.value = variant.id;

      if (priceWrap) {
        var compareHtml = variant.compare_at_price && variant.compare_at_price > variant.price
          ? '<span class="price__compare">' + renderMoney(variant.compare_at_price) + '</span>'
          : '';
        priceWrap.innerHTML = '<span class="price' + (compareHtml ? ' price--sale' : '') + '">' +
          compareHtml + '<span class="price__current">' + renderMoney(variant.price) + '</span></span>';
      }

      if (addBtn) {
        if (variant.available) {
          addBtn.removeAttribute('disabled');
          if (addText) addText.textContent = 'Add to Bag';
        } else {
          addBtn.setAttribute('disabled', '');
          if (addText) addText.textContent = 'Sold Out';
        }
      }

      if (variant.featured_media) {
        var img = document.querySelector('.product__gallery-image[data-media-id="' + variant.featured_media.id + '"]');
        if (img) selectGalleryImage(variant.featured_media.id);
      }
    }

    pillGroups.forEach(function (group) {
      group.addEventListener('click', function (e) {
        var pill = e.target.closest('.option-pill');
        if (!pill) return;
        qsa('.option-pill', group).forEach(function (p) { p.classList.remove('is-selected'); });
        pill.classList.add('is-selected');
        var variant = findVariant(currentSelection());
        updateForVariant(variant);
      });
    });
  };

  /* ---------- Product gallery thumbnails ---------- */
  function selectGalleryImage(mediaId) {
    qsa('.product__gallery-image').forEach(function (img) {
      img.classList.toggle('is-active', img.getAttribute('data-media-id') === String(mediaId));
    });
    qsa('.product__thumb').forEach(function (thumb) {
      thumb.classList.toggle('is-active', thumb.getAttribute('data-media-id') === String(mediaId));
    });
  }

  function initGalleryThumbs() {
    document.addEventListener('click', function (e) {
      var thumb = e.target.closest('.product__thumb');
      if (!thumb) return;
      selectGalleryImage(thumb.getAttribute('data-media-id'));
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initSearchDrawer();
    initCartDrawer();
    initProductForms();
    initQuantitySteppers();
    initGalleryThumbs();
  });

  window.Ilayya = Ilayya;
})();
