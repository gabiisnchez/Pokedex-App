import { Badge } from "./ui/badge";
import { typeTranslations } from "../utils/translations";

interface PokemonListItemProps {
  name: string;
  id: number;
  image: string;
  types: string[];
  onClick: () => void;
}

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

export function PokemonListItem({ name, id, image, types, onClick }: PokemonListItemProps) {
  return (
    <div 
      className="flex items-center gap-4 p-3 border rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-200 bg-card"
      onClick={onClick}
    >
      <div className="w-16 h-16 flex-shrink-0">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-contain"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-muted-foreground">#{id.toString().padStart(3, '0')}</span>
          <h3 className="capitalize truncate">{name}</h3>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {types.map((type) => (
            <Badge 
              key={type} 
              className={`${typeColors[type]} text-white border-0 text-xs`}
            >
              {typeTranslations[type] || type}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
