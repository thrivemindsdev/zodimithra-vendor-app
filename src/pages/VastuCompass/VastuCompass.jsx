import React, { useState, useMemo } from 'react';
import CustomHeader from '../../components/common/CustomHeader';
import CustomInput from '../../components/common/CustomInput';
import CustomLabel from '../../components/common/CustomLabel';
import CustomButton from '../../components/common/CustomButton';
import compassImg from '../../assets/numerology/compass.png';
import needleImg from '../../assets/numerology/needle.png';
import { useGetVastuRulesQuery } from '../../redux/api/toolsApi';

// Reusable SVG Icons for Room Cards
const BedIcon = () => (
    <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 11V8M21 8H1M21 8H11V3H18C18.7956 3 19.5587 3.31607 20.1213 3.87868C20.6839 4.44129 21 5.20435 21 6V8ZM1 2V11M4 3C4 3.53043 4.21071 4.03914 4.58579 4.41421C4.96086 4.78929 5.46957 5 6 5C6.53043 5 7.03914 4.78929 7.41421 4.41421C7.78929 4.03914 8 3.53043 8 3C8 2.46957 7.78929 1.96086 7.41421 1.58579C7.03914 1.21071 6.53043 1 6 1C5.46957 1 4.96086 1.21071 4.58579 1.58579C4.21071 1.96086 4 2.46957 4 3Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
);

const PoojaIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0151 0.000479978C10.472 0.000486655 10.9164 0.149482 11.2809 0.42487C11.6454 0.700258 11.9102 1.08701 12.0351 1.52648L12.0731 1.68748L13.5241 8.94248C13.5928 9.28642 13.7507 9.60625 13.9821 9.86988C14.2134 10.1335 14.51 10.3317 14.8421 10.4445L15.0001 10.4905L16.6961 10.9145C17.0466 11.0021 17.3537 11.2134 17.561 11.5093C17.7682 11.8053 17.8616 12.1661 17.8241 12.5255L17.8031 12.6645L17.1091 16.1335C17.0574 16.3918 16.9552 16.6374 16.8084 16.8562C16.6615 17.0749 16.4728 17.2625 16.2533 17.4081C16.0337 17.5537 15.7875 17.6545 15.5289 17.7047C15.2702 17.7548 15.0042 17.7534 14.7461 17.7005L14.6001 17.6645L11.5431 16.7905C10.4937 16.491 9.57111 15.8564 8.91611 14.9835C8.31424 15.7858 7.485 16.3886 6.53611 16.7135L6.29011 16.7905L3.23311 17.6645C2.97972 17.7368 2.71454 17.7584 2.4528 17.7279C2.19106 17.6974 1.93792 17.6155 1.70793 17.4869C1.47794 17.3583 1.27563 17.1855 1.11263 16.9785C0.949624 16.7714 0.829143 16.5342 0.758106 16.2805L0.723106 16.1335L0.0291062 12.6635C-0.041718 12.3092 0.0177099 11.9413 0.196467 11.6273C0.375224 11.3133 0.661297 11.0744 1.00211 10.9545L1.13611 10.9145L2.83211 10.4905C3.17229 10.4054 3.48412 10.2324 3.73634 9.98877C3.98855 9.74515 4.17228 9.43951 4.26911 9.10248L4.30811 8.94248L5.75811 1.68748C5.82456 1.35578 5.97017 1.04504 6.18253 0.781708C6.3949 0.518377 6.66774 0.31025 6.97784 0.175036C7.28793 0.039823 7.62611 -0.0184732 7.96358 0.00510887C8.30105 0.0286909 8.62783 0.133453 8.91611 0.31048C9.23611 0.11448 9.61211 0.000479978 10.0151 0.000479978ZM14.7221 12.4825L14.0671 15.4325L15.1481 15.7415L15.7481 12.7395L14.7221 12.4825ZM3.11011 12.4825L2.08411 12.7395L2.68411 15.7415L3.76511 15.4315L3.11011 12.4825ZM10.0151 2.00048C9.98893 2.00074 9.9639 2.01125 9.94539 2.02976C9.92688 2.04827 9.91637 2.0733 9.91611 2.09948V11.9835C9.916 12.6045 10.1086 13.2102 10.4674 13.7171C10.8262 14.224 11.3334 14.6071 11.9191 14.8135L12.1401 14.8815L12.8741 11.5805C12.1993 10.999 11.7379 10.2089 11.5631 9.33548L10.1131 2.08048C10.1085 2.05789 10.0962 2.03759 10.0784 2.02301C10.0605 2.00844 10.0382 2.00048 10.0151 2.00048ZM7.81711 2.00048C7.79423 2.0007 7.77211 2.00877 7.75446 2.02333C7.73681 2.03789 7.72468 2.05806 7.72011 2.08048L6.26911 9.33548C6.09453 10.2088 5.63352 10.9988 4.95911 11.5805L5.69211 14.8815L5.74011 14.8675C6.36689 14.6884 6.9183 14.3101 7.31091 13.7898C7.70353 13.2694 7.91597 12.6353 7.91611 11.9835V2.09948C7.91584 2.07313 7.90519 2.04795 7.88647 2.02941C7.86774 2.01088 7.84245 2.00048 7.81611 2.00048H7.81711Z" fill="black" />
    </svg>
);

const KitchenIcon = () => (
    <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.1145 11.5C2.24783 11.3333 2.34783 11.1293 2.4145 10.888C2.48116 10.6467 2.5145 10.3507 2.5145 10C2.5145 9.5 2.34783 8.86667 2.0145 8.1C1.68116 7.33333 1.5145 6.75833 1.5145 6.375C1.5145 6.175 1.5355 5.96667 1.5775 5.75C1.6195 5.53333 1.73183 5.28333 1.9145 5H3.4145C3.23116 5.28333 3.11883 5.53333 3.0775 5.75C3.03616 5.96667 3.01516 6.175 3.0145 6.375C3.0145 6.75833 3.18116 7.33333 3.5145 8.1C3.84783 8.86667 4.0145 9.5 4.0145 10C4.0145 10.35 3.98116 10.6377 3.9145 10.863C3.84783 11.0883 3.74783 11.3007 3.6145 11.5H2.1145ZM8.6145 11.5C8.74783 11.3333 8.84783 11.1293 8.9145 10.888C8.98116 10.6467 9.0145 10.3507 9.0145 10C9.0145 9.5 8.84783 8.86667 8.5145 8.1C8.18116 7.33333 8.0145 6.75833 8.0145 6.375C8.0145 6.175 8.0355 5.96667 8.0775 5.75C8.1195 5.53333 8.23183 5.28333 8.4145 5H9.9145C9.73116 5.28333 9.61883 5.53333 9.5775 5.75C9.53616 5.96667 9.51516 6.175 9.5145 6.375C9.5145 6.75833 9.68116 7.33333 10.0145 8.1C10.3478 8.86667 10.5145 9.5 10.5145 10C10.5145 10.35 10.4812 10.6377 10.4145 10.863C10.3478 11.0883 10.2478 11.3007 10.1145 11.5H8.6145ZM5.3645 11.5C5.49783 11.3333 5.59783 11.1293 5.6645 10.888C5.73116 10.6467 5.7645 10.3507 5.7645 10C5.7645 9.5 5.59783 8.86667 5.2645 8.1C4.93116 7.33333 4.7645 6.75833 4.7645 6.375C4.7645 6.175 4.7855 5.96667 4.8275 5.75C4.8695 5.53333 4.98183 5.28333 5.1645 5H6.6645C6.48116 5.28333 6.36883 5.53333 6.3275 5.75C6.28616 5.96667 6.26516 6.175 6.2645 6.375C6.2645 6.75833 6.43116 7.33333 6.7645 8.1C7.09783 8.86667 7.2645 9.5 7.2645 10C7.2645 10.35 7.23116 10.6377 7.1645 10.863C7.09783 11.0883 6.99783 11.3007 6.8645 11.5H5.3645ZM6.7645 20C5.08116 20 3.59783 19.4377 2.3145 18.313C1.03116 17.1883 0.264497 15.7923 0.0144974 14.125C-0.0355026 13.825 0.0438307 13.5623 0.252497 13.337C0.461164 13.1117 0.715164 12.9993 1.0145 13H11.5395L12.6395 2.65C12.7228 1.9 13.0438 1.27067 13.6025 0.762001C14.1612 0.253335 14.8318 -0.000665358 15.6145 1.3089e-06C16.4478 1.3089e-06 17.1562 0.291668 17.7395 0.875001C18.3228 1.45833 18.6145 2.16667 18.6145 3C18.6145 3.23333 18.5938 3.54167 18.5525 3.925L18.4895 4.5L16.5145 4.25L16.5645 3.737C16.5978 3.39567 16.6145 3.15 16.6145 3C16.6145 2.71667 16.5185 2.47933 16.3265 2.288C16.1345 2.09667 15.8972 2.00067 15.6145 2C15.3478 2 15.1228 2.08767 14.9395 2.263C14.7562 2.43833 14.6478 2.65067 14.6145 2.9L13.4645 13.775C13.2812 15.5417 12.5562 17.021 11.2895 18.213C10.0228 19.405 8.5145 20.0007 6.7645 20ZM6.7645 18C7.74783 18 8.63116 17.725 9.4145 17.175C10.1978 16.625 10.7645 15.9 11.1145 15H2.3395C2.72283 15.9 3.31016 16.625 4.1015 17.175C4.89283 17.725 5.7805 18 6.7645 18Z" fill="black" />
    </svg>
);

const BathIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 12V13C19 14.91 17.93 16.57 16.35 17.41L17 20H15L14.5 18H5.5L5 20H3L3.65 17.41C2.8494 16.9849 2.1797 16.3498 1.71282 15.5729C1.24594 14.7959 0.999514 13.9064 1 13V12H0V10H18V3C18 2.73478 17.8946 2.48043 17.7071 2.29289C17.5196 2.10536 17.2652 2 17 2C16.5 2 16.12 2.34 16 2.79C16.63 3.33 17 4.13 17 5H11C11 4.20435 11.3161 3.44129 11.8787 2.87868C12.4413 2.31607 13.2044 2 14 2H14.17C14.58 0.84 15.69 0 17 0C17.7956 0 18.5587 0.316071 19.1213 0.87868C19.6839 1.44129 20 2.20435 20 3V12H19ZM17 12H3V13C3 13.7956 3.31607 14.5587 3.87868 15.1213C4.44129 15.6839 5.20435 16 6 16H14C14.7956 16 15.5587 15.6839 16.1213 15.1213C16.6839 14.5587 17 13.7956 17 13V12Z" fill="black" />
    </svg>
);

const StudyIcon = () => (
    <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.75 16.75V2.75C0.75 2.21957 0.960714 1.71086 1.33579 1.33579C1.71086 0.960714 2.21957 0.75 2.75 0.75H16.15C16.3091 0.75 16.4617 0.813214 16.5743 0.925736C16.6868 1.03826 16.75 1.19087 16.75 1.35V14.464M2.75 14.75H16.75M2.75 18.75H16.75" stroke="black" stroke-width="1.5" stroke-linecap="round" />
        <path d="M2.75 18.75C2.21957 18.75 1.71086 18.5393 1.33579 18.1642C0.960714 17.7891 0.75 17.2804 0.75 16.75C0.75 16.2196 0.960714 15.7109 1.33579 15.3358C1.71086 14.9607 2.21957 14.75 2.75 14.75" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M5.75 4.75H11.75" stroke="black" stroke-width="1.5" stroke-linecap="round" />
    </svg>
);

const LivingIcon = () => (
    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 2V0H17V2H1ZM1 16V10H0V8L1 3H17L18 8V10H17V16H15V10H11V16H1ZM3 14H9V10H3V14ZM2.05 8H15.95L15.35 5H2.65L2.05 8Z" fill="black" />
    </svg>
);

const StoreIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9H21" />
        <path d="M3 9L4.5 4H19.5L21 9" />
        <path d="M5 9V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V9" />
        <path d="M9 13H15" />
    </svg>
);

const ShareIcon = () => (
    <svg width="15" height="15" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 2V10.5M11 4L8 1L5 4M1 9V14C1 14.5304 1.21071 15.0391 1.58579 15.4142C1.96086 15.7893 2.46957 16 3 16H13C13.5304 16 14.0391 15.7893 14.4142 15.4142C14.7893 15.0391 15 14.5304 15 14V9" stroke="#B81B1B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1.5L6 6.5L11 1.5" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Helper to map card titles to backend room types
const getRoomType = (title) => {
    const lower = title.toLowerCase();
    if (lower.includes('bed')) return 'bedroom';
    if (lower.includes('pooja') || lower.includes('puja')) return 'pujaRoom';
    if (lower.includes('kitchen')) return 'kitchen';
    if (lower.includes('bath')) return 'bathroom';
    if (lower.includes('living')) return 'livingRoom';
    return 'bedroom'; // default fallback
};

const getDegreeForDirection = (dir) => {
    const primaryDir = dir.split('/')[0].trim();
    switch (primaryDir) {
        case 'North': case 'N': return 0;
        case 'North-East': case 'NE': return 45;
        case 'East': case 'E': return 90;
        case 'South-East': case 'SE': return 135;
        case 'South': case 'S': return 180;
        case 'South-West': case 'SW': return 225;
        case 'West': case 'W': return 270;
        case 'North-West': case 'NW': return 315;
        default: return 0;
    }
};

// Helper to find a matching rule from the API using degree-based range logic from zodimithra
const findRule = (rules, title, cardDir) => {
    if (!rules || !Array.isArray(rules)) return null;
    const roomType = getRoomType(title);
    const d = getDegreeForDirection(cardDir);
    return rules.find((rule) => {
        if (rule.room_type !== roomType) return false;
        const min = parseFloat(rule.min_degree);
        const max = parseFloat(rule.max_degree);
        if (min > max) {
            return d >= min || d <= max;
        } else {
            return d >= min && d <= max;
        }
    });
};

export default function VastuCompass() {
    const [propertyType, setPropertyType] = useState('');
    const [doorFacing, setDoorFacing] = useState('');
    const [analyzedDoorFacing, setAnalyzedDoorFacing] = useState('');
    const [loading, setLoading] = useState(false);
    const [analyzed, setAnalyzed] = useState(false);
    const [selectedCardIdx, setSelectedCardIdx] = useState(0);

    const { data: rulesData, isLoading: isRulesLoading } = useGetVastuRulesQuery();

    const handleAnalyse = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setAnalyzed(true);
            setAnalyzedDoorFacing(doorFacing);
        }, 800);
    };

    // Helper to map door facing to compass angle
    const getAngleForFacing = (facing) => {
        switch (facing) {
            case 'North': return 0;
            case 'North-East': return 45;
            case 'East': return 90;
            case 'South-East': return 135;
            case 'South': return 180;
            case 'South-West': return 225;
            case 'West': return 270;
            case 'North-West': return 315;
            default: return 0;
        }
    };

    // Vastu compatibility details based on Main Door Facing
    const vastuEvaluations = {
        South: {
            cards: [
                { title: 'Master Bed', dir: 'SW', status: 'Good', rating: 'good', icon: <BedIcon /> },
                { title: 'Pooja Room', dir: 'SE', status: 'Best', rating: 'best', icon: <PoojaIcon /> },
                { title: 'Kitchen', dir: 'SE', status: 'Good', rating: 'good', icon: <KitchenIcon /> },
                { title: 'Bathroom', dir: 'NW/SE', status: 'Avoid S', rating: 'avoid', icon: <BathIcon /> },
                { title: 'Study', dir: 'NE', status: 'Good', rating: 'good', icon: <StudyIcon /> },
                { title: 'Kitchen', dir: 'NW', status: 'Good', rating: 'good', icon: <StoreIcon /> }
            ],
            tip: 'Place large furniture on South wall. Keep NE area clutter-free. Use lighter colors in East. Place a Surya yantra near entrance.'
        },
        North: {
            cards: [
                { title: 'Master Bed', dir: 'SW', status: 'Best', rating: 'best', icon: <BedIcon /> },
                { title: 'Pooja Room', dir: 'NE', status: 'Best', rating: 'best', icon: <PoojaIcon /> },
                { title: 'Kitchen', dir: 'SE', status: 'Good', rating: 'good', icon: <KitchenIcon /> },
                { title: 'Bathroom', dir: 'NW', status: 'Good', rating: 'good', icon: <BathIcon /> },
                { title: 'Study', dir: 'E', status: 'Good', rating: 'good', icon: <StudyIcon /> },
                { title: 'Living Room', dir: 'NW', status: 'Good', rating: 'good', icon: <LivingIcon /> }
            ],
            tip: 'Keep North area completely open and light. Avoid heavy metal items in the Northeast. Paint with light blue or white. Keep a water fountain near entrance.'
        },
        East: {
            cards: [
                { title: 'Master Bed', dir: 'SW', status: 'Best', rating: 'best', icon: <BedIcon /> },
                { title: 'Pooja Room', dir: 'NE', status: 'Best', rating: 'best', icon: <PoojaIcon /> },
                { title: 'Kitchen', dir: 'SE', status: 'Best', rating: 'best', icon: <KitchenIcon /> },
                { title: 'Bathroom', dir: 'W', status: 'Good', rating: 'good', icon: <BathIcon /> },
                { title: 'Study', dir: 'E', status: 'Good', rating: 'good', icon: <StudyIcon /> },
                { title: 'Living Room', dir: 'NW', status: 'Good', rating: 'good', icon: <LivingIcon /> }
            ],
            tip: 'Allow morning sunlight to enter freely. Avoid heavy concrete structures in the East. Place a green plant at the entrance. Use cream or light orange tones.'
        },
        West: {
            cards: [
                { title: 'Master Bed', dir: 'SW', status: 'Best', rating: 'best', icon: <BedIcon /> },
                { title: 'Pooja Room', dir: 'W', status: 'Good', rating: 'good', icon: <PoojaIcon /> },
                { title: 'Kitchen', dir: 'SE', status: 'Good', rating: 'good', icon: <KitchenIcon /> },
                { title: 'Bathroom', dir: 'NW', status: 'Best', rating: 'best', icon: <BathIcon /> },
                { title: 'Study', dir: 'W', status: 'Good', rating: 'good', icon: <StudyIcon /> },
                { title: 'Living Room', dir: 'NW', status: 'Good', rating: 'good', icon: <LivingIcon /> }
            ],
            tip: 'Ensure the West wall is higher than the East wall. Keep fresh indoor plants in the West window. Place a bronze spiral helix near the entrance.'
        },
        'North-East': {
            cards: [
                { title: 'Master Bed', dir: 'SW', status: 'Good', rating: 'good', icon: <BedIcon /> },
                { title: 'Pooja Room', dir: 'NE', status: 'Best', rating: 'best', icon: <PoojaIcon /> },
                { title: 'Kitchen', dir: 'SE', status: 'Good', rating: 'good', icon: <KitchenIcon /> },
                { title: 'Bathroom', dir: 'NW', status: 'Good', rating: 'good', icon: <BathIcon /> },
                { title: 'Study', dir: 'NE', status: 'Best', rating: 'best', icon: <StudyIcon /> },
                { title: 'Living Room', dir: 'NW', status: 'Good', rating: 'good', icon: <LivingIcon /> }
            ],
            tip: 'Northeast entrance is highly auspicious. Keep it clutter-free, tidy and well-lit. Avoid placing shoe racks directly at the threshold.'
        },
        'South-East': {
            cards: [
                { title: 'Master Bed', dir: 'SW', status: 'Good', rating: 'good', icon: <BedIcon /> },
                { title: 'Pooja Room', dir: 'NE', status: 'Good', rating: 'good', icon: <PoojaIcon /> },
                { title: 'Kitchen', dir: 'SE', status: 'Best', rating: 'best', icon: <KitchenIcon /> },
                { title: 'Bathroom', dir: 'NW', status: 'Good', rating: 'good', icon: <BathIcon /> },
                { title: 'Study', dir: 'E', status: 'Good', rating: 'good', icon: <StudyIcon /> },
                { title: 'Living Room', dir: 'NW', status: 'Good', rating: 'good', icon: <LivingIcon /> }
            ],
            tip: 'Place a copper helix at the entrance to block negative energies. Paint the main door in cream, ivory or light yellow. Avoid dark red or black doors.'
        },
        'South-West': {
            cards: [
                { title: 'Master Bed', dir: 'SW', status: 'Best', rating: 'best', icon: <BedIcon /> },
                { title: 'Pooja Room', dir: 'NE', status: 'Good', rating: 'good', icon: <PoojaIcon /> },
                { title: 'Kitchen', dir: 'SE', status: 'Good', rating: 'good', icon: <KitchenIcon /> },
                { title: 'Bathroom', dir: 'NW', status: 'Good', rating: 'good', icon: <BathIcon /> },
                { title: 'Study', dir: 'E', status: 'Good', rating: 'good', icon: <StudyIcon /> },
                { title: 'Living Room', dir: 'NW', status: 'Good', rating: 'good', icon: <LivingIcon /> }
            ],
            tip: 'Install a lead metal pyramid above the door. Keep the threshold heavy and slightly raised. Avoid water bodies or borewells in the Southwest.'
        },
        'North-West': {
            cards: [
                { title: 'Master Bed', dir: 'SW', status: 'Good', rating: 'good', icon: <BedIcon /> },
                { title: 'Pooja Room', dir: 'NE', status: 'Good', rating: 'good', icon: <PoojaIcon /> },
                { title: 'Kitchen', dir: 'SE', status: 'Good', rating: 'good', icon: <KitchenIcon /> },
                { title: 'Bathroom', dir: 'NW', status: 'Best', rating: 'best', icon: <BathIcon /> },
                { title: 'Study', dir: 'W', status: 'Good', rating: 'good', icon: <StudyIcon /> },
                { title: 'Living Room', dir: 'NW', status: 'Good', rating: 'good', icon: <LivingIcon /> }
            ],
            tip: 'Hang a silver-plated wind chime at the entrance. Use silver, metallic, or white gate colors. Fosters helpful friendships and travels.'
        }
    };

    const currentResult = vastuEvaluations[analyzedDoorFacing] || vastuEvaluations.South;

    // Dynamically enrich cards with API rule data if available
    const enrichedCards = useMemo(() => {
        if (!rulesData) return currentResult.cards;
        return currentResult.cards.map((card) => {
            const matchedRule = findRule(rulesData, card.title, card.dir);
            if (matchedRule) {
                let status = card.status;
                let rating = card.rating;
                if (matchedRule.type === 'auspicious') {
                    status = 'Best';
                    rating = 'best';
                } else if (matchedRule.type === 'neutral') {
                    status = 'Good';
                    rating = 'good';
                } else if (matchedRule.type === 'avoid') {
                    status = 'Avoid';
                    rating = 'avoid';
                }
                return {
                    ...card,
                    status: status,
                    rating: rating,
                    tip: `${matchedRule.message || ''} ${matchedRule.tip || ''}`.trim()
                };
            }
            return card;
        });
    }, [currentResult.cards, rulesData]);

    const selectedCard = enrichedCards[selectedCardIdx];

    // Helper for status styling inside cards
    const getStatusColorClass = (rating) => {
        if (rating === 'best' || rating === 'good') {
            return 'text-[#1D8A57]';
        }
        if (rating === 'avoid') {
            return 'text-[#CF9914]';
        }
        return 'text-[#B81B1B]';
    };

    return (
        <div className="w-full flex flex-col min-h-screen bg-[#F9F8F4] text-[#2A0B07] font-['Poppins']">
            {/* Header Component */}
            <CustomHeader
                title="Vastu Compass"
                subtitle="Direction & Element Analysis"
            />

            <div className="flex-grow p-4 sm:p-6 flex flex-col gap-6 max-w-lg mx-auto w-full box-border pb-28">

                {/* Gold Compass Dial */}
                <div className="flex flex-col items-center justify-center py-2">
                    <div className="relative w-[225px] h-[225px]">
                        <img
                            src={compassImg}
                            alt="Compass"
                            className="w-full h-full object-contain"
                            style={{ transform: 'rotate(40deg)' }}
                        />
                        <img
                            src={needleImg}
                            alt="Needle"
                            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                            style={{
                                transform: `rotate(${getAngleForFacing(analyzedDoorFacing)}deg)`,
                                transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        />
                    </div>
                </div>

                {/* Form Inputs using custom components */}
                <form onSubmit={handleAnalyse} className="flex flex-col gap-4 w-full">

                    {/* Property Type CustomInput */}
                    <div className="flex flex-col items-start gap-2 w-full">
                        <CustomLabel title="Property Type" />
                        <CustomInput
                            type="text"
                            name="propertyType"
                            value={propertyType}
                            onChange={(e) => setPropertyType(e.target.value)}
                            placeholder="e.g. Home, Office, Plot"
                            required
                        />
                    </div>

                    {/* Main Door Facing CustomInput with Datalist Options */}
                    <div className="flex flex-col items-start gap-2 w-full">
                        <CustomLabel title="Main Door Facing" />
                        <CustomInput
                            type="text"
                            name="doorFacing"
                            value={doorFacing}
                            onChange={(e) => {
                                setDoorFacing(e.target.value);
                                setSelectedCardIdx(0);
                            }}
                            placeholder="Select facing direction..."
                            list="facings-list"
                            required
                        />
                        <datalist id="facings-list">
                            <option value="North" />
                            <option value="North-East" />
                            <option value="East" />
                            <option value="South-East" />
                            <option value="South" />
                            <option value="South-West" />
                            <option value="West" />
                            <option value="North-West" />
                        </datalist>
                    </div>

                    {/* Analyse CustomButton */}
                    <CustomButton
                        type="submit"
                        loading={loading || isRulesLoading}
                        variant="primary"
                    >
                        Analyse Vastu
                    </CustomButton>
                </form>

                {/* Room Placement Guide Results Section */}
                {analyzed && (
                    <div className="flex flex-col gap-[11px] w-full mt-2">
                        {/* Section Header with Share Button */}
                        <div className="flex justify-between items-center w-full mb-[10px]">
                            <span className="text-[20px] font-bold text-[#2A0B07] font-['Sofia_Sans']">
                                Room Placement Guide
                            </span>

                            {/* Share CustomButton */}
                            <CustomButton
                                variant="outline"
                                onClick={() => console.log('Sharing compatibility results...')}
                                icon={<ShareIcon />}
                                className="!h-[27px] !w-auto py-1 px-4 !text-[13px] gap-1.5 !rounded-full !border-[#B54D48] !text-[#B54D48] hover:!bg-[#B54D48]/5 transition-colors font-medium"
                            >
                                Share
                            </CustomButton>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '3px', width: '100%' }}>
                            {enrichedCards.map((card, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedCardIdx(idx)}
                                    className={`box-border flex flex-col justify-between items-center p-3.5 h-[128px] rounded-[18px] border border-[rgba(211,198,172,0.8)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-[0px_4px_10px_rgba(42,11,7,0.02)] ${selectedCardIdx === idx ? 'bg-[#FDF2DC]' : 'bg-[#F5ECE3]'
                                        }`}
                                    style={{ width: '100%', boxSizing: 'border-box' }}
                                >
                                    {/* Icon container */}
                                    <div className="flex items-center justify-center h-6 w-full mb-1">
                                        {card.icon}
                                    </div>
                                    {/* Text container */}
                                    <div className="flex flex-col justify-center items-center gap-[2px] w-full">
                                        {/* Title */}
                                        <span className="text-[12px] font-medium font-['Poppins'] text-[#2A0B07] leading-[18px] text-center">
                                            {card.title}
                                        </span>
                                        {/* Direction */}
                                        <span className="text-[10px] font-light font-['Poppins'] text-[#000000] leading-[15px] text-center">
                                            {card.dir}
                                        </span>
                                        {/* Status */}
                                        <span className={`text-[10px] font-bold font-['Poppins'] leading-[15px] text-center ${getStatusColorClass(card.rating)}`}>
                                            {card.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Facing Tip Alert Box (Frame 560 & Frame 561) */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                padding: '0px 0px 0px 5.91837px',
                                width: '100%',
                                maxWidth: '407.18px',
                                backgroundColor: '#2A0B07',
                                boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.25)',
                                borderRadius: '9.46939px',
                                boxSizing: 'border-box',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    padding: '7.10204px 11.8367px 11.8367px 17.7551px',
                                    gap: '10.65px',
                                    width: '100%',
                                    backgroundColor: '#F8F4F3',
                                    borderRadius: '9.46939px',
                                    boxSizing: 'border-box',
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "'Sofia Sans'",
                                        fontStyle: 'normal',
                                        fontWeight: 600,
                                        fontSize: '14.2041px',
                                        lineHeight: '19px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: '#2A0B07',
                                    }}
                                >
                                    ⚠️ {selectedCard ? `${selectedCard.title} (${selectedCard.dir}) Tip` : `${analyzedDoorFacing}-facing Tip`}
                                </span>
                                <p
                                    style={{
                                        fontFamily: "'Poppins'",
                                        fontStyle: 'normal',
                                        fontWeight: 400,
                                        fontSize: '11.8367px',
                                        lineHeight: '19px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: '#2A0B07',
                                        margin: 0,
                                        textAlign: 'left',
                                    }}
                                >
                                    {selectedCard && selectedCard.tip ? selectedCard.tip : currentResult.tip}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
