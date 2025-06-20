import React, { useState } from 'react';

// Import utility functions
import { cn } from './utils/cn';

// Import layout components
import Sidebar from './layouts/Sidebar';

// Import page components
import LoginPage from './pages/LoginPage';
import GeneratePage from './pages/GeneratePage';
import DownloadPage from './pages/DownloadPage';

const App = () => {
    const [currentView, setCurrentView] = useState('login');

    const handleLoginSuccess = () => {
        setCurrentView('generate');
    };

    const handleTabChange = (tabName) => {
        setCurrentView(tabName);
    };

    const handleSignOut = () => {
        setCurrentView('login');
    };

    const renderView = () => {
        switch (currentView) {
            case 'login':
                return <LoginPage onLoginSuccess={handleLoginSuccess} />;
            case 'generate':
                return <GeneratePage />;
            case 'download':
                return <DownloadPage />;
            default:
                return <LoginPage onLoginSuccess={handleLoginSuccess} />;
        }
    };

    return (
        <div className="flex h-screen w-screen bg-white font-inter">
            {/* Styles are applied via index.css and tailwind.config.js */}
            {currentView !== 'login' && (
                <Sidebar
                    activeTab={currentView}
                    onTabChange={handleTabChange}
                    onSignOut={handleSignOut}
                />
            )}

            <div className={cn(
                "flex-1 flex flex-col items-center justify-start overflow-y-auto",
                currentView !== 'login' ? "ml-[72px]" : "ml-0"
            )}>
                {renderView()}
            </div>
        </div>
    );
};

export default App;