/**
 * =============================================================================
 * ColorPicker Component
 * =============================================================================
 *
 * A fully custom, dependency-free color picker component inspired by Sketch.
 * Built entirely with React, no external color picker libraries required.
 *
 * -----------------------------------------------------------------------------
 * FEATURES:
 * -----------------------------------------------------------------------------
 * - Saturation/Brightness picker (HSV-based)
 * - Hue slider (0-360 degrees)
 * - Alpha/opacity slider with transparency preview
 * - Multiple color format support: HEX, RGB(A), HSL(A)
 * - Real-time format switching with automatic value conversion
 * - Customizable color preset swatches
 * - Internationalization ready (i18n via @wordpress/i18n)
 *
 * INTERACTION SUPPORT:
 * - Pointer Events API: Unified mouse, touch, and pen/stylus support
 * - Touch Support: Works on mobile/tablet with touch gestures
 * - Keyboard Navigation:
 *   - Arrow keys: Fine adjustment (1% step)
 *   - Shift + Arrow keys: Larger adjustment (10% step)
 *   - Page Up/Down: Larger vertical jumps
 *   - Home/End: Jump to min/max values
 *   - Tab: Navigate between picker areas
 *   - Enter/Space: Toggle popover open/close
 *   - Escape: Close popover
 * - Visual Feedback: Focus rings, active states, hover effects
 * - ARIA: Proper slider roles with live value feedback
 *
 * -----------------------------------------------------------------------------
 * ENVIRONMENT COMPATIBILITY:
 * -----------------------------------------------------------------------------
 * - React 16.8+ (requires Hooks API)
 * - Works with SSR frameworks (Next.js, Gatsby) - uses window/document checks
 * - Compatible with CSS-in-JS and utility-first CSS (Tailwind via cn utility)
 * - WordPress Gutenberg compatible (uses @wordpress/i18n)
 * - No external color picker dependencies (react-colorful, etc.)
 *
 * -----------------------------------------------------------------------------
 * BROWSER SUPPORT:
 * -----------------------------------------------------------------------------
 * - All modern browsers (Chrome, Firefox, Safari, Edge)
 * - Pointer Events API: Supported in all modern browsers (IE11+ with polyfill)
 * - Touch Events: Full support on iOS Safari, Chrome for Android
 * - CSS features used: linear-gradient, transform, flexbox, grid
 *
 * -----------------------------------------------------------------------------
 * USAGE EXAMPLE:
 * -----------------------------------------------------------------------------
 * ```tsx
 * import { ColorPicker } from '@/components/ui/ColorPicker';
 *
 * const MyComponent = () => {
 *     const [color, setColor] = useState('#ff5500');
 *
 *     return (
 *         <ColorPicker
 *             value={color}
 *             onChange={setColor}
 *             showAlpha={true}
 *             showPresets={true}
 *         />
 *     );
 * };
 * ```
 *
 * @module ColorPicker
 * @author forhadakhan
 */

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Pencil, X } from 'lucide-react';
import { __ } from '@wordpress/i18n';
import { cn } from '@/utils/cn';

/* =============================================================================
 * TYPE DEFINITIONS
 * ============================================================================= */

/**
 * Supported color format types for the format switcher.
 *
 * - 'hex': Hexadecimal format (#RRGGBB or #RRGGBBAA)
 * - 'rgb': RGB/RGBA format (rgba(r, g, b, a))
 * - 'hsl': HSL/HSLA format (hsla(h, s%, l%, a))
 */
export type ColorFormat = 'hex' | 'rgb' | 'hsl';

/* =============================================================================
 * CONSTANTS
 * ============================================================================= */

/**
 * Default color presets displayed in the picker.
 * A curated palette inspired by popular design tools (Sketch, Figma).
 * Contains common colors ranging from neutrals to vibrant hues.
 */
const DEFAULT_PRESETS = [
    '#000000', '#4D4D4D', '#999999', '#FFFFFF', '#F44E3B', '#FE9200', '#FCDC00',
    '#DBDF00', '#A4DD00', '#68CCCA', '#73D8FF', '#AEA1FF', '#FDA1FF', '#333333',
    '#808080', '#cccccc', '#D33115', '#E27300', '#FCC400', '#B0BC00', '#68BC00',
    '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF', '#000000', '#666666', '#B3B3B3',
    '#9F0500', '#C45100', '#FB9E00', '#808900', '#194D33', '#0C797D', '#0062B1',
    '#653294', '#AB149E'
];

/* =============================================================================
 * HELPER COMPONENTS
 * ============================================================================= */

/**
 * Checkerboard pattern component for transparency visualization.
 *
 * Creates a classic checkerboard pattern used behind transparent colors
 * to visually indicate the level of opacity. This is the standard approach
 * used in professional design tools.
 *
 * @param props.className - Additional CSS classes to apply
 *
 * @example
 * <div className="relative">
 *     <Checkerboard />
 *     <div style={{ backgroundColor: 'rgba(255, 0, 0, 0.5)' }} />
 * </div>
 */
const Checkerboard: React.FC<{ className?: string }> = ({ className }) => (
    <div
        className={cn("absolute inset-0 rounded-full overflow-hidden bg-white", className)}
        style={{
            // Creates a checkerboard pattern using overlapping diagonal gradients
            // This technique avoids the need for an image asset
            backgroundImage: `
                linear-gradient(45deg, #eee 25%, transparent 25%), 
                linear-gradient(-45deg, #eee 25%, transparent 25%), 
                linear-gradient(45deg, transparent 75%, #eee 75%), 
                linear-gradient(-45deg, transparent 75%, #eee 75%)
            `,
            backgroundSize: '10px 10px',
            backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px'
        }}
    />
);

/* =============================================================================
 * COLOR CONVERSION UTILITIES
 * =============================================================================
 *
 * Pure functions for converting between color spaces. All functions are
 * self-contained with no external dependencies.
 *
 * Color Spaces Overview:
 * - RGB: Red, Green, Blue (0-255 each)
 * - HSL: Hue (0-360°), Saturation (0-100%), Lightness (0-100%)
 * - HSV: Hue (0-360°), Saturation (0-100%), Value/Brightness (0-100%)
 * - HEX: Hexadecimal representation of RGB (#RRGGBB or #RRGGBBAA)
 *
 * Why HSV for the picker?
 * The saturation-brightness picker uses HSV because it maps more intuitively
 * to a 2D plane where X = Saturation and Y = Value (brightness). HSL's
 * lightness doesn't work as well for this visual representation.
 */

/**
 * Converts a hexadecimal color string to RGBA components.
 *
 * Supports multiple hex formats:
 * - 3-character shorthand (#RGB → #RRGGBB)
 * - 6-character standard (#RRGGBB)
 * - 8-character with alpha (#RRGGBBAA)
 *
 * @param hex - Hex color string (with or without # prefix)
 * @returns Object containing r, g, b (0-255) and a (0-1) values
 *
 * @example
 * hexToRgba('#ff5500')    // { r: 255, g: 85, b: 0, a: 1 }
 * hexToRgba('#f50')       // { r: 255, g: 85, b: 0, a: 1 }
 * hexToRgba('#ff550080')  // { r: 255, g: 85, b: 0, a: 0.5 }
 */
const hexToRgba = (hex: string): { r: number; g: number; b: number; a: number } => {
    let r = 0, g = 0, b = 0, a = 1;

    // Remove the # prefix if present
    const h = hex.replace('#', '');

    if (h.length === 3) {
        // Shorthand format: #RGB → #RRGGBB
        r = parseInt(h[0] + h[0], 16);
        g = parseInt(h[1] + h[1], 16);
        b = parseInt(h[2] + h[2], 16);
    } else if (h.length === 6) {
        // Standard format: #RRGGBB
        r = parseInt(h.substring(0, 2), 16);
        g = parseInt(h.substring(2, 4), 16);
        b = parseInt(h.substring(4, 6), 16);
    } else if (h.length === 8) {
        // With alpha: #RRGGBBAA
        r = parseInt(h.substring(0, 2), 16);
        g = parseInt(h.substring(2, 4), 16);
        b = parseInt(h.substring(4, 6), 16);
        // Convert alpha from 0-255 to 0-1 range, rounded to 2 decimal places
        a = Math.round((parseInt(h.substring(6, 8), 16) / 255) * 100) / 100;
    }

    return { r, g, b, a };
};

/**
 * Converts RGBA components to a hexadecimal color string.
 *
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @param a - Alpha/opacity (0-1), only included in output if < 1
 * @returns Hex color string with # prefix
 *
 * @example
 * rgbaToHex(255, 85, 0, 1)    // '#ff5500'
 * rgbaToHex(255, 85, 0, 0.5)  // '#ff550080'
 */
const rgbaToHex = (r: number, g: number, b: number, a: number): string => {
    // Helper to convert a number to 2-digit hex
    const toHex = (n: number): string => n.toString(16).padStart(2, '0');

    // Only include alpha channel if not fully opaque
    const alpha = a < 1 ? toHex(Math.round(a * 255)) : '';

    return `#${toHex(r)}${toHex(g)}${toHex(b)}${alpha}`;
};

/**
 * Converts RGBA components to HSLA components.
 *
 * Algorithm:
 * 1. Normalize RGB values to 0-1 range
 * 2. Find max and min values to determine hue and saturation
 * 3. Lightness is the average of max and min
 * 4. Saturation depends on lightness (different formula for light vs dark)
 * 5. Hue is calculated based on which RGB component is dominant
 *
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @param a - Alpha/opacity (0-1)
 * @returns Object with h (0-360), s (0-100), l (0-100), a (0-1)
 */
const rgbaToHsla = (r: number, g: number, b: number, a: number): { h: number; s: number; l: number; a: number } => {
    // Normalize RGB to 0-1 range
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s: number;
    const l = (max + min) / 2; // Lightness is the midpoint

    if (max === min) {
        // Achromatic (grayscale) - no hue or saturation
        h = s = 0;
    } else {
        const d = max - min; // Delta between max and min

        // Saturation calculation differs based on lightness
        // This ensures saturation is perceptually consistent
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        // Calculate hue based on which RGB component is dominant
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6; // Normalize to 0-1 range
    }

    return {
        h: Math.round(h * 360),  // Convert to degrees
        s: Math.round(s * 100),  // Convert to percentage
        l: Math.round(l * 100),  // Convert to percentage
        a
    };
};

/**
 * Converts HSLA components to RGBA components.
 *
 * Uses the HSL to RGB algorithm with a helper function 'f' that
 * calculates each RGB component based on the hue position.
 *
 * @param h - Hue (0-360 degrees)
 * @param s - Saturation (0-100%)
 * @param l - Lightness (0-100%)
 * @param a - Alpha/opacity (0-1)
 * @returns Object with r, g, b (0-255) and a (0-1)
 */
const hslaToRgba = (h: number, s: number, l: number, a: number): { r: number; g: number; b: number; a: number } => {
    // Normalize saturation and lightness to 0-1
    s /= 100;
    l /= 100;

    // Helper function: calculates position on the color wheel
    const k = (n: number): number => (n + h / 30) % 12;

    // Helper function: calculates the RGB component value
    // This formula handles the conversion from HSL's cylindrical
    // representation to RGB's cubic representation
    const f = (n: number): number => l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));

    return {
        r: Math.round(255 * f(0)),
        g: Math.round(255 * f(8)),
        b: Math.round(255 * f(4)),
        a
    };
};

/**
 * Converts HSV (Hue, Saturation, Value) to RGB.
 *
 * HSV is used for the saturation-brightness picker because:
 * - X-axis (Saturation): How vivid the color is
 * - Y-axis (Value): How bright the color is
 * This creates an intuitive 2D picker interface.
 *
 * @param h - Hue (0-360 degrees)
 * @param s - Saturation (0-100%)
 * @param v - Value/Brightness (0-100%)
 * @returns Object with r, g, b (0-255)
 */
const hsvToRgb = (h: number, s: number, v: number): { r: number; g: number; b: number } => {
    // Normalize saturation and value to 0-1
    s /= 100;
    v /= 100;

    // The algorithm divides the hue wheel into 6 sectors (60° each)
    // and interpolates between primary and secondary colors
    const f = (n: number, k = (n + h / 60) % 6): number =>
        v - v * s * Math.max(0, Math.min(k, 4 - k, 1));

    return {
        r: Math.round(f(5) * 255),
        g: Math.round(f(3) * 255),
        b: Math.round(f(1) * 255)
    };
};

/**
 * Converts RGB to HSV (Hue, Saturation, Value).
 *
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @returns Object with h (0-360), s (0-100), v (0-100)
 */
const rgbToHsv = (r: number, g: number, b: number): { h: number; s: number; v: number } => {
    // Normalize RGB to 0-1 range
    r /= 255;
    g /= 255;
    b /= 255;

    const v = Math.max(r, g, b);           // Value is the max RGB component
    const n = v - Math.min(r, g, b);       // Range (delta between max and min)

    // Calculate hue based on which component is maximum
    // The ternary chain handles each case of the color wheel
    const h = n && (v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n);

    return {
        h: Math.round(60 * (h < 0 ? h + 6 : h)),  // Convert to degrees (0-360)
        s: Math.round(v && (n / v) * 100),         // Saturation as percentage
        v: Math.round(v * 100)                     // Value/brightness as percentage
    };
};

/* =============================================================================
 * STRING PARSING UTILITIES
 * =============================================================================
 *
 * Functions to extract color components from CSS color strings.
 * These handle the various formats users might input or paste.
 */

/**
 * Parses an RGB/RGBA color string into its component values.
 *
 * Handles multiple input formats:
 * - 'rgb(255, 85, 0)'
 * - 'rgba(255, 85, 0, 0.5)'
 * - Hex fallback if string starts with #
 *
 * @param str - Color string to parse
 * @returns Object with r, g, b, a as strings (for input field binding)
 */
const parseRgbaComponents = (str: string): { r: string; g: string; b: string; a: string } => {
    // Try to match rgba/rgb pattern (permissive with empty values)
    const match = str.match(/rgba?\((\d*),\s*(\d*),\s*(\d*)(?:,\s*([\d.]*))?\)/);

    if (!match) {
        // Fallback: try to match hsl/hsla pattern
        if (str.startsWith('hsl')) {
            const hslMatch = str.match(/hsla?\((\d*),\s*([\d.]*)%?,\s*([\d.]*)%?(?:,\s*([\d.]*))?\)/);
            if (hslMatch) {
                // If any main component is missing/empty, default to 0 for conversion but keep structure
                const h = hslMatch[1] ? parseInt(hslMatch[1]) : 0;
                const s = hslMatch[2] ? parseInt(hslMatch[2]) : 0;
                const l = hslMatch[3] ? parseInt(hslMatch[3]) : 0;
                const a = hslMatch[4] ? parseFloat(hslMatch[4]) : 1;
                const { r, g, b } = hslaToRgba(h, s, l, a);
                return { r: r.toString(), g: g.toString(), b: b.toString(), a: a.toString() };
            }
        }

        // Fallback: try to parse as hex
        if (str.startsWith('#')) {
            const { r, g, b, a } = hexToRgba(str);
            return { r: r.toString(), g: g.toString(), b: b.toString(), a: a.toString() };
        }
        // Default fallback for invalid input
        return { r: '0', g: '0', b: '0', a: '1' };
    }

    return {
        r: match[1],
        g: match[2],
        b: match[3],
        a: match[4] === undefined ? '1' : match[4]
    };
};

/**
 * Parses an HSL/HSLA color string into its component values.
 *
 * Handles multiple input formats:
 * - 'hsl(180, 50%, 50%)'
 * - 'hsla(180, 50%, 50%, 0.5)'
 * - Hex fallback if string starts with #
 * - RGB fallback if string starts with 'rgb'
 *
 * @param str - Color string to parse
 * @returns Object with h, s, l, a as strings (for input field binding)
 */
const parseHslaComponents = (str: string): { h: string; s: string; l: string; a: string } => {
    // Try to match hsla/hsl pattern (permissive)
    const match = str.match(/hsla?\((\d*),\s*([\d.]*)%?,\s*([\d.]*)%?(?:,\s*([\d.]*))?\)/);

    if (!match) {
        // Fallback: try to parse as hex
        if (str.startsWith('#')) {
            const rgba = hexToRgba(str);
            const { h, s, l, a } = rgbaToHsla(rgba.r, rgba.g, rgba.b, rgba.a);
            return { h: h.toString(), s: s.toString(), l: l.toString(), a: a.toString() };
        }

        // Fallback: try to parse as rgb
        if (str.startsWith('rgb')) {
            const rgba = parseRgbaComponents(str);
            const { h, s, l, a } = rgbaToHsla(parseInt(rgba.r), parseInt(rgba.g), parseInt(rgba.b), parseFloat(rgba.a));
            return { h: h.toString(), s: s.toString(), l: l.toString(), a: a.toString() };
        }

        // Default fallback for invalid input
        return { h: '0', s: '0', l: '0', a: '1' };
    }

    return {
        h: match[1],
        s: match[2],
        l: match[3],
        a: match[4] === undefined ? '1' : match[4]
    };
};

/* =============================================================================
 * COMPONENT INTERFACES
 * ============================================================================= */

/**
 * Props interface for the ColorPicker component.
 *
 * @example
 * // Basic usage with all features
 * <ColorPicker
 *     value="#ff5500"
 *     onChange={(color) => console.log(color)}
 *     showAlpha={true}
 *     showPresets={true}
 * />
 *
 * @example
 * // Custom presets without alpha
 * <ColorPicker
 *     value={brandColor}
 *     onChange={setBrandColor}
 *     showAlpha={false}
 *     presets={['#1a1a1a', '#ff0000', '#00ff00', '#0000ff']}
 * />
 */
interface ColorPickerProps {
    /**
     * The current color value. Supports multiple formats:
     * - Hex: '#ff5500' or '#ff550080' (with alpha)
     * - RGB: 'rgb(255, 85, 0)' or 'rgba(255, 85, 0, 0.5)'
     * - HSL: 'hsl(20, 100%, 50%)' or 'hsla(20, 100%, 50%, 0.5)'
     *
     * @default '#000000'
     */
    value?: string;

    /**
     * Callback fired when the color changes.
     * The format of the returned value matches the currently active format.
     *
     * @param value - The new color value as a string
     */
    onChange: (value: string) => void;

    /**
     * Additional CSS class names to apply to the root container.
     * Useful for positioning or sizing the component.
     */
    className?: string;

    /**
     * Whether to show the alpha/opacity slider.
     * When false, colors will always be fully opaque.
     *
     * @default true
     */
    showAlpha?: boolean;

    /**
     * Whether to show the preset color swatches.
     * Useful for quick selection of commonly used colors.
     *
     * @default true
     */
    showPresets?: boolean;

    /**
     * Custom array of preset colors to display.
     * Each color should be a valid hex color string.
     *
     * @default DEFAULT_PRESETS (37 curated colors)
     */
    presets?: string[];

    /**
     * Display mode for the trigger button.
     * - 'text': Show only the text label
     * - 'icon': Show only the icon
     * - 'both': Show both icon and text (default)
     *
     * @default 'both'
     */
    triggerMode?: 'text' | 'icon' | 'both';
}

/* =============================================================================
 * INTERNAL SUB-COMPONENTS
 * =============================================================================
 *
 * These components handle the interactive elements of the color picker.
 * They are internal and not exported for external use.
 */

/**
 * Saturation/Brightness picker sub-component.
 *
 * Renders a 2D gradient area where:
 * - X-axis: Saturation (left = 0%, right = 100%)
 * - Y-axis: Value/Brightness (bottom = 0%, top = 100%)
 *
 * The background color is determined by the current hue, displayed at
 * full saturation and brightness to provide context.
 *
 * INTERACTION SUPPORT:
 * - Pointer Events API: Unified mouse, touch, and pen support
 * - Keyboard: Arrow keys for fine control, Page Up/Down for larger steps
 * - Visual Feedback: Focus ring, active state during drag
 *
 * @internal
 */
const Saturation: React.FC<{
    /** Current hue value (0-360 degrees) */
    h: number;
    /** Current saturation value (0-100%) */
    s: number;
    /** Current brightness/value (0-100%) */
    v: number;
    /** Callback when saturation or value changes */
    onChange: (s: number, v: number) => void;
}> = ({ h, s, v, onChange }) => {
    // Reference to the container for position calculations
    const containerRef = useRef<HTMLDivElement>(null);

    // Track whether the user is currently dragging
    const [isDragging, setIsDragging] = useState(false);

    // Track focus state for visual indicator
    const [isFocused, setIsFocused] = useState(false);

    // Step sizes for keyboard navigation
    const STEP_SMALL = 1;      // Arrow keys
    const STEP_LARGE = 10;     // Page Up/Down

    /**
     * Calculates the saturation and value from pointer position.
     * Works with mouse, touch, and pen events via Pointer Events API.
     * Clamps values to 0-1 range and converts to 0-100 percentage.
     */
    const updatePosition = useCallback((e: PointerEvent | React.PointerEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        // Calculate normalized position (0-1)
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

        // x = saturation (0-100), y inverted = value (bottom is 0, top is 100)
        onChange(x * 100, (1 - y) * 100);
    }, [onChange]);

    /**
     * Handles pointer down event - starts drag and captures pointer.
     * Pointer capture ensures we receive all subsequent events even if
     * the pointer moves outside the element.
     */
    const handlePointerDown = (e: React.PointerEvent) => {
        e.preventDefault();
        setIsDragging(true);
        updatePosition(e);

        // Capture pointer to receive events even when dragged outside
        // Guard with optional chaining for browser compatibility
        if (containerRef.current?.setPointerCapture) {
            containerRef.current.setPointerCapture(e.pointerId);
        }
    };

    /**
     * Handles pointer move event - updates position while dragging.
     */
    const handlePointerMove = (e: React.PointerEvent) => {
        if (isDragging) {
            updatePosition(e);
        }
    };

    /**
     * Handles pointer up event - ends drag and releases capture.
     */
    const handlePointerUp = (e: React.PointerEvent) => {
        setIsDragging(false);
        // Guard with optional chaining for browser compatibility
        if (containerRef.current?.releasePointerCapture) {
            containerRef.current.releasePointerCapture(e.pointerId);
        }
    };

    /**
     * Handles keyboard navigation for accessibility.
     * - Arrow keys: Fine adjustment (1%)
     * - Page Up/Down: Larger adjustment (10%)
     * - Home/End: Jump to min/max values
     */
    const handleKeyDown = (e: React.KeyboardEvent) => {
        let newS = s;
        let newV = v;
        let handled = true;

        switch (e.key) {
            // Horizontal movement (Saturation)
            case 'ArrowLeft':
                newS = Math.max(0, s - (e.shiftKey ? STEP_LARGE : STEP_SMALL));
                break;
            case 'ArrowRight':
                newS = Math.min(100, s + (e.shiftKey ? STEP_LARGE : STEP_SMALL));
                break;

            // Vertical movement (Value/Brightness)
            case 'ArrowUp':
                newV = Math.min(100, v + (e.shiftKey ? STEP_LARGE : STEP_SMALL));
                break;
            case 'ArrowDown':
                newV = Math.max(0, v - (e.shiftKey ? STEP_LARGE : STEP_SMALL));
                break;

            // Large jumps
            case 'PageUp':
                newV = Math.min(100, v + STEP_LARGE);
                break;
            case 'PageDown':
                newV = Math.max(0, v - STEP_LARGE);
                break;

            // Min/Max jumps
            case 'Home':
                newS = 0;
                newV = 100;
                break;
            case 'End':
                newS = 100;
                newV = 0;
                break;

            default:
                handled = false;
        }

        if (handled) {
            e.preventDefault();
            onChange(newS, newV);
        }
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative w-full h-32 cursor-crosshair rounded-t-md overflow-hidden outline-none",
                "transition-shadow duration-150",
                // Focus ring for keyboard navigation
                isFocused && "ring-2 ring-blue-500 ring-offset-2",
                // Active state during drag
                isDragging && "ring-2 ring-blue-400"
            )}
            // Make focusable for keyboard navigation
            tabIndex={0}
            role="slider"
            aria-label="Saturation and brightness picker"
            aria-valuetext={`Saturation ${Math.round(s)}%, Brightness ${Math.round(v)}%`}
            // Pointer events (unified mouse/touch/pen)
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            // Keyboard events
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            // Prevent touch scroll while interacting
            style={{
                backgroundColor: `hsl(${h}, 100%, 50%)`,
                touchAction: 'none'
            }}
        >
            {/* White gradient overlay: creates saturation gradient (left = white/desaturated) */}
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, #fff, transparent)' }} />

            {/* Black gradient overlay: creates brightness gradient (bottom = dark) */}
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to top, #000, transparent)' }} />

            {/* Picker handle: positioned at current saturation/value */}
            <div
                className={cn(
                    "absolute w-4 h-4 rounded-full border-2 border-white pointer-events-none -translate-x-1/2 translate-y-1/2",
                    "transition-transform duration-75",
                    // Enhanced shadow and scale during interaction
                    isDragging ? "shadow-lg scale-110" : "shadow-md",
                    isFocused && "ring-2 ring-blue-500 ring-offset-1"
                )}
                style={{ left: `${s}%`, bottom: `${v}%` }}
            />
        </div>
    );
};

/**
 * Generic slider sub-component for Hue and Alpha controls.
 *
 * Renders a horizontal track with a draggable handle.
 * The background gradient is provided via the `background` prop,
 * allowing it to be used for both hue (rainbow) and alpha (transparency).
 *
 * INTERACTION SUPPORT:
 * - Pointer Events API: Unified mouse, touch, and pen support
 * - Keyboard: Arrow keys for fine control, Home/End for min/max
 * - Visual Feedback: Focus ring, active state during drag
 * - ARIA: Proper slider role with live value feedback
 *
 * @internal
 */
const Slider: React.FC<{
    /** Current value (0 to max) */
    value: number;
    /** Maximum value for the slider */
    max: number;
    /** Callback when value changes */
    onChange: (v: number) => void;
    /** CSS background gradient string */
    background: string;
    /** Optional ARIA label for accessibility */
    ariaLabel?: string;
    /** Additional CSS classes */
    className?: string;
}> = ({ value, max, onChange, background, ariaLabel = 'Color slider', className }) => {
    // Reference for position calculations
    const containerRef = useRef<HTMLDivElement>(null);

    // Track dragging state
    const [isDragging, setIsDragging] = useState(false);

    // Track focus state for visual indicator
    const [isFocused, setIsFocused] = useState(false);

    // Step sizes for keyboard navigation (percentage of max)
    const STEP_SMALL = max * 0.01;   // 1% step for arrow keys
    const STEP_LARGE = max * 0.1;    // 10% step for shift+arrow or page keys

    /**
     * Calculates the value from horizontal pointer position.
     * Works with mouse, touch, and pen events via Pointer Events API.
     */
    const updatePosition = useCallback((e: PointerEvent | React.PointerEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        // Calculate normalized position and scale to max value
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        onChange(x * max);
    }, [max, onChange]);

    /**
     * Handles pointer down event - starts drag and captures pointer.
     */
    const handlePointerDown = (e: React.PointerEvent) => {
        e.preventDefault();
        setIsDragging(true);
        updatePosition(e);

        // Capture pointer for smooth dragging outside element
        // Guard with optional chaining for browser compatibility
        if (containerRef.current?.setPointerCapture) {
            containerRef.current.setPointerCapture(e.pointerId);
        }
    };

    /**
     * Handles pointer move event - updates position while dragging.
     */
    const handlePointerMove = (e: React.PointerEvent) => {
        if (isDragging) {
            updatePosition(e);
        }
    };

    /**
     * Handles pointer up event - ends drag and releases capture.
     */
    const handlePointerUp = (e: React.PointerEvent) => {
        setIsDragging(false);
        // Guard with optional chaining for browser compatibility
        if (containerRef.current?.releasePointerCapture) {
            containerRef.current.releasePointerCapture(e.pointerId);
        }
    };

    /**
     * Handles keyboard navigation for accessibility.
     * - Arrow keys: Fine adjustment
     * - Shift + Arrows: Larger adjustment
     * - Home/End: Jump to min/max
     */
    const handleKeyDown = (e: React.KeyboardEvent) => {
        let newValue = value;
        let handled = true;

        switch (e.key) {
            case 'ArrowLeft':
            case 'ArrowDown':
                newValue = Math.max(0, value - (e.shiftKey ? STEP_LARGE : STEP_SMALL));
                break;

            case 'ArrowRight':
            case 'ArrowUp':
                newValue = Math.min(max, value + (e.shiftKey ? STEP_LARGE : STEP_SMALL));
                break;

            case 'PageDown':
                newValue = Math.max(0, value - STEP_LARGE);
                break;

            case 'PageUp':
                newValue = Math.min(max, value + STEP_LARGE);
                break;

            case 'Home':
                newValue = 0;
                break;

            case 'End':
                newValue = max;
                break;

            default:
                handled = false;
        }

        if (handled) {
            e.preventDefault();
            onChange(newValue);
        }
    };

    // Calculate percentage for display
    const percentage = Math.round((value / max) * 100);

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative h-3 rounded-full cursor-pointer outline-none",
                "transition-shadow duration-150",
                // Focus ring for keyboard navigation
                isFocused && "ring-2 ring-blue-500 ring-offset-2",
                // Active state during drag
                isDragging && "ring-2 ring-blue-400",
                className
            )}
            // Make focusable for keyboard navigation
            tabIndex={0}
            role="slider"
            aria-label={ariaLabel}
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={`${percentage}%`}
            // Pointer events (unified mouse/touch/pen)
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            // Keyboard events
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            // Prevent touch scroll while interacting
            style={{
                background,
                touchAction: 'none'
            }}
        >
            {/* Slider handle: positioned based on current value */}
            <div
                className={cn(
                    "absolute w-4 h-4 bg-white border border-gray-200 rounded-full -top-0.5 -translate-x-1/2",
                    "transition-all duration-75",
                    // Enhanced shadow and scale during interaction
                    isDragging ? "shadow-lg scale-110" : "shadow-md",
                    isFocused && "ring-2 ring-blue-500 ring-offset-1"
                )}
                style={{ left: `${(value / max) * 100}%` }}
            />
        </div>
    );
};

/* =============================================================================
 * MAIN COMPONENT
 * ============================================================================= */

/**
 * ColorPicker Component
 *
 * A premium, fully-featured color picker inspired by professional design tools
 * like Sketch and Figma. Built entirely in React with no external color picker
 * dependencies.
 *
 * ## Features
 * - **Interactive visual picker**: HSV-based 2D saturation/brightness grid
 * - **Multiple formats**: HEX, RGB(A), HSL(A) with real-time conversion
 * - **Alpha/transparency support**: Optional opacity slider
 * - **Preset swatches**: Quick access to commonly used colors
 * - **Accessible**: Full keyboard navigation support
 * - **i18n ready**: All strings use @wordpress/i18n for translation
 *
 * ## Accessibility
 * - Keyboard navigation: Enter/Space to open, Escape to close
 * - Focus management: Proper focus states and ARIA labels
 * - Screen reader support: Descriptive aria-labels
 *
 * @example
 * // Basic usage
 * <ColorPicker value="#ff5500" onChange={setColor} />
 *
 * @example
 * // Full featured usage
 * <ColorPicker
 *     value={color}
 *     onChange={setColor}
 *     showAlpha={true}
 *     showPresets={true}
 *     presets={brandColors}
 *     className="my-custom-class"
 * />
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({
    value = '#000000',
    onChange,
    className,
    showAlpha = true,
    showPresets = true,
    presets = DEFAULT_PRESETS,
    triggerMode = 'both'
}) => {
    /* -------------------------------------------------------------------------
     * STATE MANAGEMENT
     * ------------------------------------------------------------------------- */

    /**
     * Controls whether the color picker popover is visible.
     */
    const [isOpen, setIsOpen] = useState(false);

    /**
     * The currently active color format for display and input.
     * Determines how the color value is formatted when changed.
     */
    const [activeFormat, setActiveFormat] = useState<ColorFormat>('hex');

    /**
     * Reference to the popover element for click-outside detection.
     */
    const popoverRef = useRef<HTMLDivElement>(null);

    /**
     * Reference to the main container for click-outside detection.
     */
    const containerRef = useRef<HTMLDivElement>(null);

    /**
     * Safely parsed and validated color value.
     * Handles empty strings, null, undefined, and malformed input
     * by falling back to the default color.
     */
    const safeValue = useMemo(() => {
        // Handle null, undefined, non-string, or empty values
        if (!value || typeof value !== 'string' || value.trim() === '') {
            return '#000000';
        }

        const trimmed = value.trim().toLowerCase();

        // Validate it looks like a valid color format
        const isHex = /^#[0-9a-f]{3,8}$/i.test(trimmed);
        const isRgb = /^rgba?\s*\(/i.test(trimmed);
        const isHsl = /^hsla?\s*\(/i.test(trimmed);

        if (!isHex && !isRgb && !isHsl) {
            return '#000000'; // Fallback for invalid format
        }

        return value.trim();
    }, [value]);

    /* -------------------------------------------------------------------------
     * EFFECTS
     * ------------------------------------------------------------------------- */

    /**
     * Format Detection Effect
     *
     * Automatically detects the color format from the incoming value
     * when the picker opens. This ensures the UI displays the correct
     * format controls and the user can continue editing in their
     * preferred format.
     */
    useEffect(() => {
        if (!value) return;

        const normalizedValue = value.toLowerCase().trim();

        // Detect format based on value prefix
        if (normalizedValue.startsWith('rgb')) {
            setActiveFormat('rgb');
        } else if (normalizedValue.startsWith('hsl')) {
            setActiveFormat('hsl');
        } else {
            setActiveFormat('hex');
        }
    }, [isOpen]); // Run when picker opens to sync format state

    /**
     * Click Outside Effect
     *
     * Closes the popover when clicking anywhere outside of both
     * the popover and the trigger container. This provides the
     * expected UX behavior of dismissing the picker on blur.
     */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            // Check if click is outside both popover and container
            if (
                popoverRef.current && !popoverRef.current.contains(target) &&
                containerRef.current && !containerRef.current.contains(target)
            ) {
                close();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    /**
     * Escape Key Effect
     *
     * Closes the popover when the Escape key is pressed.
     * This is a standard accessibility pattern for modal-like
     * components.
     */
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    /* -------------------------------------------------------------------------
     * TOGGLE AND CLOSE HANDLERS
     * ------------------------------------------------------------------------- */

    /**
     * Toggles the picker open/closed state.
     * Prevents event propagation to avoid triggering parent handlers.
     */
    const toggle = useCallback((e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setIsOpen((prev) => !prev);
    }, []);

    /**
     * Closes the picker.
     * Memoized to maintain stable reference for effect dependencies.
     */
    const close = useCallback(() => setIsOpen(false), []);

    /* -------------------------------------------------------------------------
     * COLOR VALUE DERIVATION
     * ------------------------------------------------------------------------- */

    /**
     * Parse current value to RGBA components for display and calculations.
     * The picker internally works with RGB/HSV for the visual interface.
     * Checks if current active format matches value format to use direct parsing.
     */
    const rgba = useMemo(() => {
        try {
            if (activeFormat === 'rgb' && safeValue.startsWith('rgb')) {
                return parseRgbaComponents(safeValue);
            }
            // For other formats, convert to RGBA for internal use
            return parseRgbaComponents(safeValue);
        } catch {
            // Fallback for any parsing errors
            return { r: '0', g: '0', b: '0', a: '1' };
        }
    }, [activeFormat, safeValue]);

    /**
     * Convert RGB to HSV for the saturation/brightness picker.
     * HSV is more intuitive for the 2D picking interface.
     */
    const hsv = useMemo(() => {
        // Safely parse RGB values, defaulting to 0 for empty/invalid strings
        const r = rgba.r ? parseInt(rgba.r, 10) : 0;
        const g = rgba.g ? parseInt(rgba.g, 10) : 0;
        const b = rgba.b ? parseInt(rgba.b, 10) : 0;
        return rgbToHsv(
            isNaN(r) ? 0 : r,
            isNaN(g) ? 0 : g,
            isNaN(b) ? 0 : b
        );
    }, [rgba.r, rgba.g, rgba.b]);

    /**
     * Derive HSL components for display in HSL format mode.
     * Computed from RGBA for accurate conversion, unless already in HSL mode.
     */
    const hsla = useMemo(() => {
        try {
            if (activeFormat === 'hsl' && safeValue.startsWith('hsl')) {
                return parseHslaComponents(safeValue);
            }
            // Safely parse values with NaN fallbacks
            const r = rgba.r ? parseInt(rgba.r, 10) : 0;
            const g = rgba.g ? parseInt(rgba.g, 10) : 0;
            const b = rgba.b ? parseInt(rgba.b, 10) : 0;
            const a = rgba.a ? parseFloat(rgba.a) : 1;
            return rgbaToHsla(
                isNaN(r) ? 0 : r,
                isNaN(g) ? 0 : g,
                isNaN(b) ? 0 : b,
                isNaN(a) ? 1 : a
            );
        } catch {
            return { h: '0', s: '0', l: '0', a: '1' };
        }
    }, [activeFormat, safeValue, rgba.r, rgba.g, rgba.b, rgba.a]);

    /**
     * Derive display values for each format.
     * These are computed from the internal RGBA representation,
     * ensuring consistent display regardless of the input format.
     * 
     * Special case: When editing HEX manually, return the raw value
     * to prevent snapping/resetting while typing partial hex codes.
     */
    const displayHex = useMemo(() => {
        // When editing HEX, preserve raw value to allow typing partial codes
        // We check 'value' directly (not safeValue) to allow for incomplete inputs like "#" or "#F"
        if (activeFormat === 'hex' && value && value.trim().startsWith('#')) {
            return value;
        }
        // Safely parse with NaN fallbacks
        const r = rgba.r ? parseInt(rgba.r, 10) : 0;
        const g = rgba.g ? parseInt(rgba.g, 10) : 0;
        const b = rgba.b ? parseInt(rgba.b, 10) : 0;
        const a = rgba.a ? parseFloat(rgba.a) : 1;
        return rgbaToHex(
            isNaN(r) ? 0 : r,
            isNaN(g) ? 0 : g,
            isNaN(b) ? 0 : b,
            isNaN(a) ? 1 : a
        );
    }, [activeFormat, value, safeValue, rgba.r, rgba.g, rgba.b, rgba.a]);

    /* -------------------------------------------------------------------------
     * EVENT HANDLERS
     * ------------------------------------------------------------------------- */

    /**
     * Handles changes from the 2D saturation/value picker.
     *
     * Converts the new S/V values (with existing H) back to RGB,
     * then formats according to the active format before calling onChange.
     *
     * @param s - New saturation value (0-100)
     * @param v - New value/brightness (0-100)
     */
    const handleHsvChange = (s: number, v: number) => {
        const { r, g, b } = hsvToRgb(hsv.h, s, v);
        const alpha = parseFloat(rgba.a);

        // Output in the currently active format
        if (activeFormat === 'hex') {
            onChange(rgbaToHex(r, g, b, alpha));
        } else {
            onChange(`rgba(${r}, ${g}, ${b}, ${rgba.a})`);
        }
    };

    /**
     * Handles changes from the hue slider.
     *
     * Updates the hue while keeping saturation and value constant.
     *
     * @param h - New hue value (0-360)
     */
    const handleHueChange = (h: number) => {
        const { r, g, b } = hsvToRgb(h, hsv.s, hsv.v);
        const alpha = parseFloat(rgba.a);

        if (activeFormat === 'hex') {
            onChange(rgbaToHex(r, g, b, alpha));
        } else {
            onChange(`rgba(${r}, ${g}, ${b}, ${rgba.a})`);
        }
    };

    /**
     * Handles changes from the alpha/opacity slider.
     *
     * Updates only the alpha channel while keeping the color constant.
     * Rounds to 2 decimal places for cleaner values.
     * Uses the already-derived rgba/hsla values for consistency.
     *
     * @param a - New alpha value (0-1)
     */
    const handleAlphaChange = (a: number) => {
        // Round to 2 decimal places for display cleanliness
        const roundedA = Math.round(a * 100) / 100;

        // Output in the currently active format
        if (activeFormat === 'hex') {
            const hex = rgbaToHex(parseInt(rgba.r), parseInt(rgba.g), parseInt(rgba.b), roundedA);
            onChange(hex);
        } else if (activeFormat === 'rgb') {
            onChange(`rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${roundedA})`);
        } else {
            // HSL format: use derived hsla values with updated alpha
            onChange(`hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${roundedA})`);
        }
    };

    /**
     * Handles switching between color formats (HEX, RGB, HSL).
     *
     * IMPORTANT: This only changes the display format, NOT the actual color.
     * The color value is preserved exactly - only the format state changes.
     * The display inputs will show the converted value based on activeFormat.
     *
     * We do NOT call onChange here because:
     * 1. The actual color hasn't changed, only how we display it
     * 2. Calling onChange causes unnecessary re-renders and potential
     *    rounding errors when converting between formats repeatedly
     * 3. The next user interaction will emit in the new format
     *
     * @param format - The target format to switch to
     */
    const handleFormatSwitch = (format: ColorFormat) => {
        // No-op if clicking the already active format
        if (format === activeFormat) return;

        // Only update the format state - display will derive the correct values
        setActiveFormat(format);
    };

    /**
     * Handles changes to individual color component input fields.
     *
     * Used for the R/G/B/A and H/S/L/A input fields below the picker.
     * Includes range validation for each component:
     * - R, G, B: 0-255 (integers)
     * - H: 0-360 (integer, degrees)
     * - S, L: 0-100 (integers, percentages)
     * - A: 0-1 (decimals allowed)
     *
     * @param format - Which format mode is active ('rgb' or 'hsl')
     * @param key - The component key being changed ('r', 'g', 'b', 'a', 'h', 's', 'l')
     * @param newVal - The new value as a string
     */
    const handleComponentChange = (format: 'rgb' | 'hsl', key: string, newVal: string) => {
        // Allow empty string or just a decimal point for intermediate typing
        // This allows users to clear and retype values
        const trimmed = newVal.trim();

        // Check if this looks like a valid number pattern (including partial like "0." or ".5")
        // We accept: empty, digits, digits with decimal, decimal with digits
        const validPattern = /^-?\d*\.?\d*$/;
        if (!validPattern.test(trimmed)) {
            return; // Reject invalid characters
        }

        // For alpha values, keep decimals as-is; for others, parse as int
        let outputVal: string | number = trimmed;

        // If we have a parseable number, apply range validation
        if (trimmed !== '' && trimmed !== '.' && trimmed !== '-.') {
            const numVal = parseFloat(trimmed);

            if (!isNaN(numVal)) {
                if (key === 'a') {
                    // Alpha: 0-1 (decimals allowed, max 2 places)
                    // Check decimal precision check
                    if (trimmed.includes('.')) {
                        const decimals = trimmed.split('.')[1];
                        if (decimals && decimals.length > 2) {
                            return; // Do not allow more than 2 decimal places
                        }
                    }

                    // Only clamp if the value is clearly out of range
                    if (numVal < 0) outputVal = '0';
                    else if (numVal > 1) outputVal = '1';
                    else outputVal = trimmed; // Preserve exact input
                } else if (key === 'h') {
                    // Hue: 0-360 (integer)
                    outputVal = Math.max(0, Math.min(360, Math.round(numVal)));
                } else if (key === 's' || key === 'l') {
                    // Saturation/Lightness: 0-100 (integer)
                    outputVal = Math.max(0, Math.min(100, Math.round(numVal)));
                } else {
                    // R, G, B: 0-255 (integer)
                    outputVal = Math.max(0, Math.min(255, Math.round(numVal)));
                }
            }
        }

        if (format === 'rgb') {
            // Build updated RGBA values, preserving string for the alpha field
            const r = key === 'r' ? outputVal : rgba.r;
            const g = key === 'g' ? outputVal : rgba.g;
            const b = key === 'b' ? outputVal : rgba.b;
            const a = key === 'a' ? outputVal : rgba.a;
            onChange(`rgba(${r}, ${g}, ${b}, ${a})`);
        } else {
            // Build updated HSLA values
            const h = key === 'h' ? outputVal : hsla.h;
            const s = key === 's' ? outputVal : hsla.s;
            const l = key === 'l' ? outputVal : hsla.l;
            const a = key === 'a' ? outputVal : hsla.a;
            onChange(`hsla(${h}, ${s}%, ${l}%, ${a})`);
        }
    };

    /**
     * Handles changes to the HEX input field.
     * Validates character set and length limits.
     */
    const handleHexChange = (val: string) => {
        // Enforce max length of 9 characters (#RRGGBBAA)
        if (val.length > 9) return;

        // Allow allowed characters only: #, 0-9, a-f, A-F
        if (!/^[0-9a-fA-F#]*$/.test(val)) return;

        // Ensure only one # at the start
        if (val.indexOf('#') > 0 || (val.match(/#/g) || []).length > 1) return;

        onChange(val);
    };

    /* -------------------------------------------------------------------------
     * RENDER
     * ------------------------------------------------------------------------- */

    return (
        <div className={cn('relative inline-block', className)} ref={containerRef}>
            {/* =====================================================================
             * TRIGGER SECTION
             * =====================================================================
             * The trigger contains a color preview swatch and an edit button.
             * Both are clickable to open/close the picker popover.
             */}
            <div className="flex items-center gap-2">
                {/* Color Preview Swatch with Transparency Support */}
                <div className="relative w-8 h-8 group">
                    {/* Checkerboard background shows through when color has transparency */}
                    <Checkerboard />
                    {/* The actual color overlay - positioned above the checkerboard */}
                    <div
                        className="absolute inset-0 rounded-full border border-gray-200 shadow-sm cursor-pointer transition-all hover:scale-105 hover:shadow-md ring-offset-2 hover:ring-2 hover:ring-blue-400"
                        style={{ backgroundColor: safeValue }}
                        onClick={toggle}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggle(); }}
                        aria-label={__('Open color picker', 'productbay')}
                    />
                </div>

                {/* Edit/Close Button with Icon */}
                <button
                    type="button"
                    onClick={toggle}
                    className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-500 font-medium transition-colors bg-transparent border-0 p-1 cursor-pointer rounded-md hover:bg-gray-50"
                >
                    {/* Toggle icon between Pencil (closed) and X (open) */}
                    {(triggerMode === "icon" || triggerMode === "both") && (isOpen ? <span title={__('Close', 'productbay')}><X className="w-3.5 h-3.5" /></span> : <span title={__('Edit Color', 'productbay')}><Pencil className="w-3.5 h-3.5" /></span>)}
                    {/* Toggle text between Edit Color (closed) and Close (open) */}
                    {(triggerMode === "text" || triggerMode === "both") && <span>{isOpen ? __('Close', 'productbay') : __('Edit Color', 'productbay')}</span>}
                </button>
            </div>

            {/* =====================================================================
             * POPOVER SECTION
             * =====================================================================
             * The popover contains all the color picking controls and is only
             * rendered when the picker is open. Uses absolute positioning to
             * float above other content.
             */}
            {isOpen && (
                <div
                    ref={popoverRef}
                    className="absolute z-[100] mt-3 p-3 bg-white rounded-lg shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200 origin-top-left"
                    style={{ width: '240px' }}
                >
                    {/* -----------------------------------------------------------------
                     * VISUAL PICKER AREA
                     * -----------------------------------------------------------------
                     * Contains the 2D saturation/brightness picker and the sliders
                     * for hue and optional alpha control.
                     */}
                    <div className="mb-3">
                        {/* Saturation/Brightness Picker (2D gradient area) */}
                        <Saturation h={hsv.h} s={hsv.s} v={hsv.v} onChange={handleHsvChange} />

                        <div className="mt-3 px-1">
                            {/* Hue Slider (0-360 degrees, rainbow gradient) */}
                            <Slider
                                value={hsv.h}
                                max={360}
                                onChange={handleHueChange}
                                background="linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)"
                                ariaLabel="Hue"
                            />

                            {/* Alpha Slider (optional, 0-1 range) */}
                            {showAlpha && (
                                <div className="mt-2.5 relative">
                                    {/* Checkerboard background for transparency visualization */}
                                    <Checkerboard className="rounded-full h-3" />
                                    <Slider
                                        value={parseFloat(rgba.a) || 0}
                                        max={1}
                                        onChange={handleAlphaChange}
                                        background={`linear-gradient(to right, transparent, rgb(${rgba.r}, ${rgba.g}, ${rgba.b}))`}
                                        ariaLabel="Opacity"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* -----------------------------------------------------------------
                     * FORMAT SWITCHER & INPUT FIELDS
                     * -----------------------------------------------------------------
                     * Allows switching between HEX, RGB, and HSL color formats.
                     * The input fields below update based on the active format.
                     */}
                    <div className="px-1">
                        {/* Format Toggle Buttons & Preview */}
                        <div className="flex items-center justify-between mb-2">
                            {/* Format Toggle: HEX | RGB | HSL */}
                            <div className="flex gap-1 bg-gray-50 p-0.5 rounded-md border border-gray-100">
                                {(['hex', 'rgb', 'hsl'] as ColorFormat[]).map((f) => (
                                    <button
                                        key={f}
                                        type="button"
                                        onClick={() => handleFormatSwitch(f)}
                                        className={cn(
                                            "px-2 py-0.5 text-[10px] uppercase font-bold rounded transition-all cursor-pointer",
                                            activeFormat === f ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5" : "text-gray-400 hover:text-gray-600"
                                        )}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>

                            {/* Mini Color Preview (shows current color with transparency) */}
                            <div className="relative w-6 h-6 rounded border border-gray-100 shadow-inner overflow-hidden">
                                <Checkerboard className="rounded-none" />
                                <div className="absolute inset-0" style={{ backgroundColor: safeValue }} />
                            </div>
                        </div>

                        {/* HEX Input: Single text field for hex value */}
                        {activeFormat === 'hex' ? (
                            <div className="flex flex-col gap-1">
                                <input
                                    type="text"
                                    value={displayHex}
                                    onChange={(e) => handleHexChange(e.target.value)}
                                    className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:border-blue-400 focus:outline-none transition-colors font-mono uppercase text-center"
                                />
                                <span className="text-[9px] uppercase text-gray-400 font-bold text-center">Hex</span>
                            </div>
                        ) : activeFormat === 'rgb' ? (
                            /* RGB Inputs: Four fields for R, G, B, A values */
                            <div className="grid grid-cols-4 gap-1">
                                {(['r', 'g', 'b', 'a'] as const).map((key) => (
                                    <div key={key} className="flex flex-col gap-1 text-center">
                                        <input
                                            type="text"
                                            inputMode={key === 'a' ? 'decimal' : 'numeric'}
                                            value={rgba[key]}
                                            onChange={(e) => handleComponentChange('rgb', key, e.target.value)}
                                            className="w-full px-1 py-1.5 text-xs border border-gray-200 rounded focus:border-blue-400 focus:outline-none transition-colors font-mono text-center"
                                        />
                                        <span className="text-[9px] uppercase text-gray-400 font-bold">{key}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* HSL Inputs: Four fields for H, S, L, A values */
                            <div className="grid grid-cols-4 gap-1">
                                {(['h', 's', 'l', 'a'] as const).map((key) => (
                                    <div key={key} className="flex flex-col gap-1 text-center">
                                        <input
                                            type="text"
                                            inputMode={key === 'a' ? 'decimal' : 'numeric'}
                                            value={hsla[key]}
                                            onChange={(e) => handleComponentChange('hsl', key, e.target.value)}
                                            className="w-full px-1 py-1.5 text-xs border border-gray-200 rounded focus:border-blue-400 focus:outline-none transition-colors font-mono text-center"
                                        />
                                        <span className="text-[9px] uppercase text-gray-400 font-bold">{key}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* -----------------------------------------------------------------
                     * PRESET SWATCHES
                     * -----------------------------------------------------------------
                     * A grid of preset color swatches for quick color selection.
                     * Only shown if showPresets is true and presets array is not empty.
                     */}
                    {showPresets && presets.length > 0 && (
                        <div className="border-t border-gray-100 mt-3 pt-3">
                            <span className="text-[10px] uppercase text-gray-400 font-bold ml-1 mb-2 block">{__('Presets', 'productbay')}</span>
                            <div className="grid grid-cols-8 gap-1.5">
                                {presets.map((preset, idx) => (
                                    <button
                                        key={`${preset}-${idx}`}
                                        type="button"
                                        className={cn(
                                            "w-4 h-4 rounded-sm border border-black/5 hover:scale-125 transition-transform cursor-pointer",
                                            value.toLowerCase() === preset.toLowerCase() && "ring-1 ring-blue-500 ring-offset-1"
                                        )}
                                        style={{ backgroundColor: preset }}
                                        onClick={() => onChange(preset)}
                                        title={preset}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Decorative Arrow Pointer (connects popover to trigger) */}
                    <div className="absolute -top-1.5 left-4 w-3 h-3 bg-white border-t border-l border-gray-100 rotate-45" />
                </div>
            )}
        </div>
    );
};
