import React, { useState, ReactNode } from 'react';
import styled from 'styled-components';

interface TabProps {
  active: boolean;
}

const TabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TabHeader = styled.div`
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const Tab = styled.button<TabProps>`
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.textLight};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
`;

const TabContentContainer = styled.div`
  padding: 1rem 0;
`;

interface TabsProps {
  defaultTab: string;
  children: ReactNode;
}

interface TabContentProps {
  label: string;
  value: string;
  children: ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ defaultTab, children }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  // Extract tab labels and content
  const tabs: { label: string; value: string; content: ReactNode }[] = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement<TabContentProps>(child) && child.type === TabContent) {
      tabs.push({
        label: child.props.label,
        value: child.props.value,
        content: child.props.children
      });
    }
  });
  
  return (
    <TabsContainer>
      <TabHeader>
        {tabs.map(tab => (
          <Tab
            key={tab.value}
            active={activeTab === tab.value}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </Tab>
        ))}
      </TabHeader>
      <TabContentContainer>
        {tabs.find(tab => tab.value === activeTab)?.content}
      </TabContentContainer>
    </TabsContainer>
  );
};

export const TabContent: React.FC<TabContentProps> = ({ children }) => {
  return <>{children}</>;
}; 