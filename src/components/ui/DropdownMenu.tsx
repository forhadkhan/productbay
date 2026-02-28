import * as React from 'react';
import { cn } from '@/utils/cn';

interface DropdownContextType {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const DropdownContext = React.createContext<DropdownContextType | undefined>(
    undefined
);

const useDropdown = () => {
    const context = React.useContext(DropdownContext);
    if (!context) {
        throw new Error(
            'Dropdown components must be used within a DropdownMenu'
        );
    }
    return context;
};

export interface DropdownMenuProps {
    /** Children of the DropdownMenu, must contain DropdownMenuTrigger and DropdownMenuContent */
    children: React.ReactNode;
}

/**
 * Root DropdownMenu component that manages open state, click-outside logic,
 * and keyboard navigation (Escape to close) functionality for accessibility.
 *
 * @example
 * <DropdownMenu>
 *   <DropdownMenuTrigger>Open</DropdownMenuTrigger>
 *   <DropdownMenuContent>
 *     <DropdownMenuItem>Item 1</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 */
const DropdownMenu = ({ children }: DropdownMenuProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);

    // Handle click outside and Escape key
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false);
                triggerRef.current?.focus();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    return (
        <DropdownContext.Provider value={{ isOpen, setIsOpen, triggerRef }}>
            <div
                className="relative inline-block text-left"
                ref={containerRef}
            >
                {children}
            </div>
        </DropdownContext.Provider>
    );
};

export interface DropdownMenuTriggerProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Pass true if wrapping a custom component, ensures events/refs are passed down */
    asChild?: boolean;
}

/**
 * Trigger for the DropdownMenu.
 * Passing `asChild` allows you to wrap your own button or element while preserving native HTML behaviors.
 * Automatically handles `aria-expanded` and `aria-haspopup` for screen readers.
 */
const DropdownMenuTrigger = React.forwardRef<
    HTMLButtonElement,
    DropdownMenuTriggerProps
>(({ className, children, asChild, ...props }, ref) => {
    const { isOpen, setIsOpen, triggerRef } = useDropdown();

    const handleToggle = (e: React.MouseEvent) => {
        setIsOpen(!isOpen);
    };

    const setRefs = React.useCallback(
        (node: HTMLButtonElement | null) => {
            if (typeof ref === 'function') {
                ref(node);
            } else if (ref) {
                (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
            }
            // @ts-ignore
            triggerRef.current = node;
        },
        [ref, triggerRef]
    );

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<any>, {
            ref: setRefs,
            'aria-expanded': isOpen,
            'aria-haspopup': 'menu',
            onClick: (e: React.MouseEvent) => {
                handleToggle(e);
                if (children.props.onClick) {
                    children.props.onClick(e);
                }
            },
            ...props,
        });
    }

    return (
        <button
            ref={setRefs}
            type="button"
            aria-expanded={isOpen}
            aria-haspopup="menu"
            onClick={handleToggle}
            className={cn(className)}
            {...props}
        >
            {children}
        </button>
    );
});
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

export interface DropdownMenuContentProps
    extends React.HTMLAttributes<HTMLDivElement> {
    /** Alignment of the dropdown menu content relative to the trigger. Defaults to 'start'. */
    align?: 'start' | 'center' | 'end';
}

/**
 * Content container for the DropdownMenu items.
 * Uses `tailwindcss-animate` for smooth enter/exit transitions.
 * Implements `role="menu"` for screen readers.
 */
const DropdownMenuContent = React.forwardRef<
    HTMLDivElement,
    DropdownMenuContentProps
>(({ className, align = 'start', ...props }, ref) => {
    const { isOpen } = useDropdown();

    if (!isOpen) return null;

    return (
        <div
            ref={ref}
            role="menu"
            aria-orientation="vertical"
            className={cn(
                'absolute z-50 mt-1 min-w-[8rem] max-h-96 overflow-y-auto rounded-md border border-gray-200 bg-white p-1 text-sm text-gray-700 shadow-md animate-in fade-in-80 slide-in-from-top-1',
                align === 'start' && 'left-0',
                align === 'end' && 'right-0',
                align === 'center' && 'left-1/2 -translate-x-1/2',
                className
            )}
            {...props}
        />
    );
});
DropdownMenuContent.displayName = 'DropdownMenuContent';

export interface DropdownMenuItemProps
    extends React.HTMLAttributes<HTMLDivElement> {
    /** Optional visually disabled state and functional block */
    disabled?: boolean;
    /** Whether the dropdown should close automatically after this item is clicked. Defaults to true. */
    closeOnSelect?: boolean;
}

/**
 * Individual interactive item within the DropdownMenu.
 * Handles disabled states and controls whether the menu closes upon interaction.
 * Operates with `role="menuitem"` for accessibility.
 */
const DropdownMenuItem = React.forwardRef<
    HTMLDivElement,
    DropdownMenuItemProps
>(({ className, disabled, closeOnSelect = true, onClick, ...props }, ref) => {
    const { setIsOpen } = useDropdown();

    const handleInteraction = (e: React.MouseEvent | React.KeyboardEvent) => {
        if (disabled) return;
        if (onClick) onClick(e as any);
        if (closeOnSelect) {
            setIsOpen(false);
        }
    };

    return (
        <div
            ref={ref}
            role="menuitem"
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled}
            onClick={handleInteraction}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleInteraction(e);
                }
            }}
            className={cn(
                'relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                disabled
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900',
                className
            )}
            data-disabled={disabled ? '' : undefined}
            {...props}
        />
    );
});
DropdownMenuItem.displayName = 'DropdownMenuItem';

export interface DropdownMenuLabelProps
    extends React.HTMLAttributes<HTMLDivElement> { }

/**
 * Header/Label for a group of items in the DropdownMenu.
 * Often used to explain context before a series of `DropdownMenuItem` or `DropdownMenuGroup` elements.
 */
const DropdownMenuLabel = React.forwardRef<
    HTMLDivElement,
    DropdownMenuLabelProps
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('px-2 py-1.5 text-sm font-semibold', className)}
        {...props}
    />
));
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

export interface DropdownMenuSeparatorProps
    extends React.HTMLAttributes<HTMLDivElement> { }

/**
 * Visual separator line between components, specifically designed to divide functional groups inside the menu.
 * Automatically acts as a structural border spacing element.
 */
const DropdownMenuSeparator = React.forwardRef<
    HTMLDivElement,
    DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        role="separator"
        className={cn('-mx-1 my-1 h-px bg-gray-100', className)}
        {...props}
    />
));
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

export interface DropdownMenuGroupProps
    extends React.HTMLAttributes<HTMLDivElement> { }

/**
 * Functional Grouping container for complex sets of items.
 * Implements `role="group"` as per WAI-ARIA specs to structure items semantically.
 */
const DropdownMenuGroup = React.forwardRef<
    HTMLDivElement,
    DropdownMenuGroupProps
>(({ className, ...props }, ref) => (
    <div ref={ref} role="group" className={cn(className)} {...props} />
));
DropdownMenuGroup.displayName = 'DropdownMenuGroup';

export interface DropdownMenuShortcutProps
    extends React.HTMLAttributes<HTMLSpanElement> { }

/**
 * Styling hint container specifically meant for showing keyboard shortcuts appended to a DropdownMenuItem.
 */
const DropdownMenuShortcut = ({
    className,
    ...props
}: DropdownMenuShortcutProps) => {
    return (
        <span
            className={cn(
                'ml-auto text-xs tracking-widest opacity-60',
                className
            )}
            {...props}
        />
    );
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuGroup,
    DropdownMenuShortcut,
};
