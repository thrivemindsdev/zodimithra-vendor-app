import { useLocation } from 'react-router-dom';
import Footer from '../components/common/Footer';

export default function MainLayout({ children }) {
    const location = useLocation();
    const bottomNavPaths = ['/', '/messages', '/live', '/tools', '/profile'];
    const hideFooter = !bottomNavPaths.includes(location.pathname);

    return (
        <div className="flex justify-center items-start min-h-screen p-0 m-0 bg-gradient-to-b from-[#FFEEDE] via-[#FFF3E0] to-[#DEEBFF]">
            <div className="w-full min-h-screen bg-gradient-to-b from-[#FFEEDE] via-[#FFF3E0] to-[#DEEBFF] shadow-[0px_10px_40px_rgba(0,0,0,0.12)] flex flex-col relative overflow-y-auto overflow-x-hidden">
                {children}
            </div>
            {!hideFooter && <Footer />}
        </div>
    );
}
