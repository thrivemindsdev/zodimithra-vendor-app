import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/authSlice';

export default function ProfileActions({ onSave = () => {}, isSaving = false }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/otp');
    };

    return (
        <div className="space-y-2.5">
            <button 
                onClick={onSave}
                disabled={isSaving}
                className="flex items-center justify-center w-full bg-[#2A0B07] text-[#ECECEC] py-4 rounded-[20px] font-['Poppins'] font-bold text-[14px] disabled:opacity-70 active:scale-95 transition-all duration-200"
            >
                {isSaving ? 'Saving Profile...' : 'Save Profile'}
            </button>
            <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center justify-center w-full bg-white text-[#2A0B07] border-[1px] border-[#2A0B07]/20 py-4 rounded-[20px] font-['Poppins'] font-bold text-[14px]"
            >
                Logout
            </button>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-[#FFF6E9] border border-[#5D4037]/10 rounded-[24px] p-6 max-w-[340px] w-full text-center shadow-xl space-y-4 animate-scale-up">
                        <div className="w-12 h-12 rounded-full bg-[#2A0B07]/5 flex items-center justify-center mx-auto text-[#2A0B07]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-['Poppins'] font-bold text-lg text-[#2A0B07]">Confirm Logout</h3>
                            <p className="font-['Poppins'] text-sm text-[#5D4037]/70 leading-relaxed">
                                Are you sure you want to log out of your cosmic session?
                            </p>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 py-3 bg-white text-[#2A0B07] border border-[#2A0B07]/20 rounded-[16px] font-['Poppins'] font-semibold text-sm hover:bg-white/80 active:scale-95 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 py-3 bg-[#2A0B07] text-[#ECECEC] rounded-[16px] font-['Poppins'] font-semibold text-sm hover:bg-[#2A0B07]/90 active:scale-95 transition-all duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
