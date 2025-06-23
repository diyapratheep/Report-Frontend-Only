import React from 'react';
import { cn } from '../utils/cn';
import {ReactComponent as ReportIcon} from '../assets/icons/report.svg'; // Importing the report icon as a React component }
// Import icons as React components from their new dedicated files

import { ReactComponent as UserIcon } from '../assets/icons/user.svg';
import { ReactComponent as SettingsIcon } from '../assets/icons/settings.svg';
import { ReactComponent as DownloadIcon } from '../assets/icons/download.svg'; // Example icon, adjust path as necessary

const Sidebar = ({ activeTab, onTabChange, onSignOut }) => {
    return (
        <aside className="fixed left-0 top-0 h-full w-[72px] bg-sidebarBg border-r border-gray-100 flex flex-col justify-between py-6 z-20">
            <div className="flex flex-col w-full items-center">
                <div
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 py-1.5 w-full cursor-pointer",
                        activeTab === 'generate' ? "bg-sidebarActiveBg" : "hover:bg-gray-100"
                    )}
                    onClick={() => onTabChange('generate')}
                >
                    <div className="flex w-14 h-8 items-center justify-center py-1">
                        <ReportIcon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="text-center text-xs font-medium tracking-[0.5px] text-textMuted">
                        Generate
                    </div>
                </div>

                <div
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 py-1.5 w-full cursor-pointer",
                        activeTab === 'download' ? "bg-sidebarActiveBg" : "hover:bg-gray-100"
                    )}
                    onClick={() => onTabChange('download')}
                >
                    <div className="flex w-14 h-8 items-center justify-center py-1">
                        <DownloadIcon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="text-center text-xs font-medium tracking-[0.5px] text-textMuted">
                        Download
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-6">
                <div
                    className="flex w-12 h-12 items-center justify-center cursor-pointer hover:bg-gray-100 rounded-full"
                    onClick={onSignOut}
                >
                    <UserIcon className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex w-12 h-12 items-center justify-center cursor-pointer hover:bg-gray-100 rounded-full">
                    <SettingsIcon className="w-6 h-6 text-gray-600" />
                </div>
            </div>
        </aside>
    );
};

Sidebar.displayName = "Sidebar";

export default Sidebar;