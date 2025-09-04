import React, { useState, ReactNode } from 'react';

interface TabsProps {
  defaultTab: string;
  children: React.ReactNode;
}

interface TabContentProps {
  label: string;
  value: string;
  children: ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ defaultTab, children }) => {
  const [active, setActive] = useState<string>(defaultTab);

  const tabChildren = React.Children.toArray(children) as React.ReactElement<TabContentProps>[];
  const labels = tabChildren.map(child => ({ label: child.props.label, value: child.props.value }));
  const activeChild = tabChildren.find(child => child.props.value === active) || tabChildren[0];

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {labels.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setActive(value)}
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid #ccc',
              background: active === value ? '#1f6feb' : 'transparent',
              color: active === value ? '#fff' : 'inherit',
              cursor: 'pointer'
            }}
            aria-pressed={active === value}
          >
            {label}
          </button>
        ))}
      </div>
      <div>
        {activeChild}
      </div>
    </div>
  );
};

export const TabContent: React.FC<TabContentProps> = ({ children }) => {
  return <>{children}</>;
};

export default Tabs;


