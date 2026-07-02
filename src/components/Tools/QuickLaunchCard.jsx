
export default function QuickLaunchCard({ label, icon, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex flex-col items-center justify-between w-[90px] h-[90px] px-2 py-4 bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.25)] rounded-[18px] border-[0.6px] border-[rgba(0,0,0,0.2)]"
        >
            <img src={icon} alt={label} className="w-[28px] h-[28px] object-contain" />
            <span className="font-['Poppins'] font-medium text-[14px] text-[#000000]">
                {label}
            </span>
        </button>
    );
}
