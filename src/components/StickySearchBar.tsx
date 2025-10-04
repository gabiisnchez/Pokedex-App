import { SearchBar } from './SearchBar';
import { motion, AnimatePresence } from 'motion/react';
import { useScrollThreshold } from '../hooks/useScrollThreshold';
import { ReactNode } from 'react';

interface StickySearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  threshold?: number;
  filterButton?: ReactNode;
}

export function StickySearchBar({ 
  searchTerm, 
  onSearchChange, 
  viewMode, 
  onViewModeChange,
  threshold = 200,
  filterButton
}: StickySearchBarProps) {
  const isSticky = useScrollThreshold(threshold);

  return (
    <AnimatePresence>
      {isSticky && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ 
            duration: 0.3, 
            ease: [0.4, 0, 0.2, 1] 
          }}
          className="fixed top-0 left-0 right-0 z-50 shadow-md"
        >
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
            isSticky={true}
            filterButton={filterButton}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
