import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { motion } from 'motion/react';

interface Generation {
  number: number;
  name: string;
  range: { start: number; end: number };
}

const generations: Generation[] = [
  { number: 1, name: 'Kanto', range: { start: 1, end: 151 } },
  { number: 2, name: 'Johto', range: { start: 152, end: 251 } },
  { number: 3, name: 'Hoenn', range: { start: 252, end: 386 } },
  { number: 4, name: 'Sinnoh', range: { start: 387, end: 493 } },
  { number: 5, name: 'Teselia', range: { start: 494, end: 649 } },
  { number: 6, name: 'Kalos', range: { start: 650, end: 721 } },
  { number: 7, name: 'Alola', range: { start: 722, end: 809 } },
  { number: 8, name: 'Galar', range: { start: 810, end: 905 } },
  { number: 9, name: 'Paldea', range: { start: 906, end: 1025 } },
];

interface GenerationFilterProps {
  selectedGenerations: number[];
  onGenerationToggle: (generation: number) => void;
  onClearFilters: () => void;
}

export function GenerationFilter({ 
  selectedGenerations, 
  onGenerationToggle,
  onClearFilters 
}: GenerationFilterProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-muted-foreground">Filtrar por Generación</h3>
        {selectedGenerations.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 px-2 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Limpiar
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {generations.map((gen, index) => {
          const isSelected = selectedGenerations.includes(gen.number);
          
          return (
            <motion.div
              key={gen.number}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
            >
              <Badge
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  isSelected 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-secondary'
                }`}
                onClick={() => onGenerationToggle(gen.number)}
              >
                Gen {gen.number} - {gen.name}
              </Badge>
            </motion.div>
          );
        })}
      </div>
      
      {selectedGenerations.length > 0 && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-muted-foreground mt-3"
        >
          {selectedGenerations.length} generación{selectedGenerations.length !== 1 ? 'es' : ''} seleccionada{selectedGenerations.length !== 1 ? 's' : ''}
        </motion.p>
      )}
    </div>
  );
}

// Export generations data for use in filtering logic
export { generations };
