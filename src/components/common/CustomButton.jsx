import React from 'react';

/**
 * CustomButton component
 * @param {React.ReactNode} [children] - Content inside button (takes precedence over text)
 * @param {string} [text] - Simple string text for button
 * @param {function} onClick - Click handler function
 * @param {string} [variant='primary'] - Button variant ('primary' | 'secondary' | 'outline' | 'share')
 * @param {boolean} [disabled=false] - Disabled state
 * @param {boolean} [loading=false] - Loading spinner state
 * @param {string} [type='button'] - Button type (button, submit, reset)
 * @param {React.ReactNode} [icon] - Icon node (placed on the left of text)
 * @param {string} [className] - Optional extra CSS classes
 */
export default function CustomButton({
    children,
    text,
    onClick,
    variant = 'primary',
    disabled = false,
    loading = false,
    type = 'button',
    icon,
    className = '',
}) {
    // Styling mapping
    const baseStyle = "flex items-center justify-center h-[52px] w-full rounded-[20px] font-['Poppins'] font-bold text-[14px]";

    const variants = {
        primary: "bg-[#2A0B07] text-[#ECECEC]",
        secondary: "bg-[#FFC227] text-[#2A0B07]",
        share: "bg-[#FF7B6B] text-[#ECECEC]",
        outline: "bg-[#F4E0E0] text-[#B81B1B] border-[1px] border-[#B81B1B] text-[14px]"
    };

    const activeVariant = variants[variant] || variants.primary;

    return (
        <button
            type={type}
            onClick={disabled || loading ? undefined : onClick}
            disabled={disabled || loading}
            className={`${baseStyle} ${activeVariant} ${className}`}
        >
            {loading ? (
                <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading...</span>
                </div>
            ) : (
                <>
                    {icon && <span className="flex items-center justify-center flex-shrink-0">{icon}</span>}
                    <span>{children || text}</span>
                </>
            )}
        </button>
    );
}
