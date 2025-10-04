import { Input } from './ui/input';
import { ViewToggle } from './ViewToggle';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ReactNode } from 'react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  isSticky?: boolean;
  filterButton?: ReactNode;
}

export function SearchBar({ 
  searchTerm, 
  onSearchChange, 
  viewMode, 
  onViewModeChange,
  isSticky = false,
  filterButton
}: SearchBarProps) {
  return (
    <div className={`${isSticky ? 'bg-background/80 backdrop-blur-md border-b border-border py-4' : ''}`}>
      <div className={`${isSticky ? 'max-w-7xl mx-auto px-8' : ''}`}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md mx-auto md:mx-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type="text"
              placeholder="Buscar Pokémon"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-10"
            />

            {/* Clear button */}
            <AnimatePresence>
              {searchTerm && (
                <motion.button
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-700 text-white rounded-md p-1.5 transition-colors shadow-sm"
                  aria-label="Limpiar búsqueda"
                >
                  <X size={16} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2 justify-center md:justify-end">
            <ViewToggle 
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
            />
            {filterButton}
          </div>
        </div>
      </div>
    </div>
  );
}
