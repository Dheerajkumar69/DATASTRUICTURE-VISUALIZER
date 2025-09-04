import React, { forwardRef, useState, useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { FiCheck, FiChevronDown, FiX, FiInfo, FiAlertCircle, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { useAccessibility } from '../../hooks/useAccessibility';

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Base button styles
const ButtonBase = styled.button<{
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-family: inherit;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  outline: none;
  min-height: 44px;
  min-width: 44px;
  
  ${({ size = 'medium' }) => {
    const sizes = {
      small: css`
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        min-height: 36px;
      `,
      medium: css`
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        min-height: 44px;
      `,
      large: css`
        padding: 1rem 2rem;
        font-size: 1.125rem;
        min-height: 52px;
      `
    };
    return sizes[size];
  }}
  
  ${({ variant = 'primary', theme }) => {
    const variants = {
      primary: css`
        background-color: ${theme.colors.primary};
        color: ${theme.colors.card};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.primaryDark};
          transform: translateY(-1px);
        }
      `,
      secondary: css`
        background-color: ${theme.colors.gray200};
        color: ${theme.colors.text};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.gray300};
          transform: translateY(-1px);
        }
      `,
      danger: css`
        background-color: ${theme.colors.danger};
        color: ${theme.colors.card};
        &:hover:not(:disabled) {
          background-color: #dc2626;
          transform: translateY(-1px);
        }
      `,
      success: css`
        background-color: ${theme.colors.success};
        color: ${theme.colors.card};
        &:hover:not(:disabled) {
          background-color: #059669;
          transform: translateY(-1px);
        }
      `,
      outline: css`
        background-color: transparent;
        color: ${theme.colors.primary};
        border: 2px solid ${theme.colors.primary};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary};
          color: ${theme.colors.card};
          transform: translateY(-1px);
        }
      `
    };
    return variants[variant];
  }}
  
  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}
  
  ${({ disabled }) => disabled && css`
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  `}
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

// Button component
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}, ref) => {
  const { announce } = useAccessibility();
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) return;
    props.onClick?.(e);
  };

  return (
    <ButtonBase
      ref={ref}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
      onClick={handleClick}
    >
      {loading ? (
        <>
          <div className="animate-spin">⏳</div>
          Loading...
        </>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </ButtonBase>
  );
});

Button.displayName = 'Button';

// Input component
const InputWrapper = styled.div<{ hasError?: boolean }>`
  position: relative;
  width: 100%;
`;

const InputBase = styled.input<{ hasError?: boolean }>`
  width: 100%;
  min-height: 44px;
  padding: 0.75rem 1rem;
  border: 2px solid ${({ hasError, theme }) => 
    hasError ? theme.colors.danger : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: ${({ theme }) => theme.colors.gray100};
  }
`;

const InputLabel = styled.label<{ required?: boolean }>`
  display: block;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  font-size: 0.875rem;
  
  ${({ required }) => required && css`
    &::after {
      content: ' *';
      color: ${({ theme }) => theme.colors.danger};
    }
  `}
`;

const ErrorMessage = styled.div`
  margin-top: 0.25rem;
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  required,
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <InputWrapper hasError={!!error}>
      {label && (
        <InputLabel htmlFor={inputId} required={required}>
          {label}
        </InputLabel>
      )}
      <InputBase
        ref={ref}
        id={inputId}
        hasError={!!error}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        required={required}
        {...props}
      />
      {error && (
        <ErrorMessage id={`${inputId}-error`} role="alert">
          <FiAlertCircle size={16} aria-hidden="true" />
          {error}
        </ErrorMessage>
      )}
      {helperText && !error && (
        <div style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: 'var(--text-light)' }}>
          {helperText}
        </div>
      )}
    </InputWrapper>
  );
});

Input.displayName = 'Input';

// Card component
const CardBase = styled.div<{
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
  interactive?: boolean;
}>`
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: all 0.2s ease;
  
  ${({ variant = 'default', theme }) => {
    const variants = {
      default: css`
        box-shadow: ${theme.shadows.sm};
      `,
      elevated: css`
        box-shadow: ${theme.shadows.lg};
      `,
      outlined: css`
        border: 1px solid ${theme.colors.border};
        box-shadow: none;
      `
    };
    return variants[variant];
  }}
  
  ${({ padding = 'medium' }) => {
    const paddings = {
      none: css`padding: 0;`,
      small: css`padding: 1rem;`,
      medium: css`padding: 1.5rem;`,
      large: css`padding: 2rem;`
    };
    return paddings[padding];
  }}
  
  ${({ interactive }) => interactive && css`
    cursor: pointer;
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${({ theme }) => theme.shadows.lg};
    }
  `}
`;

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
  interactive?: boolean;
  children: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  variant = 'default',
  padding = 'medium',
  interactive = false,
  children,
  ...props
}, ref) => (
  <CardBase
    ref={ref}
    variant={variant}
    padding={padding}
    interactive={interactive}
    {...props}
  >
    {children}
  </CardBase>
));

Card.displayName = 'Card';

// Modal component
const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: opacity 0.3s ease;
  opacity: ${({ isOpen }) => isOpen ? 1 : 0};
  visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
`;

const ModalContent = styled.div<{ size?: 'small' | 'medium' | 'large' }>`
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  animation: ${fadeIn} 0.3s ease;
  max-height: 90vh;
  overflow-y: auto;
  margin: 1rem;
  
  ${({ size = 'medium' }) => {
    const sizes = {
      small: css`
        max-width: 400px;
        width: 100%;
      `,
      medium: css`
        max-width: 600px;
        width: 100%;
      `,
      large: css`
        max-width: 800px;
        width: 100%;
      `
    };
    return sizes[size];
  }}
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.5rem;
  font-weight: 600;
`;

const ModalCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.textLight};
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray200};
    color: ${({ theme }) => theme.colors.text};
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOverlayClick?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'medium',
  children,
  footer,
  closeOnOverlayClick = true
}) => {
  const { trapFocus, restoreFocus } = useAccessibility();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      if (modalRef.current) {
        const cleanup = trapFocus(modalRef.current);
        return cleanup;
      }
    } else {
      restoreFocus(previousFocusRef.current);
    }
  }, [isOpen, trapFocus, restoreFocus]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay 
      isOpen={isOpen}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <ModalContent ref={modalRef} size={size}>
        {title && (
          <ModalHeader>
            <ModalTitle id="modal-title">{title}</ModalTitle>
            <ModalCloseButton onClick={onClose} aria-label="Close modal">
              <FiX size={20} />
            </ModalCloseButton>
          </ModalHeader>
        )}
        
        <ModalBody>
          {children}
        </ModalBody>
        
        {footer && (
          <ModalFooter>
            {footer}
          </ModalFooter>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

// Toast notification system
const ToastContainer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 400px;
  width: 100%;
`;

const ToastBase = styled.div<{
  variant?: 'info' | 'success' | 'warning' | 'error';
}>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border-left: 4px solid;
  animation: ${slideIn} 0.3s ease;
  
  ${({ variant = 'info', theme }) => {
    const variants = {
      info: css`border-left-color: ${theme.colors.info};`,
      success: css`border-left-color: ${theme.colors.success};`,
      warning: css`border-left-color: ${theme.colors.warning};`,
      error: css`border-left-color: ${theme.colors.danger};`
    };
    return variants[variant];
  }}
`;

const ToastIcon = styled.div<{ variant?: 'info' | 'success' | 'warning' | 'error' }>`
  flex-shrink: 0;
  ${({ variant = 'info', theme }) => {
    const variants = {
      info: css`color: ${theme.colors.info};`,
      success: css`color: ${theme.colors.success};`,
      warning: css`color: ${theme.colors.warning};`,
      error: css`color: ${theme.colors.danger};`
    };
    return variants[variant];
  }}
`;

const ToastContent = styled.div`
  flex: 1;
  color: ${({ theme }) => theme.colors.text};
`;

const ToastCloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray200};
  }
`;

export interface ToastProps {
  id: string;
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  message,
  variant = 'info',
  duration = 5000,
  onClose
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const getIcon = () => {
    const icons = {
      info: <FiInfo size={20} />,
      success: <FiCheckCircle size={20} />,
      warning: <FiAlertTriangle size={20} />,
      error: <FiAlertCircle size={20} />
    };
    return icons[variant];
  };

  return (
    <ToastBase variant={variant} role="alert" aria-live="polite">
      <ToastIcon variant={variant}>
        {getIcon()}
      </ToastIcon>
      <ToastContent>{message}</ToastContent>
      <ToastCloseButton onClick={() => onClose(id)} aria-label="Close notification">
        <FiX size={16} />
      </ToastCloseButton>
    </ToastBase>
  );
};

// Toast context and hook
const ToastContext = React.createContext<{
  addToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => void;
  removeToast: (id: string) => void;
}>({
  addToast: () => {},
  removeToast: () => {}
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id, onClose: removeToast }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer>
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
