import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { vs2015, github } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export const getSyntaxHighlighterStyle = (isDarkMode: boolean) => {
  return isDarkMode ? vs2015 : github;
};

export const getPrismStyle = (isDarkMode: boolean) => {
  return isDarkMode ? tomorrow : {
    'code[class*="language-"]': {
      color: '#333',
      background: 'none',
      textShadow: '0 1px white',
      fontFamily: '"Consolas", "Monaco", "Andale Mono", "Ubuntu Mono", monospace',
      fontSize: '1em',
      textAlign: 'left',
      whiteSpace: 'pre',
      wordSpacing: 'normal',
      wordBreak: 'normal',
      wordWrap: 'normal',
      lineHeight: '1.5',
      MozTabSize: '4',
      OTabSize: '4',
      tabSize: '4',
      WebkitHyphens: 'none',
      MozHyphens: 'none',
      msHyphens: 'none',
      hyphens: 'none'
    },
    'pre[class*="language-"]': {
      color: '#333',
      background: '#f5f2f0',
      textShadow: '0 1px white',
      fontFamily: '"Consolas", "Monaco", "Andale Mono", "Ubuntu Mono", monospace',
      fontSize: '1em',
      textAlign: 'left',
      whiteSpace: 'pre',
      wordSpacing: 'normal',
      wordBreak: 'normal',
      wordWrap: 'normal',
      lineHeight: '1.5',
      MozTabSize: '4',
      OTabSize: '4',
      tabSize: '4',
      WebkitHyphens: 'none',
      MozHyphens: 'none',
      msHyphens: 'none',
      hyphens: 'none',
      padding: '1em',
      margin: '.5em 0',
      overflow: 'auto',
      borderRadius: '0.3em'
    },
    ':not(pre) > code[class*="language-"]': {
      background: '#f5f2f0',
      padding: '.1em',
      borderRadius: '.3em',
      whiteSpace: 'normal'
    },
    comment: {
      color: 'slategray'
    },
    prolog: {
      color: 'slategray'
    },
    doctype: {
      color: 'slategray'
    },
    cdata: {
      color: 'slategray'
    },
    punctuation: {
      color: '#999'
    },
    namespace: {
      Opacity: '.7'
    },
    property: {
      color: '#905'
    },
    tag: {
      color: '#905'
    },
    boolean: {
      color: '#905'
    },
    number: {
      color: '#905'
    },
    constant: {
      color: '#905'
    },
    symbol: {
      color: '#905'
    },
    deleted: {
      color: '#905'
    },
    selector: {
      color: '#690'
    },
    'attr-name': {
      color: '#690'
    },
    string: {
      color: '#690'
    },
    char: {
      color: '#690'
    },
    builtin: {
      color: '#690'
    },
    inserted: {
      color: '#690'
    },
    operator: {
      color: '#9a6e3a'
    },
    entity: {
      color: '#9a6e3a',
      cursor: 'help'
    },
    url: {
      color: '#9a6e3a'
    },
    variable: {
      color: '#9a6e3a'
    },
    atrule: {
      color: '#07a'
    },
    'attr-value': {
      color: '#07a'
    },
    function: {
      color: '#DD4A68'
    },
    'class-name': {
      color: '#DD4A68'
    },
    keyword: {
      color: '#07a'
    },
    regex: {
      color: '#e90'
    },
    important: {
      color: '#e90',
      fontWeight: 'bold'
    },
    bold: {
      fontWeight: 'bold'
    },
    italic: {
      fontStyle: 'italic'
    }
  };
};

export const getCustomSyntaxStyle = (isDarkMode: boolean) => {
  return {
    margin: 0,
    padding: '1rem',
    borderRadius: 0,
    fontSize: '0.9rem',
    lineHeight: 1.5,
    backgroundColor: isDarkMode ? '#2d3748' : '#f7fafc',
    color: isDarkMode ? '#e2e8f0' : '#2d3748'
  };
};
