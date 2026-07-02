import { useNavigate } from 'react-router-dom';
import { useNativeApp } from '../../context/NativeAppContext';
import closeIcon from '../../assets/common/cross.png';

export default function CustomHeader({
    title,
    subtitle,
    onBack,
    className = '',
}) {
    const navigate = useNavigate();
    const handleBack = onBack !== undefined ? onBack : (() => navigate(-1));
    const { isNativeApp, statusBarHeight } = useNativeApp();

    return (
        <div
            className={`relative w-full bg-linear-to-r from-[#4F1819] to-[#752B2A] text-[#ECECEC] px-[14px] pt-3 pb-[18px] flex items-center justify-between shadow-[0px_4px_16px_rgba(0,0,0,0.2)] z-30 ${className}`}
            style={{
                paddingTop: isNativeApp ? statusBarHeight + 12 : 12,
            }}
        >
            <div className="flex items-center gap-[15px] flex-1 min-w-0">
                <div className="h-[56px] w-[56px] bg-[#D9D9D9] rounded-[8px]" />
                {/* Title and Subtitle */}
                <div className="flex flex-col items-start justify-center gap-2">
                    <h1 className="text-[18px] font-medium font-['Poppins'] text-[#ECECEC]">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-[12px] font-light font-['Poppins'] text-[#ECECEC] leading-tight">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            {/* Close button */}
            {handleBack && (
                <button
                    type="button"
                    onClick={handleBack}
                    className="absolute right-[13px]"
                    style={{
                        top: isNativeApp ? statusBarHeight + 12 : 12,
                    }}
                    aria-label="Close"
                >
                    <img src={closeIcon} className='w-7 h-7' alt="Close" />
                </button>
            )}
        </div>
    );
}
