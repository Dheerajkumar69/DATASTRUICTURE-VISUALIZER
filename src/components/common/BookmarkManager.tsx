import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface Bookmark {
  id: string;
  name: string;
  algorithm: string;
  configuration: any;
  timestamp: number;
  description?: string;
  tags?: string[];
}

interface BookmarkManagerProps {
  currentConfiguration: any;
  algorithmName: string;
  onLoadBookmark: (configuration: any) => void;
  className?: string;
}

const BookmarkContainer = styled(motion.div)`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const BookmarkHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  gap: 1rem;
`;

const BookmarkTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BookmarkButton = styled(motion.button)<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary};
          color: ${({ theme }) => theme.colors.card};
          &:hover {
            background: ${theme.colors.primaryDark};
          }
        `;
      case 'danger':
        return `
          background: ${theme.colors.error};
          color: ${({ theme }) => theme.colors.card};
          &:hover {
            background: ${theme.colors.error}dd;
          }
        `;
      default:
        return `
          background: ${theme.colors.gray200};
          color: ${theme.colors.text};
          &:hover {
            background: ${theme.colors.gray300};
          }
        `;
    }
  }}
`;

const BookmarkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
`;

const BookmarkItem = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  gap: 1rem;
`;

const BookmarkInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const BookmarkName = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BookmarkMeta = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BookmarkTags = styled.div`
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
`;

const BookmarkTag = styled.span`
  background: ${({ theme }) => theme.colors.primary}33;
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const BookmarkActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SaveDialog = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.xl};
  z-index: 1000;
  width: 90%;
  max-width: 400px;
`;

const DialogOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
`;

const DialogTitle = styled.h4`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin: 0 0 1rem 0;
`;

const DialogInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const DialogTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: 1rem;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const DialogActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const EmptyState = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  padding: 2rem;
`;

const BookmarkManager: React.FC<BookmarkManagerProps> = ({
  currentConfiguration,
  algorithmName,
  onLoadBookmark,
  className
}) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [bookmarkName, setBookmarkName] = useState('');
  const [bookmarkDescription, setBookmarkDescription] = useState('');
  const [bookmarkTags, setBookmarkTags] = useState('');

  // Load bookmarks from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('algorithm-bookmarks');
    if (stored) {
      try {
        setBookmarks(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load bookmarks:', error);
      }
    }
  }, []);

  // Save bookmarks to localStorage
  const saveBookmarks = useCallback((newBookmarks: Bookmark[]) => {
    try {
      localStorage.setItem('algorithm-bookmarks', JSON.stringify(newBookmarks));
      setBookmarks(newBookmarks);
    } catch (error) {
      console.error('Failed to save bookmarks:', error);
    }
  }, []);

  const handleSaveBookmark = () => {
    if (!bookmarkName.trim()) return;

    const newBookmark: Bookmark = {
      id: `bookmark-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: bookmarkName.trim(),
      algorithm: algorithmName,
      configuration: JSON.parse(JSON.stringify(currentConfiguration)),
      timestamp: Date.now(),
      description: bookmarkDescription.trim() || undefined,
      tags: bookmarkTags.split(',').map(tag => tag.trim()).filter(Boolean) || undefined
    };

    const newBookmarks = [newBookmark, ...bookmarks];
    saveBookmarks(newBookmarks);

    // Reset form
    setBookmarkName('');
    setBookmarkDescription('');
    setBookmarkTags('');
    setShowSaveDialog(false);
  };

  const handleLoadBookmark = (bookmark: Bookmark) => {
    onLoadBookmark(bookmark.configuration);
  };

  const handleDeleteBookmark = (bookmarkId: string) => {
    const newBookmarks = bookmarks.filter(b => b.id !== bookmarkId);
    saveBookmarks(newBookmarks);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const algorithmBookmarks = bookmarks.filter(b => b.algorithm === algorithmName);

  return (
    <>
      <BookmarkContainer className={className}>
        <BookmarkHeader>
          <BookmarkTitle>
            🔖 Bookmarks
          </BookmarkTitle>
          <BookmarkButton
            $variant="primary"
            onClick={() => setShowSaveDialog(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ➕ Save Current
          </BookmarkButton>
        </BookmarkHeader>

        <BookmarkList>
          {algorithmBookmarks.length === 0 ? (
            <EmptyState>
              No bookmarks saved for {algorithmName}.
              <br />
              Save your current configuration to get started!
            </EmptyState>
          ) : (
            algorithmBookmarks.map(bookmark => (
              <BookmarkItem
                key={bookmark.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                layout
              >
                <BookmarkInfo>
                  <BookmarkName>{bookmark.name}</BookmarkName>
                  <BookmarkMeta>
                    <span>{formatDate(bookmark.timestamp)}</span>
                    {bookmark.description && (
                      <span>• {bookmark.description}</span>
                    )}
                  </BookmarkMeta>
                  {bookmark.tags && bookmark.tags.length > 0 && (
                    <BookmarkTags>
                      {bookmark.tags.map(tag => (
                        <BookmarkTag key={tag}>{tag}</BookmarkTag>
                      ))}
                    </BookmarkTags>
                  )}
                </BookmarkInfo>
                
                <BookmarkActions>
                  <BookmarkButton
                    $variant="primary"
                    onClick={() => handleLoadBookmark(bookmark)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    title="Load this bookmark"
                  >
                    📂
                  </BookmarkButton>
                  <BookmarkButton
                    $variant="danger"
                    onClick={() => handleDeleteBookmark(bookmark.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    title="Delete this bookmark"
                  >
                    🗑️
                  </BookmarkButton>
                </BookmarkActions>
              </BookmarkItem>
            ))
          )}
        </BookmarkList>
      </BookmarkContainer>

      {/* Save Dialog */}
      <AnimatePresence>
        {showSaveDialog && (
          <>
            <DialogOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSaveDialog(false)}
            />
            <SaveDialog
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
            >
              <DialogTitle>Save Bookmark</DialogTitle>
              
              <DialogInput
                type="text"
                placeholder="Bookmark name *"
                value={bookmarkName}
                onChange={(e) => setBookmarkName(e.target.value)}
                autoFocus
              />
              
              <DialogTextarea
                placeholder="Description (optional)"
                value={bookmarkDescription}
                onChange={(e) => setBookmarkDescription(e.target.value)}
              />
              
              <DialogInput
                type="text"
                placeholder="Tags (comma separated)"
                value={bookmarkTags}
                onChange={(e) => setBookmarkTags(e.target.value)}
              />
              
              <DialogActions>
                <BookmarkButton
                  onClick={() => setShowSaveDialog(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </BookmarkButton>
                <BookmarkButton
                  $variant="primary"
                  onClick={handleSaveBookmark}
                  disabled={!bookmarkName.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Save
                </BookmarkButton>
              </DialogActions>
            </SaveDialog>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default BookmarkManager;
