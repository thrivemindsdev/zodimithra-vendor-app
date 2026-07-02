import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuickLaunchCard from '../../components/Tools/QuickLaunchCard';
import ToolBannerCard from '../../components/Tools/ToolBannerCard';
import ToolCard from '../../components/Tools/ToolCard';
import ToolsHeader from '../../components/Tools/ToolsHeader';

import kundliImg from '../../assets/tools/kundli.png';
import planetsImg from '../../assets/tools/planets.png';
import muhurthaImg from '../../assets/tools/muhurtha.png';
import numerologyImg from '../../assets/tools/numerology.png';

const quickActions = [
    {
        label: 'Kundli',
        icon: kundliImg,
        navigate: '/kundli-matching',
    },
    {
        label: 'Planets',
        icon: planetsImg,
        navigate: '/planetary-positions',
    },
    {
        label: 'Muhurtha',
        icon: muhurthaImg,
        navigate: '/muhurth-finder',
    },
    {
        label: 'Numerology',
        icon: numerologyImg,
        navigate: '/numerology-calculator',
    },
];


const calculationCards = [
    {
        title: 'Kundli Matching',
        subtitle: 'Guna Milan & compatibility',
        metadata: '342 uses',
        navigate: '/kundli-matching',
    },
    {
        title: 'Dasha Calculator',
        subtitle: 'Vimshottari Mahadasha Periods',
        metadata: '342 uses',
        navigate: '/dasha-calculator',
    },
    {
        title: 'Numerology',
        subtitle: 'Life path, destiny & soul',
        metadata: '520 uses',
        navigate: '/numerology-calculator',
    },
    {
        title: 'Muhurta Finder',
        subtitle: 'Auspicious event timings',
        metadata: '342 uses',
        badge: 'outline',
        navigate: '/muhurth-finder',
    },
];

const referenceCards = [
    {
        title: 'Gemstone Guide',
        subtitle: 'Planet-to-gem reference',
        metadata: '342 uses',
        navigate: '/gemstone-guide',
    },
    {
        title: 'Rashi Guide',
        subtitle: 'All 12 signs & lords',
        metadata: '342 uses',
        navigate: '/rashi-guide',
    },
    {
        title: 'Vastu Compass',
        subtitle: 'Direction & element guide',
        metadata: '520 uses',
        navigate: '/vastu-compass',
    },
    {
        title: 'Remedy Library',
        subtitle: 'Mantras & rituals by planet',
        metadata: '342 uses',
        badge: 'outline',
        navigate: '/remedy-guide',
    },
    {
        title: 'Nazhika Converter',
        subtitle: 'Vedic time ⏱ Hours/Minutes',
        metadata: 'New',
        badge: 'New',
        navigate: '/nazhika-converter',
    },
    {
        title: 'Prashna',
        subtitle: 'Horary chart from question',
        metadata: 'New',
        badge: 'New',
        navigate: '/prashna',
    },
    {
        title: 'Atlas + Daylight Saving',
        subtitle: 'Lat/Long/Timezone for cities',
        metadata: 'New',
        badge: 'New',
        navigate: '/atlas-daylight-saving',
    },
    {
        title: 'Transit Calendar',
        subtitle: 'Calendar & Abhijit Muhurta',
        metadata: 'New',
        badge: 'New',
        navigate: '/transit-calendar',
    },
    {
        title: 'Yogas Detector',
        subtitle: 'Beneficial & cautionary',
        metadata: 'New',
        badge: 'New',
        navigate: '/yogas-detector',
    },
    {
        title: 'Jaimini Astrology',
        subtitle: 'Chara karakas & Chara Dasha',
        metadata: 'New',
        badge: 'New',
        navigate: '/jaimini-astrology',
    },
    {
        title: 'Dasa Details',
        subtitle: 'Drill 3 levels of Vimshottari',
        metadata: 'New',
        badge: 'New',
        fullWidth: true,
        navigate: '/dasa-details',
    },
];

const Tools = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const isMatch = (title, subtitle = '') => {
        const query = searchQuery.toLowerCase();
        return title.toLowerCase().includes(query) || subtitle.toLowerCase().includes(query);
    };

    const filteredCalculationCards = calculationCards.filter(
        (card) => isMatch(card.title, card.subtitle)
    );

    const filteredReferenceCards = referenceCards.filter(
        (card) => isMatch(card.title, card.subtitle)
    );

    const isKundliGenVisible = isMatch("Kundli Generator", "Vedic birth chart, Navamsa & planet positions");
    const isPlanetaryAvastasVisible = isMatch("Planetary Avastas", "Exalt · Debil · Retro · Combust · MoolaTrikona · Own");
    const isAstroReportVisible = isMatch("Astro Report Generator", "Create & share PDF reports with clients instantly");
    const isTransitAlertsVisible = isMatch("Transit Alerts", "Get notified on major planetary movements");

    const hasAnyResults = 
        filteredCalculationCards.length > 0 || 
        filteredReferenceCards.length > 0 ||
        isKundliGenVisible ||
        isPlanetaryAvastasVisible ||
        isAstroReportVisible ||
        isTransitAlertsVisible;

    return (
        <div className="flex justify-center items-start min-h-screen p-0 m-0 bg-gradient-to-b from-[#FFEEDE] via-[#FFF3E0] to-[#DEEBFF] md:py-10 md:px-6">
            <div className="w-full min-h-screen md:min-h-0 bg-gradient-to-b from-[#FFEEDE] via-[#FFF3E0] to-[#DEEBFF] md:bg-white/45 md:backdrop-blur-xl shadow-[0px_10px_40px_rgba(0,0,0,0.12)] md:shadow-[0px_20px_50px_rgba(0,0,0,0.08)] md:rounded-[32px] flex flex-col relative overflow-y-auto overflow-x-hidden box-border">
                <ToolsHeader
                    onBack={() => navigate('/')}
                    onPanchangClick={() => navigate('/transit-calendar')}
                    searchValue={searchQuery}
                    onSearchChange={(e) => setSearchQuery(e.target.value)}
                />

                <div className="px-4 pb-28 pt-5 sm:px-5 md:px-6 md:pt-6">
                    {!searchQuery && (
                        <>
                            <div className="mb-[15px] flex items-center justify-between">
                                <p className="text-[20px] font-[Sofia_Sans] font-semibold text-[#2A0B07]">
                                    Quick Launch
                                </p>
                            </div>
                            <div className="flex flex-row items-center justify-between gap-4 w-full">
                                {quickActions.map((action) => (
                                    <QuickLaunchCard
                                        key={action.label}
                                        label={action.label}
                                        icon={action.icon}
                                        onClick={() => {
                                            if (action.navigate) {
                                                navigate(action.navigate);
                                            } else {
                                                console.log(`${action.label} clicked`);
                                            }
                                        }}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {hasAnyResults ? (
                        <>
                            {(filteredCalculationCards.length > 0 || isKundliGenVisible) && (
                                <section className="mt-6 space-y-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <h2 className="text-[20px] font-[Sofia_Sans] font-semibold text-[#2A0B07]">
                                            Calculation & Charts
                                        </h2>
                                    </div>
                                    {isKundliGenVisible && (
                                        <ToolBannerCard
                                            title="Kundli Generator"
                                            subtitle="Vedic birth chart, Navamsa & planet positions"
                                            metadata="Used 847 times"
                                            badge="Premium"
                                            onClick={() => navigate('/kundli-generator')}
                                        />
                                    )}
                                    {filteredCalculationCards.length > 0 && (
                                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2">
                                            {filteredCalculationCards.map((card) => (
                                                <ToolCard
                                                    key={card.title}
                                                    title={card.title}
                                                    subtitle={card.subtitle}
                                                    metadata={card.metadata}
                                                    badge={card.badge}
                                                    navigate={card.navigate}
                                                    onClick={() => navigate(card.navigate)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </section>
                            )}

                            {(filteredReferenceCards.length > 0 || isPlanetaryAvastasVisible || isAstroReportVisible || isTransitAlertsVisible) && (
                                <section className="mt-6 space-y-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <h2 className="text-[20px] font-[Sofia_Sans] font-semibold text-[#2A0B07]">
                                            Reference & Guides
                                        </h2>
                                    </div>
                                    {isPlanetaryAvastasVisible && (
                                        <ToolBannerCard
                                            title="Planetary Avastas"
                                            subtitle="Exalt · Debil · Retro · Combust · MoolaTrikona · Own"
                                            metadata="Used 2.4k times"
                                            badge="Premium"
                                            onClick={() => navigate('/planetary-avastas')}
                                        />
                                    )}
                                    {filteredReferenceCards.length > 0 && (
                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                                            {filteredReferenceCards.map((card) => (
                                                <div key={card.title} className={`${card.fullWidth ? 'sm:col-span-2' : ''}`}>
                                                    <ToolCard
                                                        title={card.title}
                                                        subtitle={card.subtitle}
                                                        metadata={card.metadata}
                                                        badge={card.badge}
                                                        onClick={() => card.navigate ? navigate(card.navigate) : console.log(`${card.title} clicked`)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {isAstroReportVisible && (
                                        <ToolBannerCard
                                            title="Astro Report Generator"
                                            subtitle="Create & share PDF reports with clients instantly"
                                            badge="Premium"
                                            onClick={() => navigate('/astro-report')}
                                        />
                                    )}
                                    {isTransitAlertsVisible && (
                                        <ToolBannerCard
                                            title="Transit Alerts"
                                            subtitle="Get notified on major planetary movements"
                                            onClick={() => navigate('/transit-alerts')}
                                        />
                                    )}
                                </section>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16 text-[#2A0B07]/50 font-medium font-['Poppins']">
                            No tools found matching "{searchQuery}"
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tools;