import React from 'react';

interface TabOption {
    key: string;
    label: string;
}

interface CustomTabsProps {
    tabs: TabOption[];
    activeTab: string;
    onTabChange: any;
}

const CustomTabs: React.FC<CustomTabsProps> = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="flex mb-6">
            {tabs.map((tab, index) => {
                const isFirst = index === 0;
                const isLast = index === tabs.length - 1;
                const isActive = activeTab === tab.key;

                const baseStyle = 'px-4 py-2 cursor-pointer transition';
                const activeStyle = isActive ? 'bg-slate-500 text-white' : 'bg-gray-100 hover:bg-gray-200';
                const roundedStyle = isFirst
                    ? 'rounded-l-lg'
                    : isLast
                        ? 'rounded-r-lg'
                        : '';

                return (
                    <button
                        key={tab.key}
                        className={`${baseStyle} ${activeStyle} ${roundedStyle}`}
                        onClick={() => onTabChange(tab.key)}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
};

export default CustomTabs;
