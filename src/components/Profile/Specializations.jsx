import React from 'react';

const TagButton = ({ children, active, onClick }) => {
    const base = 'cursor-pointer flex items-center justify-center text-center leading-none px-[26px] py-[10px] rounded-full text-[12px] font-poppins border-[1px] select-none transition-all duration-200 active:scale-95';
    const activeStyle = 'border-[#691919] text-[#691919] bg-[#F4E1DE] font-semibold shadow-sm';
    const inactiveStyle = 'border-[#B88B1B]/40 text-[#B88B1B] bg-[#F4EEDE]/50 hover:bg-[#F4EEDE]/80';
    return (
        <button 
            type="button"
            onClick={onClick} 
            className={`${base} ${active ? activeStyle : inactiveStyle}`}
        >
            {children}
        </button>
    );
};

export default function Specializations({ 
    specializationsList = [], 
    selectedIds = [], 
    onChange = () => {} 
}) {
    const handleToggle = (id) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter(x => x !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    return (
        <section className="bg-[#F9F8F4] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.25)] h-full">
            <h2 className="text-[20px] font-['Sofia_Sans'] font-semibold text-[#424040] px-4 pt-4 pb-2.5">Specializations</h2>
            <div className="ps-4 pe-3 pb-4 md:pb-5">
                <div className="flex flex-wrap gap-x-[10px] gap-y-[15px]">
                    {specializationsList?.map((spec) => (
                        <TagButton 
                            key={spec.id} 
                            active={selectedIds.includes(spec.id)}
                            onClick={() => handleToggle(spec.id)}
                        >
                            {spec.name}
                        </TagButton>
                    ))}
                </div>
            </div>
        </section>
    );
}
