(function ($) {
    'use strict';

    /**
     * Format a price value using WooCommerce currency settings
     * passed via wp_localize_script.
     */
    function formatPrice(amount) {
        const cfg = window.productbay_frontend || {};
        const decimals = parseInt(cfg.currency_decimals, 10) || 2;
        const decSep = cfg.currency_decimal_sep || '.';
        const thousandSep = cfg.currency_thousand_sep || ',';
        const symbol = cfg.currency_symbol || '$';
        const position = cfg.currency_position || 'left';

        // Format the number
        let number = parseFloat(amount).toFixed(decimals);
        const parts = number.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSep);
        number = parts.join(decSep);

        switch (position) {
            case 'left':
                return symbol + number;
            case 'right':
                return number + symbol;
            case 'left_space':
                return symbol + '\u00a0' + number;
            case 'right_space':
                return number + '\u00a0' + symbol;
            default:
                return symbol + number;
        }
    }

    class ProductBayTable {
        constructor(wrapper) {
            this.$wrapper = $(wrapper);
            this.tableId = this.$wrapper.attr('id');

            // Elements
            this.$table = this.$wrapper.find('.productbay-table');
            this.$tbody = this.$table.find('tbody');
            this.$searchInput = this.$wrapper.find('.productbay-search input');
            this.$searchClear = this.$wrapper.find('.productbay-search-clear');
            this.$selectAll = this.$wrapper.find('.productbay-select-all');
            this.$bulkBtn = this.$wrapper.find('.productbay-btn-bulk');

            // State
            this.searchTimeout = null;
            // Map: productId → { quantity, price, variationId, attributes }
            this.selectedProducts = new Map();
            // Map: cartKey → { quantity, variationId, attributes, productId }
            this.cartQuantities = new Map();
            this.loadSelectionsFromStorage();
            this.loadCartQuantitiesFromStorage(); // New: load previous add-to-cart actions

            this.init();
        }

        init() {
            this.features = JSON.parse(this.$wrapper.attr('data-features') || '{}');
            this.bindEvents();
        }

        /**
         * Build a unique cart key from product ID and attributes.
         * Uses attribute values (sorted) to ensure each unique combination
         * gets its own entry, even when WooCommerce maps multiple combos
         * to the same variation_id ("any" attribute case).
         */
        buildCartKey(productId, variationId, attributes) {
            if (!variationId) return String(productId);
            const attrValues = Object.entries(attributes || {})
                .filter(([, v]) => v)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([, v]) => v)
                .join('|');
            return `${productId}:${attrValues || variationId}`;
        }

        bindEvents() {
            // Search
            this.$searchInput.on('input', this.handleSearch.bind(this));
            this.$searchClear.on('click', this.clearSearch.bind(this));

            // Selection
            this.$selectAll.on('change', this.toggleSelectAll.bind(this));
            this.$tbody.on('change', '.productbay-select-product', this.handleRowSelect.bind(this));

            // Quantity changes
            this.$tbody.on('input', '.productbay-qty', this.handleQuantityChange.bind(this));
            this.$tbody.on('blur', '.productbay-qty', this.handleQuantityBlur.bind(this));

            // Variation selection
            this.$tbody.on('change', '.productbay-variation-select', this.handleVariationChange.bind(this));

            // Quantity +/- buttons
            this.$tbody.on('click', '.productbay-qty-minus', this.handleQtyMinus.bind(this));
            this.$tbody.on('click', '.productbay-qty-plus', this.handleQtyPlus.bind(this));

            // Single add-to-cart buttons
            this.$tbody.on('click', '.productbay-btn-addtocart', this.handleSingleAddToCart.bind(this));

            // Bulk Action
            this.$bulkBtn.on('click', this.handleBulkAddToCart.bind(this));

            // Pagination (delegated, since pagination HTML gets replaced)
            this.$wrapper.on('click', '.productbay-pagination a', this.handlePagination.bind(this));

            // Sync with actual WooCommerce Cart on AJAX refreshes
            $(document.body).on('wc_fragments_refreshed wc_fragments_loaded', this.syncWithWCCart.bind(this));
        }

        /**
         * Parses the injected JSON cart data from the AJAX fragments.
         * Syncs this.cartQuantities with actual WooCommerce cart.
         */
        syncWithWCCart() {
            const $cartData = $('.productbay-cart-data').last();
            if ($cartData.length) {
                try {
                    const data = $cartData.data('cart');
                    if (Array.isArray(data)) {
                        this.cartQuantities.clear();
                        data.forEach(([k, v]) => this.cartQuantities.set(k, v));
                        this.saveCartQuantitiesToStorage();
                        
                        // Give DOM a frame to settle, then redraw badges & buttons
                        setTimeout(() => this.restoreCartBadges(), 50);
                    }
                } catch (e) {
                    console.error('ProductBay: Failed to sync with WooCommerce cart fragments.', e);
                }
            }
        }

        // ── Search ───────────────────────────────────────────────────────

        handleSearch(e) {
            const query = $(e.target).val();

            if (query.length > 0) {
                this.$wrapper.find('.productbay-search').addClass('has-value');
            } else {
                this.$wrapper.find('.productbay-search').removeClass('has-value');
            }

            if (this.searchTimeout) clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.fetchProducts({ s: query, paged: 1, _context: 'search' });
            }, 400);
        }

        clearSearch() {
            this.$searchInput.val('').trigger('input');
        }

        // ── Pagination ──────────────────────────────────────────────────

        handlePagination(e) {
            e.preventDefault();
            const href = $(e.currentTarget).attr('href');

            // 1. Try to get page number from query string (e.g. ?paged=2)
            const url = new URL(href, window.location.origin);
            let paged = url.searchParams.get('paged');

            // 2. If not found, try to extract from path (e.g. /page/2/ or /page/2)
            if (!paged) {
                const match = href.match(/\/page\/(\d+)\/?/);
                if (match) {
                    paged = match[1];
                }
            }

            paged = parseInt(paged, 10) || 1;
            const search = this.$searchInput.val() || '';
            this.fetchProducts({ s: search, paged: paged, _context: 'pagination' });
        }

        // ── AJAX Fetch ──────────────────────────────────────────────────

        fetchProducts(args) {
            const context = args._context || 'table';
            delete args._context;

            if (context === 'search') {
                this.$wrapper.find('.productbay-search').addClass('loading');
            } else {
                this.$wrapper.addClass('productbay-loading');
            }

            const data = {
                action: 'productbay_filter',
                nonce: productbay_frontend.nonce,
                table_id: this.$wrapper.data('table-id'),
                page_url: window.location.origin + window.location.pathname,
                ...args
            };

            $.ajax({
                url: productbay_frontend.ajaxurl,
                type: 'POST',
                data: data,
                success: (response) => {
                    if (response.success) {
                        this.$tbody.html(response.data.html);
                        if (response.data.pagination) {
                            this.$wrapper.find('.productbay-pagination').replaceWith(response.data.pagination);
                        }
                        // Restore selections for products visible on the new page
                        this.restoreSelections();
                    }
                },
                complete: () => {
                    this.$wrapper.removeClass('productbay-loading');
                    this.$wrapper.find('.productbay-search').removeClass('loading');
                }
            });
        }
        
        loadSelectionsFromStorage() {
            try {
                const key = 'productbay_selections_' + this.$wrapper.data('table-id');
                const stored = sessionStorage.getItem(key);
                if (stored) {
                    const entries = JSON.parse(stored);
                    entries.forEach(([k, v]) => this.selectedProducts.set(k, v));
                }
            } catch (e) { /* silent */ }
        }

        saveSelectionsToStorage() {
            try {
                const key = 'productbay_selections_' + this.$wrapper.data('table-id');
                const entries = Array.from(this.selectedProducts.entries());
                sessionStorage.setItem(key, JSON.stringify(entries));
            } catch (e) { /* silent */ }
        }

        loadCartQuantitiesFromStorage() {
            try {
                const key = 'productbay_cart_' + this.$wrapper.data('table-id');
                const stored = sessionStorage.getItem(key);
                if (stored) {
                    const entries = JSON.parse(stored);
                    entries.forEach(([k, v]) => this.cartQuantities.set(k, v));
                }
            } catch (e) { /* silent */ }
        }

        saveCartQuantitiesToStorage() {
            try {
                const key = 'productbay_cart_' + this.$wrapper.data('table-id');
                const entries = Array.from(this.cartQuantities.entries());
                sessionStorage.setItem(key, JSON.stringify(entries));
            } catch (e) { /* silent */ }
        }

        restoreSelections() {
            this.$tbody.find('.productbay-select-product').each((_, el) => {
                const $cb = $(el);
                const id = $cb.val();
                if (this.selectedProducts.has(id)) {
                    $cb.prop('checked', true);
                }
            });
            this.syncSelectAllCheckbox();
            this.updateBulkButton();
            this.restoreCartBadges(); // New: re-render badges & buttons
        }

        restoreCartBadges() {
            // Re-render variation badges and button text based on persisted cart quantities
            this.$tbody.find('tr').each((_, row) => {
                const $row = $(row);
                const productId = String($row.data('product-id'));
                const isVariable = $row.find('.productbay-variable-wrap').length > 0;
                
                if (isVariable) {
                    // It's a variable product. Only render if feature enabled.
                    if (this.features.variationBadges !== false) {
                        this.renderVariationBadges(productId);
                    }
                } else {
                    // Simple product - restore checkmark on button
                    const cartKey = String(productId);
                    const existing = this.cartQuantities.get(cartKey);
                    if (existing) {
                        const $btn = $row.find('.productbay-btn-addtocart');
                        if ($btn.length) {
                            if (!$btn.data('original-text')) {
                                $btn.data('original-text', $btn.text());
                            }
                            const originalLabel = $btn.data('original-text');
                            const checkSvg = '<svg class="productbay-check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="12" height="12"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                            $btn.html((originalLabel || $btn.text()) + ` <span class="productbay-added-badge">(${checkSvg} ${existing.quantity})</span>`);
                        }
                        
                        // Also restore Add to cart view-cart link
                        const $parentCell = $btn.closest('.productbay-btn-cell');
                        if (!$parentCell.find('.productbay-added-to-cart').length) {
                            const cartUrl = productbay_frontend.cart_url || '#';
                            const cartText = productbay_frontend.view_cart_text || 'View cart';
                            $parentCell.append(
                                '<a href="' + cartUrl + '" class="productbay-added-to-cart">' + cartText + '</a>'
                            );
                        }
                    }
                }
            });
        }

        syncSelectAllCheckbox() {
            const $checkboxes = this.$tbody.find('.productbay-select-product:not(:disabled)');
            const $checked = $checkboxes.filter(':checked');
            this.$selectAll.prop('checked', $checkboxes.length > 0 && $checkboxes.length === $checked.length);
        }

        // ── Selection ───────────────────────────────────────────────────

        toggleSelectAll(e) {
            const isChecked = $(e.target).is(':checked');
            // Only toggle non-disabled checkboxes
            this.$tbody.find('.productbay-select-product:not(:disabled)').each((_, el) => {
                const $cb = $(el);
                const wasChecked = $cb.is(':checked');
                $cb.prop('checked', isChecked);
                // Trigger change only if state actually changed
                if (wasChecked !== isChecked) {
                    $cb.trigger('change');
                }
            });
            this.saveSelectionsToStorage();
        }

        handleRowSelect(e) {
            const $checkbox = $(e.target);
            if ($checkbox.is(':disabled')) return;

            const $row = $checkbox.closest('tr');
            const id = $checkbox.val();
            const price = parseFloat($checkbox.data('price') || 0);

            if ($checkbox.is(':checked')) {
                // Read current quantity from the row
                const $qtyInput = $row.find('.productbay-qty');
                const quantity = $qtyInput.length ? parseInt($qtyInput.val(), 10) || 1 : 1;

                // Read variation data if variable product
                const $variableWrap = $row.find('.productbay-variable-wrap');
                let variationId = 0;
                let attributes = {};
                let currentPrice = price;

                if ($variableWrap.length) {
                    variationId = parseInt($variableWrap.find('.productbay-variation-id').val(), 10) || 0;
                    $variableWrap.find('.productbay-variation-select').each(function () {
                        const name = $(this).data('attribute-name');
                        attributes[name] = $(this).val();
                    });
                    // Use variation price if available
                    const varPrice = $variableWrap.data('current-variation-price');
                    if (varPrice) currentPrice = parseFloat(varPrice);
                }

                this.selectedProducts.set(id, {
                    quantity,
                    price: currentPrice,
                    variationId,
                    attributes,
                    productType: $row.data('product-type') || 'simple'
                });
            } else {
                this.selectedProducts.delete(id);
                this.$selectAll.prop('checked', false);
            }

            this.updateBulkButton();
            this.saveSelectionsToStorage();
        }

        // ── Quantity ────────────────────────────────────────────────────

        handleQuantityChange(e) {
            const $input = $(e.target);
            const $row = $input.closest('tr');
            const $checkbox = $row.find('.productbay-select-product');
            const id = $checkbox.val();

            const min = parseInt($input.attr('min'), 10) || 1;
            const max = parseInt($input.attr('max'), 10) || Infinity;
            let val = parseInt($input.val(), 10);

            // Handle NaN / empty
            if (isNaN(val) || val < min) val = min;
            if (max !== Infinity && val > max) val = max;

            $input.val(val);
            this.updateQtyButtons($input, val, min, max);

            // Update selected product if checked
            if (this.selectedProducts.has(id)) {
                const item = this.selectedProducts.get(id);
                item.quantity = val;
                this.updateBulkButton();
                this.saveSelectionsToStorage();
            }
        }

        /**
         * Clamp on blur — enforces final value when user leaves the field
         */
        handleQuantityBlur(e) {
            this.handleQuantityChange(e);
        }

        handleQtyMinus(e) {
            const $btn = $(e.currentTarget);
            const $input = $btn.closest('.productbay-qty-wrap').find('.productbay-qty');
            const min = parseInt($input.attr('min'), 10) || 1;
            let val = parseInt($input.val(), 10);
            if (isNaN(val)) val = min;
            if (val > min) {
                $input.val(val - 1).trigger('input');
            }
        }

        handleQtyPlus(e) {
            const $btn = $(e.currentTarget);
            const $input = $btn.closest('.productbay-qty-wrap').find('.productbay-qty');
            const max = parseInt($input.attr('max'), 10) || Infinity;
            let val = parseInt($input.val(), 10);
            if (isNaN(val)) val = 0;
            if (val < max) {
                $input.val(val + 1).trigger('input');
            }
        }

        /**
         * Disable the ▲/▼ buttons when at stock limits
         */
        updateQtyButtons($input, val, min, max) {
            const $wrap = $input.closest('.productbay-qty-wrap');
            $wrap.find('.productbay-qty-minus').prop('disabled', val <= min);
            $wrap.find('.productbay-qty-plus').prop('disabled', max !== Infinity && val >= max);
        }

        // ── Variation Selection ─────────────────────────────────────────

        handleVariationChange(e) {
            const $select = $(e.target);
            const $wrap = $select.closest('.productbay-variable-wrap');
            const $row = $wrap.closest('tr');
            const $btn = $wrap.find('.productbay-btn-addtocart');
            const $variationIdInput = $wrap.find('.productbay-variation-id');
            const $priceDisplay = $wrap.find('.productbay-variation-price');
            const $checkbox = $row.find('.productbay-select-product');
            const $qtyInput = $wrap.find('.productbay-qty');
            const variations = $wrap.data('product-variations') || [];
            const id = $checkbox.val();

            // Collect current selections
            const selected = {};
            let allSelected = true;
            $wrap.find('.productbay-variation-select').each(function () {
                const name = $(this).data('attribute-name');
                const val = $(this).val();
                selected[name] = val;
                if (!val) allSelected = false;
            });

            if (!allSelected) {
                // Variation incomplete: disable button + checkbox
                $btn.prop('disabled', true);
                $variationIdInput.val('');
                $priceDisplay.html('');
                $wrap.removeData('current-variation-price');

                // Disable checkbox and uncheck if was checked
                $checkbox.prop('disabled', true);
                if ($checkbox.is(':checked')) {
                    $checkbox.prop('checked', false);
                    this.selectedProducts.delete(id);
                    this.updateBulkButton();
                }
                return;
            }

            // Find matching variation
            const match = variations.find(v => {
                return Object.keys(selected).every(attr => {
                    const vAttr = v.attributes[attr];
                    return vAttr === '' || vAttr === selected[attr];
                });
            });

            if (match && match.is_purchasable && match.is_in_stock) {
                // Variation valid: enable button + checkbox (like a simple product)
                $btn.prop('disabled', false);
                $variationIdInput.val(match.variation_id);
                $priceDisplay.html(match.price_html);
                $wrap.data('current-variation-price', match.display_price);

                // Update quantity max based on variation stock
                if (match.max_qty && match.max_qty !== '') {
                    $qtyInput.attr('max', match.max_qty);
                } else {
                    $qtyInput.removeAttr('max');
                }

                // Enable the row checkbox
                $checkbox.prop('disabled', false);
                $checkbox.data('price', match.display_price);

                // Update bulk selection if already checked
                if (this.selectedProducts.has(id)) {
                    const item = this.selectedProducts.get(id);
                    item.variationId = match.variation_id;
                    item.price = match.display_price;
                    item.attributes = selected;
                    this.updateBulkButton();
                    this.saveSelectionsToStorage();
                }

                // Update button for the new variation — check if THIS variation was already added
                const cartKey = this.buildCartKey($wrap.data('product-id'), match.variation_id, selected);
                const existing = this.cartQuantities.get(cartKey);
                if (existing) {
                    const checkSvg = '<svg class="productbay-check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="12" height="12"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                    $btn.html((originalLabel || $btn.text()) + ` <span class="productbay-added-badge">(${checkSvg} ${existing.quantity})</span>`);
                } else {
                    $btn.html(originalLabel || $btn.text());
                }
            } else {
                // Variation invalid/out-of-stock: disable button + checkbox
                $btn.prop('disabled', true);
                $variationIdInput.val('');
                $priceDisplay.html('');
                $wrap.removeData('current-variation-price');

                $checkbox.prop('disabled', true);
                if ($checkbox.is(':checked')) {
                    $checkbox.prop('checked', false);
                    this.selectedProducts.delete(id);
                    this.updateBulkButton();
                    this.saveSelectionsToStorage();
                }
            }
        }

        // ── Single Add to Cart ──────────────────────────────────────────

        handleSingleAddToCart(e) {
            e.preventDefault();
            const $btn = $(e.currentTarget);
            if ($btn.is(':disabled')) return;

            const $wrap = $btn.closest('.productbay-btn-cell');
            const productId = $btn.data('product-id') || $btn.closest('.productbay-variable-wrap').data('product-id') || $btn.closest('tr').data('product-id');
            const $qtyInput = $wrap.find('.productbay-qty');
            const quantity = $qtyInput.length ? parseInt($qtyInput.val(), 10) || 1 : 1;

            // Variable product: get variation data
            let variationId = 0;
            const attributes = {};
            const $variableWrap = $wrap.closest('.productbay-variable-wrap');
            if ($variableWrap.length) {
                variationId = parseInt($variableWrap.find('.productbay-variation-id').val(), 10) || 0;
                if (!variationId) {
                    alert('Please select product options first.');
                    return;
                }
                $variableWrap.find('.productbay-variation-select').each(function () {
                    attributes[$(this).data('attribute-name')] = $(this).val();
                });
            }

            // Store original label (without any existing checkmark badge)
            if (!$btn.data('original-text')) {
                $btn.data('original-text', $btn.text());
            }
            const originalLabel = $btn.data('original-text');
            $btn.text('Adding...').prop('disabled', true);

            $.ajax({
                url: productbay_frontend.ajaxurl,
                type: 'POST',
                data: {
                    action: 'productbay_bulk_add_to_cart',
                    nonce: productbay_frontend.nonce,
                    items: [{
                        product_id: productId,
                        quantity: quantity,
                        variation_id: variationId,
                        attributes: attributes
                    }]
                },
                success: (response) => {
                    if (response.success) {
                        $(document.body).trigger('wc_fragment_refresh');

                        // Track accumulated cart quantity
                        const cartKey = this.buildCartKey(productId, variationId, attributes);
                        const prevEntry = this.cartQuantities.get(cartKey);
                        const prevQty = prevEntry ? prevEntry.quantity : 0;
                        const newQty = prevQty + quantity;
                        
                        // We store an object for all cart quantities to support variation badge generation easily
                        this.cartQuantities.set(cartKey, {
                            quantity: newQty,
                            variationId: variationId,
                            attributes: Object.assign({}, attributes),
                            productId: productId 
                        });
                        this.saveCartQuantitiesToStorage(); // <-- Persist

                        // Update button text with SVG checkmark and quantity
                        const checkSvg = '<svg class="productbay-check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="12" height="12"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                        $btn.html(originalLabel + ' <span class="productbay-added-badge">(' + checkSvg + ' ' + newQty + ')</span>');
                        $btn.prop('disabled', false);
                        
                        if (variationId && this.features.variationBadges !== false) {
                            this.renderVariationBadges(productId);
                        }

                        // Inject "View Cart" link if not already present
                        const $parentCell = $wrap;
                        if (!$parentCell.find('.productbay-added-to-cart').length) {
                            const cartUrl = productbay_frontend.cart_url || '#';
                            const cartText = productbay_frontend.view_cart_text || 'View cart';
                            $parentCell.append(
                                '<a href="' + cartUrl + '" class="productbay-added-to-cart">' + cartText + '</a>'
                            );
                        }
                    } else {
                        const msg = response.data?.errors?.join('\n') || response.data?.message || 'Error adding product.';
                        alert(msg);
                        $btn.text(originalLabel).prop('disabled', false);
                    }
                },
                error: () => {
                    alert('Server error');
                    $btn.text(originalLabel).prop('disabled', false);
                }
            });
        }

        // ── Bulk Add to Cart ────────────────────────────────────────────

        updateBulkButton() {
            const count = this.selectedProducts.size;
            let totalItems = 0;
            let totalPrice = 0;

            this.selectedProducts.forEach(item => {
                totalItems += item.quantity;
                totalPrice += item.quantity * item.price;
            });

            if (count > 0) {
                const text = `Add ${totalItems} item${totalItems > 1 ? 's' : ''} for ${formatPrice(totalPrice)}`;
                this.$bulkBtn.text(text).prop('disabled', false);
            } else {
                this.$bulkBtn.html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" style="display:inline-block;vertical-align:middle"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> Add to Cart').prop('disabled', true);
            }
        }

        handleBulkAddToCart(e) {
            e.preventDefault();
            if (this.selectedProducts.size === 0) return;

            // Validate variable products have variations selected
            const invalidItems = [];
            this.selectedProducts.forEach((item, id) => {
                if (item.productType === 'variable' && !item.variationId) {
                    invalidItems.push(id);
                }
            });

            if (invalidItems.length > 0) {
                alert('Please select options for all variable products before adding to cart.');
                return;
            }

            const $btn = this.$bulkBtn;
            const originalText = $btn.text();
            $btn.text('Adding...').prop('disabled', true);

            // Build items array
            const items = [];
            this.selectedProducts.forEach((item, id) => {
                items.push({
                    product_id: id,
                    quantity: item.quantity,
                    variation_id: item.variationId || 0,
                    attributes: item.attributes || {}
                });
            });

            $.ajax({
                url: productbay_frontend.ajaxurl,
                type: 'POST',
                data: {
                    action: 'productbay_bulk_add_to_cart',
                    nonce: productbay_frontend.nonce,
                    items: items
                },
                success: (response) => {
                    if (response.success) {
                        $btn.text('Added!');
                        $(document.body).trigger('wc_fragment_refresh');

                        // Show warnings if any
                        if (response.data.warnings && response.data.warnings.length > 0) {
                            setTimeout(() => {
                                alert('Some items had issues:\n' + response.data.warnings.join('\n'));
                            }, 500);
                        }
                        
                        // Update variation badges for variable products we just added
                        this.selectedProducts.forEach((item, id) => {
                            if (item.productType === 'variable') {
                                const cartKey = this.buildCartKey(id, item.variationId, item.attributes);
                                const prevEntry = this.cartQuantities.get(cartKey);
                                const prevQty = prevEntry ? prevEntry.quantity : 0;
                                const newQty = prevQty + item.quantity;
                                this.cartQuantities.set(cartKey, {
                                    quantity: newQty,
                                    variationId: item.variationId,
                                    attributes: Object.assign({}, item.attributes),
                                    productId: id 
                                });
                                
                                if (item.variationId && this.features.variationBadges !== false) {
                                    this.renderVariationBadges(id);
                                }
                            } else {
                                const cartKey = String(id);
                                const prevEntry = this.cartQuantities.get(cartKey);
                                const prevQty = prevEntry ? prevEntry.quantity : 0;
                                const newQty = prevQty + item.quantity;
                                this.cartQuantities.set(cartKey, {
                                    quantity: newQty,
                                    productId: id 
                                });
                            }
                            
                            // Let's also refresh single add to cart buttons for items added in bulk
                            const $btn = this.$tbody.find(`tr[data-product-id="${id}"] .productbay-btn-addtocart`);
                            if ($btn.length) {
                                if (!$btn.data('original-text')) {
                                    $btn.data('original-text', $btn.text());
                                }
                                const originalLabel = $btn.data('original-text');
                                
                                const cartKey = this.buildCartKey(id, item.variationId, item.attributes);
                                const existing = this.cartQuantities.get(cartKey);
                                if (existing) {
                                    const checkSvg = '<svg class="productbay-check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="12" height="12"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                                    $btn.html((originalLabel || $btn.text()) + ` <span class="productbay-added-badge">(${checkSvg} ${existing.quantity})</span>`);
                                }
                            }
                        });
                        this.saveCartQuantitiesToStorage(); // <-- Persist after bulk add

                        setTimeout(() => {
                            this.selectedProducts.clear();
                            this.$selectAll.prop('checked', false);
                            this.$tbody.find('.productbay-select-product').prop('checked', false);
                            this.updateBulkButton();
                            this.saveSelectionsToStorage();
                        }, 2000);
                    } else {
                        const msg = response.data?.errors?.join('\n') || response.data?.message || 'Error adding products.';
                        alert(msg);
                        $btn.text(originalText).prop('disabled', false);
                    }
                },
                error: () => {
                    alert('Server error');
                    $btn.text(originalText).prop('disabled', false);
                }
            });
        }
        
        getAddedVariationsForProduct(productId) {
            const results = [];
            this.cartQuantities.forEach((data, key) => {
                if (String(data.productId) === String(productId) && data.variationId) {
                    // Build human-readable label from attributes
                    const attrParts = [];
                    if (data.attributes) {
                        Object.entries(data.attributes).forEach(([key, val]) => {
                            if (val) {
                                // Simple text processing for attribute keys
                                const label = key.replace('attribute_pa_', '').replace('attribute_', '').replace(/-/g, ' ');
                                attrParts.push(val); // Only pushing the selected value for brevity.
                            }
                        });
                    }
                    results.push({
                        key: key,
                        variationId: data.variationId,
                        quantity: data.quantity,
                        label: attrParts.join(' / ') || 'Default'
                    });
                }
            });
            return results;
        }

        renderVariationBadges(productId) {
            const $row = this.$tbody.find(`tr[data-product-id="${productId}"]`);
            const $wrap = $row.find('.productbay-variable-wrap');
            if (!$wrap.length) return;

            const badges = this.getAddedVariationsForProduct(productId);
            if (badges.length === 0) return;

            // Remove existing badges container
            $wrap.find('.productbay-variation-badges').remove();

            let html = '<div class="productbay-variation-badges">';
            badges.forEach(b => {
                html += `<span class="productbay-variation-badge">
                    <svg class="productbay-check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="10" height="10" style="display:inline;vertical-align:middle;margin-right:2px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    ${b.label} (×${b.quantity})
                </span>`;
            });
            html += '</div>';

            $wrap.find('.productbay-btn-cell').before(html);
        }
    }

    // Initialize on document ready
    $(document).ready(function () {
        $('.productbay-wrapper').each(function () {
            new ProductBayTable(this);
        });
    });

})(jQuery);
