export default function CustomHeading({
    title,
    className = ''
}) {
    return (
        <h1 className={`font-['Sofia_Sans'] text-[18px] font-semibold text-[#2A0B07] ${className}`}>
            {title}
        </h1>
    );
}