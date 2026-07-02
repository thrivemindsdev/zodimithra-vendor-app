export default function CustomLabel({
    title,
    className = ''
}) {
    return (
        <label className={`font-['Poppins'] text-[14px] font-medium text-[#2A0B07] ${className}`}>
            {title}
        </label>
    );
}