import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/authSlice';
import { 
    useGetUserDetailsQuery, 
    useGetSpecializationsQuery, 
    useCompleteRegistrationMutation 
} from '../../redux/api/authApi';

import BasicInfo from '../../components/Profile/BasicInfo';
import Specializations from '../../components/Profile/Specializations';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import ConsultationRates from '../../components/Profile/ConsultationRates';
import ProfileActions from '../../components/Profile/ProfileActions';

export default function Profile() {
    const dispatch = useDispatch();

    // API Queries/Mutations
    const { data: userDetailsResponse } = useGetUserDetailsQuery();
    const { data: specializationsList } = useGetSpecializationsQuery();
    const [completeRegistration, { isLoading: isSaving }] = useCompleteRegistrationMutation();

    const user = userDetailsResponse?.data || userDetailsResponse;

    // Form states
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [experience, setExperience] = useState('');
    const [selectedSpecializations, setSelectedSpecializations] = useState([]);
    const [chatPrice, setChatPrice] = useState(0);
    const [callPrice, setCallPrice] = useState(0);
    const [videoPrice, setVideoPrice] = useState(0);

    // Image upload states
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    // Clean up preview URL to prevent memory leaks
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleImageSelect = (file) => {
        setSelectedImage(file);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(URL.createObjectURL(file));
    };

    // Sync state when details load
    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setBio(user.bio || '');
            setExperience(user.experience || '');
            
            if (user.pricing) {
                setChatPrice(user.pricing.chat_price || 0);
                setCallPrice(user.pricing.call_price || 0);
                setVideoPrice(user.pricing.video_price || 0);
            } else if (user.price_per_minute) {
                setChatPrice(parseFloat(user.price_per_minute));
            }

            // Map user's specialization names to IDs from the full specializationsList
            if (user.specializations && specializationsList) {
                const mappedIds = user.specializations.map(specName => {
                    const found = specializationsList.find(s => s.name.toLowerCase() === specName.toLowerCase());
                    return found ? found.id : null;
                }).filter(id => id !== null);
                setSelectedSpecializations(mappedIds);
            }
        }
    }, [user, specializationsList]);

    // Handle Profile Save
    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('bio', bio || '');
            formData.append('experience', experience || '0');
            formData.append('onboarding_completed', '1');
            formData.append('chat_price', chatPrice || 0);
            formData.append('call_price', callPrice || 0);
            formData.append('video_price', videoPrice || 0);
            formData.append('gender', user?.gender || 'other');
            formData.append('role', 'astrologer');
            formData.append('current_location', user?.current_location || '');

            selectedSpecializations.forEach(id => {
                formData.append('specialization_ids[]', id);
            });

            if (selectedImage) {
                formData.append('profile_image', selectedImage);
            }

            const response = await completeRegistration(formData).unwrap();
            const updatedUser = response.data || response;

            dispatch(setUser(updatedUser));
            setSelectedImage(null);
            alert('Profile saved successfully!');
        } catch (err) {
            console.error('Save profile failed:', err);
            alert(err?.data?.message || 'Failed to save profile. Please review your input and try again.');
        }
    };

    return (
        <div className="flex justify-center items-start p-0 m-0 bg-linear-to-b from-[#FFEEDE] via-[#FFF3E0] to-[#DEEBFF]">
            <div className="w-full min-h-screen md:min-h-0 bg-linear-to-b from-[#FFEEDE] via-[#FFF3E0] to-[#DEEBFF] md:bg-white/45 md:backdrop-blur-xl shadow-[0px_10px_40px_rgba(0,0,0,0.12)] md:shadow-[0px_20px_50px_rgba(0,0,0,0.08)] flex flex-col relative overflow-y-auto overflow-x-hidden box-border">

                <ProfileHeader 
                    name={user?.name} 
                    phone={user?.phone} 
                    rating={user?.rating} 
                    totalSessions={user?.total_sessions} 
                    imageUrl={previewUrl || user?.image_url}
                    onImageSelect={handleImageSelect}
                />
                
                <div className="w-full p-4 pb-32 md:p-6">
                    <div className="space-y-4 md:space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <BasicInfo 
                                name={name} 
                                setName={setName} 
                                bio={bio} 
                                setBio={setBio} 
                                experience={experience} 
                                setExperience={setExperience} 
                            />
                            
                            <Specializations 
                                specializationsList={specializationsList} 
                                selectedIds={selectedSpecializations} 
                                onChange={setSelectedSpecializations} 
                            />
                        </div>

                        <ConsultationRates 
                            chatPrice={chatPrice} 
                            setChatPrice={setChatPrice} 
                            callPrice={callPrice} 
                            setCallPrice={setCallPrice} 
                            videoPrice={videoPrice} 
                            setVideoPrice={setVideoPrice} 
                        />

                        <ProfileActions 
                            onSave={handleSave} 
                            isSaving={isSaving} 
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
