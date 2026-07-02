export default function BottomNavbar({ activeTab = 'home' }) {
    const tabs = [
        { id: 'home', label: 'Home', icon: '🏠', href: '/' },
        { id: 'services', label: 'Services', icon: '⭐', href: '/services' },
        { id: 'chats', label: 'Chats', icon: '💬', href: '/chats' },
        { id: 'wallet', label: 'Wallet', icon: '💰', href: '/wallet' },
        { id: 'profile', label: 'Profile', icon: '👤', href: '/profile' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 w-full max-w-[430px] mx-auto bg-white border-t border-[#E0E0E0] shadow-[0px_-4px_20px_rgba(0,0,0,0.1)]">
            <div className="flex justify-around items-center h-20 px-2">
                {tabs.map((tab) => (
                    <a
                        key={tab.id}
                        href={tab.href}
                        className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-200 ${activeTab === tab.id
                                ? 'text-[#2A0B07]'
                                : 'text-[#999999] hover:text-[#666666]'
                            }`}
                    >
                        <span className="text-2xl">{tab.icon}</span>
                        <span className="text-xs font-medium">{tab.label}</span>
                    </a>
                ))}
            </div>
        </nav>
    );
}
