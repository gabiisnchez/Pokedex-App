import { Badge } from "./ui/badge";
import { typeTranslations } from "../utils/translations";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TypeFilterProps {
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
  onClearFilters: () => void;
}

const allTypes = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

const typeColors: { [key: string]: string } = {
  normal: "bg-gray-400",
  fire: "bg-orange-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-cyan-400",
  fighting: "bg-red-600",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-yellow-700",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-600",
  dark: "bg-gray-700",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
};

export function TypeFilter({ selectedTypes, onTypeToggle, onClearFilters }: TypeFilterProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-muted-foreground">Filtrar por tipo:</h3>
        <AnimatePresence>
          {selectedTypes.length > 0 && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={onClearFilters}
              className="bg-black dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-700 text-white rounded-md px-3 py-1.5 transition-colors shadow-sm flex items-center gap-2"
              aria-label="Limpiar filtros"
            >
              <X size={16} />
              <span>Limpiar filtros</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        {allTypes.map((type) => {
          const isSelected = selectedTypes.includes(type);
          return (
            <Badge
              key={type}
              onClick={() => onTypeToggle(type)}
              className={`
                cursor-pointer transition-all
                ${typeColors[type]} 
                ${isSelected 
                  ? 'text-white border-2 border-white ring-2 ring-offset-2 ring-offset-background scale-110' 
                  : 'text-white/70 opacity-60 hover:opacity-100 border-0'
                }
              `}
            >
              {typeTranslations[type] || type}
            </Badge>
          );
        })}
      </div>
      
      {selectedTypes.length > 0 && (
        <p className="text-center text-muted-foreground mt-3">
          {selectedTypes.length} tipo{selectedTypes.length !== 1 ? 's' : ''} seleccionado{selectedTypes.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
