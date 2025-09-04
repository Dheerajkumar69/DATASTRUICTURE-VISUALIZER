import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    
    ${({ theme }) => theme.media.tablet} {
      font-size: 15px;
    }

    ${({ theme }) => theme.media.mobile} {
      font-size: 14px;
    }
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.6;
    overflow-x: hidden;
    
    /* Prevent zoom on iOS */
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  a {
    text-decoration: none;
    color: inherit;
    -webkit-tap-highlight-color: transparent;
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    
    &:focus {
      outline: 2px solid ${({ theme }) => theme.colors.primary};
      outline-offset: 2px;
    }
  }

  ul, ol {
    list-style: none;
  }

  input, textarea {
    font-family: inherit;
    border: none;
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    
    &:focus {
      outline: 2px solid ${({ theme }) => theme.colors.primary};
      outline-offset: 2px;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
  }

  h1 {
    ${({ theme }) => theme.media.mobile} {
      font-size: 1.75rem;
    }
  }

  h2 {
    ${({ theme }) => theme.media.mobile} {
      font-size: 1.5rem;
    }
  }

  h3 {
    ${({ theme }) => theme.media.mobile} {
      font-size: 1.25rem;
    }
  }

  p {
    margin-bottom: 1rem;
  }

  /* Touch-friendly tap targets */
  button, a, [role="button"] {
    min-height: 44px;
    min-width: 44px;
    
    ${({ theme }) => theme.media.mobile} {
      min-height: 48px;
      min-width: 48px;
    }
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    
    ${({ theme }) => theme.media.mobile} {
      width: 4px;
    }
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.gray100};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray300};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.gray400};
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Focus styles for accessibility */
  *:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  /* Remove focus outline for mouse users */
  .js-focus-visible *:focus:not(.focus-visible) {
    outline: none;
  }
`;

export default GlobalStyle;