/* =========================================================
   ILAYYA — theme JavaScript (vanilla, no build step required)
   ========================================================= */
(function () {
  'use strict';

  var routes = {
    cartAdd: '/cart/add.js',
    cartChange: '/cart/change.js',
    cartGet: '/cart.js',
    searchSuggest: '/search/suggest.json'
  };

  /* ---------- Utilities ---------- */
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
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
    var toggle = qs('#MenuToggle');
    var menu = qs('#MobileMenu');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      toggleHidden(menu, !isOpen);
    });
  }

  /* ---------- Overlay header: transparent over the hero, solid once scrolled ---------- */
  function initOverlayHeader() {
    var chrome = qs('.site-chrome--overlay');
    if (!chrome) return;
    var threshold = 60;
    var ticking = false;
    function update() {
      chrome.classList.toggle('is-scrolled', window.scrollY > threshold);
      ticking = false;
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Announcement bar: rotate between message blocks ---------- */
  function initAnnouncementBar() {
    var bar = qs('#AnnouncementBar');
    if (!bar) return;
    var messages = qsa('.announcement-bar__message', bar);
    if (messages.length < 2) return;
    var seconds = parseInt(bar.getAttribute('data-rotate-seconds'), 10) || 5;
    var index = 0;
    setInterval(function () {
      messages[index].classList.remove('is-active');
      index = (index + 1) % messages.length;
      messages[index].classList.add('is-active');
    }, seconds * 1000);
  }

  /* ---------- Search: predictive results via Shopify's suggest API ---------- */
  function initSearchDrawer() {
    var toggle = qs('#SearchToggle');
    var drawer = qs('#SearchDrawer');
    var close = qs('#SearchClose');
    var backdrop = qs('#SearchBackdrop');
    var input = qs('#SearchInput');
    var results = qs('#SearchResults');
    if (!toggle || !drawer) return;

    function open() {
      toggle.setAttribute('aria-expanded', 'true');
      toggleHidden(drawer, true);
      setTimeout(function () { if (input) input.focus(); }, 10);
    }
    function closeDrawer() {
      toggle.setAttribute('aria-expanded', 'false');
      toggleHidden(drawer, false);
    }
    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) { closeDrawer(); } else { open(); }
    });
    if (close) close.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !drawer.hasAttribute('hidden')) closeDrawer();
    });

    if (!input || !results) return;
    var debounceTimer;
    input.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      var query = input.value.trim();
      if (!query) { results.innerHTML = ''; return; }
      debounceTimer = setTimeout(function () { runSearch(query); }, 250);
    });

    function runSearch(query) {
      var url = routes.searchSuggest + '?q=' + encodeURIComponent(query) + '&resources[type]=product&resources[limit]=8';
      fetch(url, { headers: { Accept: 'application/json' } })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          var products = (data.resources && data.resources.results && data.resources.results.products) || [];
          if (products.length === 0) {
            results.innerHTML = '<p class="search-drawer__empty">No results for &ldquo;' + escapeHtml(query) + '&rdquo;.</p>';
            return;
          }
          var html = '<p class="search-drawer__meta">' + products.length + ' result' + (products.length === 1 ? '' : 's') + '</p><ul>';
          products.forEach(function (p) {
            html += '<li><a href="' + p.url + '">' + escapeHtml(p.title) +
              '<span class="cat">' + escapeHtml(p.type || '') + '</span>' +
              '<span class="price">' + p.price + '</span></a></li>';
          });
          html += '</ul>';
          results.innerHTML = html;
        })
        .catch(function () { /* silent: predictive search is a progressive enhancement */ });
    }
  }

  /* ---------- Cart drawer ---------- */
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

  /* ---------- Added-to-cart confirmation modal ----------
     Shared by the product-page Add to Cart button and every quick-add "+"
     (product cards and cross-sell items). Shows a brief loading state, then
     a checkmark with View Cart / Checkout / Continue Shopping — adding no
     longer force-opens the cart drawer on its own. */
  var Ilayya = window.Ilayya || {};

  function initAddedModal() {
    var modal = qs('#AddedModal');
    if (!modal) return;
    var backdrop = qs('#AddedModalBackdrop');
    var closeBtn = qs('#AddedModalClose');
    var loadingEl = qs('#AddedModalLoading');
    var successEl = qs('#AddedModalSuccess');
    var thumbEl = qs('#AddedModalThumb');
    var nameEl = qs('#AddedModalName');
    var priceEl = qs('#AddedModalPrice');
    var viewCartBtn = qs('#AddedModalViewCart');
    var continueBtn = qs('#AddedModalContinue');

    function close() { modal.setAttribute('hidden', ''); }

    function show(opts) {
      loadingEl.hidden = false;
      successEl.hidden = true;
      thumbEl.innerHTML = opts.thumbHtml || '';
      modal.removeAttribute('hidden');
      setTimeout(function () {
        loadingEl.hidden = true;
        successEl.hidden = false;
        nameEl.textContent = opts.title || '';
        priceEl.textContent = opts.price || '';
      }, 550);
    }

    if (backdrop) backdrop.addEventListener('click', close);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (continueBtn) continueBtn.addEventListener('click', close);
    if (viewCartBtn) {
      viewCartBtn.addEventListener('click', function (e) {
        e.preventDefault();
        close();
        openCartDrawer();
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hasAttribute('hidden')) close();
    });

    Ilayya.showAddedModal = show;
  }

  /* ---------- Signup pop-up: once per visitor, after a short delay ---------- */
  function initSignupPopup() {
    var modal = qs('#SignupModal');
    if (!modal) return;
    var backdrop = qs('#SignupBackdrop');
    var closeBtn = qs('#SignupClose');
    var STORAGE_KEY = 'ilayya_signup_seen';

    function close() { modal.setAttribute('hidden', ''); }
    function open() { modal.removeAttribute('hidden'); }

    if (backdrop) backdrop.addEventListener('click', close);
    if (closeBtn) closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hasAttribute('hidden')) close();
    });

    var alreadySeen = false;
    try { alreadySeen = window.localStorage.getItem(STORAGE_KEY) === '1'; } catch (err) { alreadySeen = false; }
    var justPosted = qs('.signup-modal__success', modal);

    if (!alreadySeen || justPosted) {
      setTimeout(function () {
        open();
        try { window.localStorage.setItem(STORAGE_KEY, '1'); } catch (err) { /* private browsing: ignore */ }
      }, justPosted ? 0 : 2500);
    }

    Ilayya.openSignupModal = open;
  }

  /* ---------- Promo tab: fixed "Get 10% Off" tab on the right edge, visible
     on every page while scrolling. Clicking it opens the same signup modal
     as the delayed pop-up above; the small close button just dismisses the
     tab itself (for this browsing session) without touching that modal. ---------- */
  function initPromoTab() {
    var tab = qs('#PromoTab');
    if (!tab) return;
    var trigger = qs('#PromoTabTrigger');
    var closeBtn = qs('#PromoTabClose');
    var STORAGE_KEY = 'ilayya_promo_tab_dismissed';

    var dismissed = false;
    try { dismissed = window.sessionStorage.getItem(STORAGE_KEY) === '1'; } catch (err) { dismissed = false; }
    if (dismissed) { tab.setAttribute('hidden', ''); return; }

    if (trigger) {
      trigger.addEventListener('click', function () {
        if (typeof Ilayya.openSignupModal === 'function') Ilayya.openSignupModal();
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        tab.setAttribute('hidden', '');
        try { window.sessionStorage.setItem(STORAGE_KEY, '1'); } catch (err) { /* private browsing: ignore */ }
      });
    }
  }

  /* ---------- Quick-add "+": AJAX add straight from a product card ---------- */
  function initQuickAdd() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-quick-add]');
      if (!btn || btn.hasAttribute('disabled')) return;
      e.preventDefault();
      e.stopPropagation();

      var variantId = btn.getAttribute('data-variant-id');
      if (!variantId) return;

      var card = btn.closest('.product-card, .cross-sell__item');
      var thumbHtml = '';
      if (card) {
        var img = card.querySelector('img');
        if (img) thumbHtml = '<img src="' + img.src + '" alt="">';
      }

      fetch(routes.cartAdd, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ id: variantId, quantity: 1 })
      })
        .then(function (res) { return res.json(); })
        .then(function () {
          return fetch(routes.cartGet).then(function (r) { return r.json(); });
        })
        .then(function (cart) {
          updateCartCount(cart.item_count);
          refreshCartDrawer();
          if (Ilayya.showAddedModal) {
            Ilayya.showAddedModal({
              title: btn.getAttribute('data-product-title'),
              price: btn.getAttribute('data-product-price'),
              thumbHtml: thumbHtml
            });
          }
        })
        .catch(function () { /* silent fail: nothing added, count unchanged */ });
    });
  }

  /* ---------- Add to cart (AJAX, product page form) ---------- */
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
      var qtyInput = qs('#Quantity', form);
      var qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;

      var mainImage = qs('.product__gallery-image.is-active');
      var thumbHtml = mainImage ? '<img src="' + mainImage.src + '" alt="">' : '';

      fetch(routes.cartAdd, { method: 'POST', body: formData, headers: { Accept: 'application/json' } })
        .then(function (res) { return res.json(); })
        .then(function () {
          return fetch(routes.cartGet).then(function (r) { return r.json(); });
        })
        .then(function (cart) {
          updateCartCount(cart.item_count);
          if (submitText) submitText.textContent = 'Add to Cart';
          if (submitBtn) submitBtn.removeAttribute('disabled');
          refreshCartDrawer();
          if (Ilayya.showAddedModal) {
            var priceEl = qs('#ProductPrice .price__current');
            var titleEl = qs('.product__title');
            var priceText = priceEl ? priceEl.textContent : '';
            var title = (titleEl ? titleEl.textContent : '') + (qty > 1 ? ' ×' + qty : '');
            Ilayya.showAddedModal({ title: title, price: priceText, thumbHtml: thumbHtml });
          }
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
  Ilayya.initProductForm = function (sectionId) {
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
          if (addText) addText.textContent = 'Add to Cart';
        } else {
          addBtn.setAttribute('disabled', '');
          if (addText) addText.textContent = 'Sold Out';
        }
      }

      if (variant.featured_media) {
        selectGalleryImage(variant.featured_media.id);
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

  /* ---------- Product gallery: prev/next carousel with a "1/2" counter ---------- */
  function selectGalleryImage(mediaId) {
    var images = qsa('.product__gallery-image');
    images.forEach(function (img) {
      img.classList.toggle('is-active', img.getAttribute('data-media-id') === String(mediaId));
    });
    updateGalleryCounter();
  }

  function updateGalleryCounter() {
    var images = qsa('.product__gallery-image');
    var counter = qs('#ProductGalleryCounter');
    if (!counter || images.length < 2) return;
    var activeIndex = images.findIndex(function (img) { return img.classList.contains('is-active'); });
    counter.textContent = (activeIndex + 1) + '/' + images.length;
  }

  Ilayya.initProductGallery = function () {
    var images = qsa('.product__gallery-image');
    if (images.length === 0) return;

    function step(delta) {
      var currentIndex = images.findIndex(function (img) { return img.classList.contains('is-active'); });
      var nextIndex = (currentIndex + delta + images.length) % images.length;
      selectGalleryImage(images[nextIndex].getAttribute('data-media-id'));
    }

    var prevBtn = qs('[data-gallery-prev]');
    var nextBtn = qs('[data-gallery-next]');
    if (prevBtn) prevBtn.addEventListener('click', function () { step(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { step(1); });
  };

  /* ---------- Hero: swipeable, autoplaying slideshow ---------- */
  var heroResizeHandler = null; // re-init (theme editor) replaces this instead of stacking listeners
  var heroInstance = null; // consulted by the shopify:block:* listeners registered once, below

  function initHeroSlideshow() {
    var root = qs('[data-hero-slideshow]');
    if (!root) return;
    var track = qs('[data-hero-track]', root);
    if (!track) return;

    // Safe to call again on DOM this function already set up (e.g. the theme
    // editor re-firing shopify:section:load without actually swapping this
    // section's HTML) — clones never carry data-block-id, so drop any from a
    // previous run before recounting, instead of cloning clones forever.
    qsa('.hero-slideshow__slide', track).forEach(function (el) {
      if (!el.hasAttribute('data-block-id')) el.parentNode.removeChild(el);
    });

    var realSlides = qsa('.hero-slideshow__slide', track);
    var dots = qsa('[data-hero-dot]', root);
    if (realSlides.length < 2) return;

    var realCount = realSlides.length;
    var blockIdToIndex = {};
    realSlides.forEach(function (slide, i) {
      var id = slide.getAttribute('data-block-id');
      if (id) blockIdToIndex[id] = i;
    });

    // Clone the first/last slide on either end so autoplay and swipes can
    // cross the start/end boundary without a visible jump-back. Strip the
    // theme-editor markers from the clones — Shopify locates a block by a
    // unique data-shopify-editor-block per DOM node, and a duplicate would
    // leave clicking that block in the sidebar targeting the wrong (always
    // off-screen) copy instead of the real, reachable slide.
    var firstClone = realSlides[0].cloneNode(true);
    var lastClone = realSlides[realCount - 1].cloneNode(true);
    [firstClone, lastClone].forEach(function (clone) {
      clone.setAttribute('aria-hidden', 'true');
      clone.removeAttribute('data-shopify-editor-block');
      clone.removeAttribute('data-block-id');
    });
    track.appendChild(firstClone);
    track.insertBefore(lastClone, realSlides[0]);

    var position = 1; // 1..realCount map to the real slides; 0 and realCount+1 are the clones
    var slideWidth = root.getBoundingClientRect().width;
    var isDragging = false;
    var dragStartX = 0;
    var dragStartY = 0;
    var dragDeltaX = 0;
    var directionLocked = null; // 'x' | 'y'
    var autoplayTimer = null;
    var editingBlock = false;
    var autoplaySeconds = parseFloat(root.getAttribute('data-autoplay-seconds')) || 0;

    function setTransform(withTransition) {
      track.style.transition = withTransition ? 'transform .5s ease' : 'none';
      track.style.transform = 'translateX(' + (-position * slideWidth) + 'px)';
    }

    function activeRealIndex() {
      return (position - 1 + realCount) % realCount;
    }

    function updateDots() {
      var index = activeRealIndex();
      dots.forEach(function (dot, i) { dot.classList.toggle('is-active', i === index); });
    }

    function goTo(newPosition) {
      position = newPosition;
      setTransform(true);
      updateDots();
    }

    track.addEventListener('transitionend', function () {
      if (position === 0) {
        position = realCount;
        setTransform(false);
      } else if (position === realCount + 1) {
        position = 1;
        setTransform(false);
      }
    });

    function stopAutoplay() {
      if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
    }
    function startAutoplay() {
      stopAutoplay();
      if (!editingBlock && autoplaySeconds > 0) {
        autoplayTimer = setInterval(function () { goTo(position + 1); }, autoplaySeconds * 1000);
      }
    }

    var prevBtn = qs('[data-hero-prev]', root);
    var nextBtn = qs('[data-hero-next]', root);
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(position - 1); startAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(position + 1); startAutoplay(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i + 1); startAutoplay(); });
    });

    /* Touch swipe — locks to horizontal vs. vertical on the first move so a
       vertical scroll gesture isn't hijacked. */
    root.addEventListener('touchstart', function (e) {
      var t = e.touches[0];
      dragStartX = t.clientX;
      dragStartY = t.clientY;
      dragDeltaX = 0;
      directionLocked = null;
      isDragging = true;
      stopAutoplay();
      track.style.transition = 'none';
    }, { passive: true });

    root.addEventListener('touchmove', function (e) {
      if (!isDragging) return;
      var t = e.touches[0];
      var dx = t.clientX - dragStartX;
      var dy = t.clientY - dragStartY;
      if (!directionLocked) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        directionLocked = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      }
      if (directionLocked === 'y') { isDragging = false; return; }
      e.preventDefault();
      dragDeltaX = dx;
      track.style.transform = 'translateX(' + (-position * slideWidth + dragDeltaX) + 'px)';
    }, { passive: false });

    root.addEventListener('touchend', function () {
      if (!isDragging) { startAutoplay(); return; }
      isDragging = false;
      var threshold = slideWidth * 0.15;
      if (dragDeltaX < -threshold) {
        goTo(position + 1);
      } else if (dragDeltaX > threshold) {
        goTo(position - 1);
      } else {
        setTransform(true);
      }
      startAutoplay();
    });

    if (heroResizeHandler) window.removeEventListener('resize', heroResizeHandler);
    heroResizeHandler = function () {
      slideWidth = root.getBoundingClientRect().width;
      setTransform(false);
    };
    window.addEventListener('resize', heroResizeHandler);

    heroInstance = {
      root: root,
      blockIdToIndex: blockIdToIndex,
      goTo: goTo,
      stopAutoplay: stopAutoplay,
      startAutoplay: startAutoplay,
      setEditing: function (v) { editingBlock = v; }
    };

    setTransform(false);
    updateDots();
    startAutoplay();
  }

  /* Theme editor: jump the carousel to whichever Slide block the merchant
     selects, and pause autoplay while they're on it. Without this, only the
     currently-active slide is reachable on canvas — every other Slide block
     is invisible (and so unclickable/uneditable) behind it. Registered once;
     each call reads the live heroInstance rather than closing over one, so
     it keeps working across theme-editor re-renders. */
  document.addEventListener('shopify:block:select', function (e) {
    if (!heroInstance || !heroInstance.root.contains(e.target)) return;
    var blockId = e.target.getAttribute('data-block-id') || (e.detail && e.detail.blockId);
    var index = heroInstance.blockIdToIndex[blockId];
    if (index === undefined) return;
    heroInstance.setEditing(true);
    heroInstance.stopAutoplay();
    heroInstance.goTo(index + 1);
  });
  document.addEventListener('shopify:block:deselect', function (e) {
    if (!heroInstance || !heroInstance.root.contains(e.target)) return;
    heroInstance.setEditing(false);
    heroInstance.startAutoplay();
  });
  document.addEventListener('shopify:section:load', function (e) {
    if (e.target && e.target.querySelector && e.target.querySelector('[data-hero-slideshow]')) {
      initHeroSlideshow();
    }
  });

  /* ---------- Cross-sell: fetch native product recommendations ---------- */
  Ilayya.initCrossSell = function () {
    var container = qs('#ProductRecommendations');
    var row = qs('#CrossSellRow', container);
    if (!container || !row) return;

    fetch(container.getAttribute('data-url'))
      .then(function (res) { return res.text(); })
      .then(function (html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var items = doc.querySelectorAll('.cross-sell__item');
        if (items.length === 0) return;
        row.innerHTML = '';
        items.forEach(function (item) { row.appendChild(item); });
        container.removeAttribute('hidden');
      })
      .catch(function () { /* silent: cross-sell is a progressive enhancement */ });

    var prevBtn = qs('[data-cross-sell-prev]');
    var nextBtn = qs('[data-cross-sell-next]');
    if (prevBtn) prevBtn.addEventListener('click', function () { row.scrollBy({ left: -320, behavior: 'smooth' }); });
    if (nextBtn) nextBtn.addEventListener('click', function () { row.scrollBy({ left: 320, behavior: 'smooth' }); });
  };

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initOverlayHeader();
    initAnnouncementBar();
    initHeroSlideshow();
    initSearchDrawer();
    initCartDrawer();
    initAddedModal();
    initSignupPopup();
    initPromoTab();
    initQuickAdd();
    initProductForms();
    initQuantitySteppers();
  });

  window.Ilayya = Ilayya;
})();
