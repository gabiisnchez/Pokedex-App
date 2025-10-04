import { Grid3x3, List } from "lucide-react";
import { motion } from "motion/react";

interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="flex items-center justify-center">
      {/* View Mode Toggle */}
      <div className="flex items-center gap-1 bg-muted rounded-md p-0.5 h-9">
        <button
          onClick={() => onViewModeChange('grid')}
          className={`
            flex items-center gap-1.5 px-2.5 py-1 rounded-sm transition-all relative h-8
            ${viewMode === 'grid' 
              ? 'text-primary-foreground' 
              : 'text-muted-foreground hover:text-foreground'
            }
          `}
          aria-label="Vista de cuadrícula"
        >
          {viewMode === 'grid' && (
            <motion.div
              layoutId="viewMode"
              className="absolute inset-0 bg-primary rounded-sm"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <Grid3x3 size={16} className="relative z-10" />
          <span className="relative z-10">Cuadrícula</span>
        </button>
        
        <button
          onClick={() => onViewModeChange('list')}
          className={`
            flex items-center gap-1.5 px-2.5 py-1 rounded-sm transition-all relative h-8
            ${viewMode === 'list' 
              ? 'text-primary-foreground' 
              : 'text-muted-foreground hover:text-foreground'
            }
          `}
          aria-label="Vista de lista"
        >
          {viewMode === 'list' && (
            <motion.div
              layoutId="viewMode"
              className="absolute inset-0 bg-primary rounded-sm"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <List size={16} className="relative z-10" />
          <span className="relative z-10">Lista</span>
        </button>
      </div>
    </div>
  );
}
