import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareButtonProps {
  title?: string;
  description?: string;
  url?: string;
  hashtags?: string[];
  className?: string;
}

interface ShareOption {
  name: string;
  icon: string;
  color: string;
  share: (data: ShareData) => void;
}

interface ShareData {
  title: string;
  description: string;
  url: string;
  hashtags: string[];
}

const ShareContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ShareMainButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.card};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const ShareDropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  min-width: 200px;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: 1000;
  overflow: hidden;
`;

const ShareOption = styled(motion.button)<{ $color: string }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background: ${({ $color }) => $color}22;
    color: ${({ $color }) => $color};
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const ShareIcon = styled.span<{ $color: string }>`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color};
  font-size: 1rem;
`;

const ShareText = styled.span`
  flex: 1;
  text-align: left;
`;

const CopyFeedback = styled(motion.div)`
  position: absolute;
  top: -2.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.card};
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  white-space: nowrap;
  z-index: 1001;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: ${({ theme }) => theme.colors.success};
  }
`;

const ShareButton: React.FC<ShareButtonProps> = ({
  title = 'Data Structure Visualizer',
  description = 'Interactive algorithm visualization and learning platform',
  url = window.location.href,
  hashtags = ['DataStructures', 'Algorithms', 'Programming', 'Learning'],
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);

  const shareData: ShareData = {
    title,
    description,
    url,
    hashtags
  };

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowCopyFeedback(true);
      setTimeout(() => setShowCopyFeedback(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowCopyFeedback(true);
      setTimeout(() => setShowCopyFeedback(false), 2000);
    }
  }, []);

  const shareOptions: ShareOption[] = [
    {
      name: 'Twitter',
      icon: '🐦',
      color: '#1DA1F2',
      share: (data) => {
        const text = `${data.title} - ${data.description}`;
        const hashtagString = data.hashtags.map(tag => `#${tag}`).join(' ');
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(data.url)}&hashtags=${encodeURIComponent(data.hashtags.join(','))}`;
        window.open(tweetUrl, '_blank');
      }
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      color: '#0077B5',
      share: (data) => {
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}`;
        window.open(linkedInUrl, '_blank');
      }
    },
    {
      name: 'Facebook',
      icon: '📘',
      color: '#1877F2',
      share: (data) => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}&quote=${encodeURIComponent(data.title + ' - ' + data.description)}`;
        window.open(facebookUrl, '_blank');
      }
    },
    {
      name: 'Reddit',
      icon: '🔗',
      color: '#FF4500',
      share: (data) => {
        const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(data.url)}&title=${encodeURIComponent(data.title)}`;
        window.open(redditUrl, '_blank');
      }
    },
    {
      name: 'Copy Link',
      icon: '📋',
      color: '#6366F1',
      share: (data) => {
        copyToClipboard(data.url);
        setIsOpen(false);
      }
    },
    {
      name: 'Share Text',
      icon: '📝',
      color: '#10B981',
      share: (data) => {
        const shareText = `Check out ${data.title}!\n\n${data.description}\n\n${data.url}\n\n${data.hashtags.map(tag => `#${tag}`).join(' ')}`;
        copyToClipboard(shareText);
        setIsOpen(false);
      }
    }
  ];

  // Handle native Web Share API if available
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.description,
          url: shareData.url
        });
      } catch (error) {
        console.log('Native sharing failed or was cancelled');
      }
    }
  };

  // Check if Web Share API is available
  const hasNativeShare = navigator.share && navigator.canShare;

  const handleMainButtonClick = () => {
    if (hasNativeShare) {
      handleNativeShare();
    } else {
      setIsOpen(!isOpen);
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !event.defaultPrevented) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <ShareContainer className={className}>
      <ShareMainButton
        onClick={handleMainButtonClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        🚀 Share
      </ShareMainButton>

      <AnimatePresence>
        {showCopyFeedback && (
          <CopyFeedback
            initial={{ opacity: 0, scale: 0.8, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 5 }}
          >
            ✅ Copied!
          </CopyFeedback>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && !hasNativeShare && (
          <ShareDropdown
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {shareOptions.map((option) => (
              <ShareOption
                key={option.name}
                $color={option.color}
                onClick={(e) => {
                  e.preventDefault();
                  option.share(shareData);
                  if (option.name !== 'Copy Link' && option.name !== 'Share Text') {
                    setIsOpen(false);
                  }
                }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <ShareIcon $color={option.color}>
                  {option.icon}
                </ShareIcon>
                <ShareText>{option.name}</ShareText>
              </ShareOption>
            ))}
          </ShareDropdown>
        )}
      </AnimatePresence>
    </ShareContainer>
  );
};

export default ShareButton;

// Hook for generating shareable content
export const useShareContent = (algorithmName: string, configuration?: any) => {
  return React.useMemo(() => {
    const baseTitle = 'Data Structure Visualizer';
    const title = algorithmName ? `${algorithmName} - ${baseTitle}` : baseTitle;
    
    const baseDescription = 'Interactive algorithm visualization and learning platform';
    const description = algorithmName 
      ? `Learn ${algorithmName} through interactive visualization - ${baseDescription}`
      : baseDescription;

    const hashtags = ['DataStructures', 'Algorithms', 'Programming', 'Learning'];
    if (algorithmName) {
      // Clean algorithm name for hashtag
      const algorithmTag = algorithmName.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
      if (algorithmTag) {
        hashtags.unshift(algorithmTag);
      }
    }

    return {
      title,
      description,
      hashtags,
      url: window.location.href
    };
  }, [algorithmName, configuration]);
};
