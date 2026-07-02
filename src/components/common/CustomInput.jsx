import React from 'react';

/**
 * CustomInput component
 * @param {string} [type='text'] - Input type (text, date, time, etc.)
 * @param {string} name - Input name
 * @param {string} value - Input value
 * @param {function} onChange - Change handler function
 * @param {string} [placeholder] - Placeholder text
 * @param {boolean} [required=false] - Required validation flag
 * @param {React.ReactNode} [icon] - Custom icon rendered on the right side of the input
 * @param {string} [className] - Optional extra CSS classes for the input
 */
export default function CustomInput({
    type = 'text',
    name,
    value,
    onChange,
    placeholder,
    required = false,
    icon,
    className = '',
    ...props
}) {
    // Determine input padding class depending on icon existence
    const paddingClass = icon ? 'pl-4 pr-10' : 'px-4';
    
    // Webkit date/time picker hiding classes if type is date/time
    const pickerClasses = (type === 'date' || type === 'time')
        ? '[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:bottom-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer'
        : '';

    const baseInputStyle = `w-full h-[52px] bg-[#F5ECE3] rounded-[15px] outline-none text-[#2A0B07] text-[14px] border-none placeholder:text-[#2A0B07]/50 ${paddingClass} ${pickerClasses}`;

    return (
        <div className="relative w-full flex items-center">
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={`${baseInputStyle} ${className}`}
                {...props}
            />
            {icon && (
                <div className="absolute right-4 pointer-events-none flex items-center justify-center">
                    {icon}
                </div>
            )}
        </div>
    );
}
