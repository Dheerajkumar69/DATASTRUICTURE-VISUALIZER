import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.foreground};
    font-family: ${({ theme }) => theme.fonts.sans};
    transition: all 0.3s ease-in-out;
  }

  * {
    box-sizing: border-box;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
    padding: 0;
  }

  input, button, textarea, select {
    font: inherit;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
  }
  
  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
  }
  
  /* Custom scrollbar styling that respects the theme */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.gray100};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray400};
    border-radius: 4px;
    transition: background-color 0.2s ease;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.gray500};
  }
  
  /* Fix scrollbar for Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colors.gray400} ${({ theme }) => theme.colors.gray100};
  }
  
  /* Handle selection colors */
  ::selection {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.card};
  }
  
  ::-moz-selection {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.card};
  }

  /* Accessible focus outlines */
  a:focus-visible,
  button:focus-visible,
  [role="button"]:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export default GlobalStyle; 