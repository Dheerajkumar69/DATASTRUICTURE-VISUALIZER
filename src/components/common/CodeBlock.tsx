import React, { lazy, Suspense } from 'react';
import styled from 'styled-components';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// Lazy load the SyntaxHighlighter for better performance
const SyntaxHighlighter = lazy(() => import('react-syntax-highlighter'));

const Container = styled.div`
  position: relative;
  border-radius: ${props => props.theme.borderRadius};
  overflow: hidden;
  font-family: ${props => props.theme.fonts.mono};
  box-shadow: ${props => props.theme.shadows.sm};
`;

const LoadingPlaceholder = styled.div`
  padding: 1rem;
  background-color: ${props => props.theme.colors.gray800};
  color: ${props => props.theme.colors.gray300};
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CodeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.colors.gray900};
  border-bottom: 1px solid ${props => props.theme.colors.gray700};
`;

const LanguageBadge = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.gray300};
  text-transform: uppercase;
`;

const CopyButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${props => props.theme.colors.gray300};
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  transition: all 0.2s;
  
  &:hover {
    color: ${props => props.theme.colors.gray100};
  }
`;

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = React.useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const languageMap: Record<string, string> = {
    javascript: 'JavaScript',
    python: 'Python',
    java: 'Java',
    cpp: 'C++',
    csharp: 'C#',
    typescript: 'TypeScript',
    go: 'Go',
    rust: 'Rust',
    swift: 'Swift',
    kotlin: 'Kotlin',
    ruby: 'Ruby',
    php: 'PHP'
  };
  
  const displayLanguage = languageMap[language.toLowerCase()] || language;
  
  return (
    <Container>
      <CodeHeader>
        <LanguageBadge>{displayLanguage}</LanguageBadge>
        <CopyButton onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </CopyButton>
      </CodeHeader>
      <Suspense fallback={<LoadingPlaceholder>Loading code...</LoadingPlaceholder>}>
        <SyntaxHighlighter
          language={language.toLowerCase()}
          style={vs2015}
          customStyle={{
            margin: 0,
            padding: '1rem',
            borderRadius: 0,
            fontSize: '0.9rem',
            lineHeight: 1.5
          }}
        >
          {code}
        </SyntaxHighlighter>
      </Suspense>
    </Container>
  );
};

export default CodeBlock; 