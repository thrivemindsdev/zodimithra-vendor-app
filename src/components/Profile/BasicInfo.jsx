import React from 'react';

export default function BasicInfo({ 
    name = '', 
    setName = () => {}, 
    bio = '', 
    setBio = () => {}, 
    experience = '', 
    setExperience = () => {} 
}) {
    return (
        <section className="bg-[#F9F8F4] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.25)]">
            <h2 className="text-[20px] font-['Sofia_Sans'] font-semibold text-[#424040] px-4 pt-4 pb-2.5">Basic Info</h2>

            <div className="px-6 pb-4 md:px-7 md:pb-5 space-y-2.5">
                <div>
                    <label className="block text-[14px] font-medium text-black mb-2.5">Display Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter display name"
                        className="w-full rounded-[15px] bg-[#F5ECE3] border-[1px] border-[#ECECEC]/20 px-3 py-2.5 text-[14px] font-light text-[#2A0B07] focus:outline-none focus:ring-1 focus:ring-[#2A0B07]/30 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-[14px] font-medium text-black mb-2.5">Bio</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Enter biography"
                        rows={3}
                        className="w-full rounded-[15px] bg-[#F5ECE3] border-[1px] border-[#ECECEC]/20 px-3 py-2.5 text-[14px] font-light text-[#2A0B07] focus:outline-none focus:ring-1 focus:ring-[#2A0B07]/30 transition-all resize-none"
                    />
                </div>

                <div>
                    <label className="block text-[14px] font-medium text-black mb-2.5">Experience (Years)</label>
                    <input
                        type="number"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="Enter years of experience"
                        className="w-full rounded-[15px] bg-[#F5ECE3] border-[1px] border-[#ECECEC]/20 px-3 py-2.5 text-[14px] font-light text-[#2A0B07] focus:outline-none focus:ring-1 focus:ring-[#2A0B07]/30 transition-all"
                    />
                </div>
            </div>
        </section>
    );
}
