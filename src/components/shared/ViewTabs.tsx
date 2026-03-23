import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: string;
}

interface ViewTabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export function ViewTabs({ tabs, activeTab, onChange }: ViewTabsProps) {
  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border -mx-3 sm:-mx-6 md:-mx-10 lg:-mx-14 px-3 sm:px-6 md:px-10 lg:px-14 mb-5">
      <div className="flex gap-0 overflow-x-auto scrollbar-hide py-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-3 sm:px-4 py-2.5 text-[10px] sm:text-[11px] font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 border-b-2 ${
              activeTab === tab.id
                ? 'border-b-primary text-foreground bg-card/50'
                : 'border-b-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/30'
            }`}
          >
            {tab.icon && <span className="text-sm">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
