(function ($) {
    'use strict';

    class ProductBayTable {
        constructor(wrapper) {
            this.$wrapper = $(wrapper);
            this.tableId = this.$wrapper.attr('id');
            this.config = this.$wrapper.data('config') || {}; // Assume we'll pass some config if needed

            // Elements
            this.$table = this.$wrapper.find('.productbay-table');
            this.$tbody = this.$table.find('tbody');
            this.$searchInput = this.$wrapper.find('.productbay-search input');
            this.$searchClear = this.$wrapper.find('.productbay-search-clear');
            this.$selectAll = this.$wrapper.find('.productbay-select-all');
            this.$bulkBtn = this.$wrapper.find('.productbay-btn-bulk');

            // State
            this.searchTimeout = null;
            this.selectedProducts = new Set();

            this.init();
        }

        init() {
            this.bindEvents();
        }

        bindEvents() {
            // Search
            this.$searchInput.on('input', this.handleSearch.bind(this));
            this.$searchClear.on('click', this.clearSearch.bind(this));

            // Selection
            this.$selectAll.on('change', this.toggleSelectAll.bind(this));
            this.$tbody.on('change', '.productbay-select-product', this.handleRowSelect.bind(this));

            // Bulk Action
            this.$bulkBtn.on('click', this.handleBulkAddToCart.bind(this));
        }

        handleSearch(e) {
            const query = $(e.target).val();

            // Toggle clear button
            if (query.length > 0) {
                this.$wrapper.find('.productbay-search').addClass('has-value');
            } else {
                this.$wrapper.find('.productbay-search').removeClass('has-value');
            }

            // Debounce
            if (this.searchTimeout) clearTimeout(this.searchTimeout);

            this.searchTimeout = setTimeout(() => {
                this.fetchProducts({ s: query, paged: 1, _context: 'search' });
            }, 400);
        }

        clearSearch() {
            this.$searchInput.val('').trigger('input');
        }

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
                ...args
            };

            $.ajax({
                url: productbay_frontend.ajaxurl,
                type: 'POST',
                data: data,
                success: (response) => {
                    if (response.success) {
                        this.$tbody.html(response.data.html);
                        // Also update pagination if returned
                        if (response.data.pagination) {
                            this.$wrapper.find('.productbay-pagination').replaceWith(response.data.pagination);
                        }
                        // Reset selection
                        this.selectedProducts.clear();
                        this.$selectAll.prop('checked', false);
                        this.updateBulkButton();
                    }
                },
                complete: () => {
                    this.$wrapper.removeClass('productbay-loading');
                    this.$wrapper.find('.productbay-search').removeClass('loading');
                }
            });
        }

        toggleSelectAll(e) {
            const isChecked = $(e.target).is(':checked');
            this.$tbody.find('.productbay-select-product').prop('checked', isChecked).trigger('change');
        }

        handleRowSelect(e) {
            const $checkbox = $(e.target);
            const id = $checkbox.val();
            const price = parseFloat($checkbox.data('price') || 0);

            if ($checkbox.is(':checked')) {
                this.selectedProducts.add({ id, price });
            } else {
                // Remove item with matching id
                this.selectedProducts.forEach(item => {
                    if (item.id === id) this.selectedProducts.delete(item);
                });
                // Uncheck select all if one is unchecked
                this.$selectAll.prop('checked', false);
            }
            this.updateBulkButton();
        }

        updateBulkButton() {
            const count = this.selectedProducts.size;
            let totalPrice = 0;
            this.selectedProducts.forEach(item => totalPrice += item.price);

            if (count > 0) {
                const text = `Add ${count} item${count > 1 ? 's' : ''} for $${totalPrice.toFixed(2)}`;
                this.$bulkBtn.text(text).prop('disabled', false);
            } else {
                this.$bulkBtn.html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" style="display:inline-block;vertical-align:middle"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> Add to Cart').prop('disabled', true);
            }
        }

        handleBulkAddToCart(e) {
            e.preventDefault();
            if (this.selectedProducts.size === 0) return;

            const $btn = $(e.target);
            const originalText = $btn.text();
            $btn.text('Adding...').prop('disabled', true);

            const productIds = Array.from(this.selectedProducts).map(item => item.id);

            $.ajax({
                url: productbay_frontend.ajaxurl,
                type: 'POST',
                data: {
                    action: 'productbay_bulk_add_to_cart',
                    nonce: productbay_frontend.nonce,
                    product_ids: productIds
                },
                success: (response) => {
                    if (response.success) {
                        $btn.text('Added!');
                        // Trigger fragment refresh for WC mini cart
                        $(document.body).trigger('wc_fragment_refresh');

                        setTimeout(() => {
                            // Reset
                            this.selectedProducts.clear();
                            this.$selectAll.prop('checked', false);
                            this.$tbody.find('.productbay-select-product').prop('checked', false);
                            this.updateBulkButton();
                        }, 2000);
                    } else {
                        alert(response.data.message || 'Error adding products');
                        $btn.text(originalText).prop('disabled', false);
                    }
                },
                error: () => {
                    alert('Server error');
                    $btn.text(originalText).prop('disabled', false);
                }
            });
        }
    }

    // Initialize on document ready
    $(document).ready(function () {
        $('.productbay-wrapper').each(function () {
            new ProductBayTable(this);
        });
    });

})(jQuery);
