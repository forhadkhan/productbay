/**
 * ProductBay Type Definitions
 *
 * Central type definitions for the ProductBay table configuration system.
 * These interfaces match the backend schema defined in DataArchitectureSpecification.md
 * and are used throughout the React admin interface.
 */

/* =============================================================================
 * Column Visibility Modes
 * =============================================================================
 * Maps to CSS media query classes in the frontend renderer.
 * Controls when columns are visible based on device screen size.
 * ============================================================================= */
export type VisibilityMode =
    | 'default'     // Use system default visibility
    | 'all'         // Visible on all devices
    | 'none'        // Hidden on all devices
    | 'mobile'      // Visible only on mobile (block md:hidden)
    | 'tablet'      // Visible only on tablet
    | 'desktop'     // Visible only on desktop (hidden lg:block)
    | 'not-mobile'  // Hidden on mobile (hidden md:block)
    | 'not-tablet'  // Hidden on tablet
    | 'not-desktop' // Hidden on desktop (block lg:hidden)
    | 'min-tablet'; // Visible on tablet and larger (hidden md:block)

/* =============================================================================
 * Column Types
 * =============================================================================
 * Available column types that can be added to a product table.
 * Each type has specific rendering logic and settings.
 * ============================================================================= */
export type ColumnType =
    | 'checkbox' // Checkbox for row selection
    | 'image'    // Product image with customizable size and link behavior
    | 'name'     // Product name/title
    | 'price'    // Product price (regular and sale)
    | 'sku'      // Stock Keeping Unit
    | 'stock'    // Stock status/quantity
    | 'button'   // Add to cart button
    | 'date'     // Product date (published/modified)
    | 'summary'  // Short description
    | 'tax'      // Taxonomy (category, tag, attribute)
    | 'cf'       // Custom field (meta)
    | 'combined'; // Multiple elements combined in one cell

/* =============================================================================
 * Column Interface
 * =============================================================================
 * Represents a single column in the product table.
 * Stored in _pb_columns meta as an ordered array.
 * ============================================================================= */
export interface Column {
    /** Unique identifier for React keys and DnD */
    id: string;

    /** Column type determines rendering logic */
    type: ColumnType;

    /** Display heading for the column header */
    heading: string;

    /** Advanced display settings */
    advanced: {
        /** Whether to show the column heading */
        showHeading: boolean;

        /** 
         * Column width configuration
         * - 'auto': Let browser determine width (recommended default)
         * - 'px': Fixed pixel width
         * - '%': Percentage of table width
         */
        width: {
            value: number;
            unit: 'auto' | 'px' | '%';
        };

        /** Responsive visibility mode */
        visibility: VisibilityMode;

        /** Display order (used for sorting) */
        order: number;
    };

    /**
     * Type-specific settings
     * - image: { imageSize, linkTarget }
     * - tax: { taxonomy, linkToArchive }
     * - cf: { metaKey }
     * - combined: { layout, elements }
     */
    settings?: Record<string, unknown>;
}

/* =============================================================================
 * Data Source Interface
 * =============================================================================
 * Defines which products to display in the table.
 * Stored in _pb_source meta.
 * ============================================================================= */
export type SourceType = 'all' | 'sale' | 'category' | 'specific';

export interface DataSource {
    /** Source type determines query strategy */
    type: SourceType;

    /** Query arguments for filtering products */
    queryArgs: {
        /** Category IDs for 'category' source type */
        categoryIds: number[];

        /** Tag IDs for additional filtering */
        tagIds: number[];

        /** Product IDs for 'specific' source type */
        postIds: number[];

        /** Product IDs to exclude from results */
        excludes: number[];

        /** Stock status filter */
        stockStatus: 'any' | 'instock' | 'outofstock';

        /** Price range filter */
        priceRange: {
            min: number;
            max: number | null;
        };
    };

    /** Sorting configuration */
    sort: {
        /** Field to sort by (price, date, title, etc.) */
        orderBy: string;

        /** Sort direction */
        order: 'ASC' | 'DESC';
    };
}

/* =============================================================================
 * Table Settings Interface
 * =============================================================================
 * Functional behavior toggles and configurations.
 * Stored in _pb_settings meta.
 * ============================================================================= */
export interface TableSettings {
    /** Feature toggles */
    features: {
        /** Enable search box */
        search: boolean;

        /** Enable column sorting */
        sorting: boolean;

        /** Enable pagination */
        pagination: boolean;

        /** Enable CSV/PDF export */
        export: boolean;

        /** Enable price range filter */
        priceRange: boolean;
    };

    /** Pagination configuration */
    pagination: {
        /** Products per page */
        limit: number;

        /** Pagination position (top, bottom, both) */
        position: 'top' | 'bottom' | 'both';
    };

    /** Cart behavior settings */
    cart: {
        /** Enable add to cart functionality */
        enable: boolean;

        /** Cart interaction method */
        method: 'button' | 'checkbox' | 'text';

        /** Show quantity selector */
        showQuantity: boolean;

        /** Use AJAX for add to cart */
        ajaxAdd: boolean;
    };

    /** Filter configuration */
    filters: {
        /** Enable filters */
        enabled: boolean;

        /** Active taxonomy filters (product_cat, pa_color, etc.) */
        activeTaxonomies: string[];
    };
}

/* =============================================================================
 * Table Style Interface
 * =============================================================================
 * Visual design tokens for table appearance.
 * Stored in _pb_style meta.
 * ============================================================================= */
export interface TableStyle {
    /** Header row styling */
    header: {
        bgColor: string;
        textColor: string;
        fontSize: string;
    };

    /** Body/row styling */
    body: {
        bgColor: string;
        textColor: string;
        rowAlternate: boolean;
        altBgColor: string;
        altTextColor: string;
        borderColor: string;
    };

    /** Button styling (add to cart, etc.) */
    button: {
        bgColor: string;
        textColor: string;
        borderRadius: string;
        icon: string;
        /** Hover state colors */
        hoverBgColor: string;
        hoverTextColor: string;
    };

    /** Layout & Spacing configuration */
    layout: {
        /** Table border style */
        borderStyle: 'none' | 'solid' | 'dashed';
        /** Table border color */
        borderColor: string;
        /** Table border radius */
        borderRadius: string;
        /** Cell padding density */
        cellPadding: 'compact' | 'normal' | 'spacious';
    };

    /** Typography settings */
    typography: {
        /** Header row font weight */
        headerFontWeight: 'normal' | 'bold' | 'extrabold';
    };

    /** Hover & Interaction effects */
    hover: {
        /** Enable row hover effect */
        rowHoverEnabled: boolean;
        /** Row hover background color */
        rowHoverBgColor: string;
    };

    /** Responsive display settings */
    responsive: {
        /** Responsive display mode */
        mode: 'standard' | 'stack' | 'accordion';
    };
}

/* =============================================================================
 * Product Table Interface
 * =============================================================================
 * Master interface representing a complete table configuration.
 * This is what the API GET/POST returns/receives.
 * ============================================================================= */
export interface ProductTable {
    /** Table ID (undefined for new tables) */
    id?: number;

    /** Table name/title */
    title: string;

    /** Publication status */
    status: 'publish' | 'draft';

    /** Author information */
    author?: {
        id: number;
        name: string;
    };

    /** Timestamps */
    date?: {
        created: string;
        modified: string;
    };

    /** Data source configuration (_pb_source) */
    source: DataSource;

    /** Column configuration (_pb_columns) */
    columns: Column[];

    /** Functional settings (_pb_settings) */
    settings: TableSettings;

    /** Visual styling (_pb_style) */
    style: TableStyle;
}

/* =============================================================================
 * Default Values
 * =============================================================================
 * Factory functions for creating default configurations.
 * ============================================================================= */

/** Creates a default DataSource configuration */
export const createDefaultSource = (): DataSource => ({
    type: 'all',
    queryArgs: {
        categoryIds: [],
        tagIds: [],
        postIds: [],
        excludes: [],
        stockStatus: 'any',
        priceRange: { min: 0, max: null },
    },
    sort: {
        orderBy: 'date',
        order: 'DESC',
    },
});

/** Creates a default TableSettings configuration */
export const createDefaultSettings = (): TableSettings => ({
    features: {
        search: true,
        sorting: true,
        pagination: true,
        export: false,
        priceRange: false,
    },
    pagination: {
        limit: 10,
        position: 'bottom',
    },
    cart: {
        enable: true,
        method: 'button',
        showQuantity: true,
        ajaxAdd: true,
    },
    filters: {
        enabled: true,
        activeTaxonomies: ['product_cat'],
    },
});

/** Creates a default TableStyle configuration */
export const createDefaultStyle = (): TableStyle => ({
    header: {
        bgColor: '#f0f0f1',
        textColor: '#333333',
        fontSize: '16px',
    },
    body: {
        bgColor: '#ffffff',
        textColor: '#444444',
        rowAlternate: false,
        altBgColor: '#f9f9f9',
        altTextColor: '#444444',
        borderColor: '#e5e5e5',
    },
    button: {
        bgColor: '#2271b1',
        textColor: '#ffffff',
        borderRadius: '4px',
        icon: 'cart',
        hoverBgColor: '#135e96',
        hoverTextColor: '#ffffff',
    },
    layout: {
        borderStyle: 'solid',
        borderColor: '#e5e5e5',
        borderRadius: '0px',
        cellPadding: 'normal',
    },
    typography: {
        headerFontWeight: 'bold',
    },
    hover: {
        rowHoverEnabled: true,
        rowHoverBgColor: '#f5f5f5',
    },
    responsive: {
        mode: 'standard',
    },
});

/** Creates default columns for a new table */
export const createDefaultColumns = (): Column[] => [
    {
        id: 'col_checkbox_default',
        type: 'checkbox',
        heading: 'Select/Deselect Product(s)',
        advanced: {
            showHeading: true,
            width: { value: 64, unit: 'px' },
            visibility: 'all',
            order: 0,
        },
    },
    {
        id: 'col_image_default',
        type: 'image',
        heading: 'Image',
        advanced: {
            showHeading: true,
            width: { value: 72, unit: 'px' },
            visibility: 'all',
            order: 1,
        },
        settings: {
            imageSize: 'thumbnail',
            linkTarget: 'product',
        },
    },
    {
        id: 'col_name_default',
        type: 'name',
        heading: 'Product',
        advanced: {
            showHeading: true,
            width: { value: 0, unit: 'auto' },
            visibility: 'all',
            order: 2,
        },
    },
    {
        id: 'col_price_default',
        type: 'price',
        heading: 'Price',
        advanced: {
            showHeading: true,
            width: { value: 0, unit: 'auto' },
            visibility: 'all',
            order: 3,
        },
    },
    {
        id: 'col_button_default',
        type: 'button',
        heading: 'Add to Cart',
        advanced: {
            showHeading: true,
            width: { value: 0, unit: 'auto' },
            visibility: 'all',
            order: 4,
        },
    },
];

/** Generates a unique column ID */
export const generateColumnId = (): string =>
    `col_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

