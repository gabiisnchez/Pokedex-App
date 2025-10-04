import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { typeTranslations } from "../utils/translations";

interface PokemonCardProps {
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

export function PokemonCard({ name, id, image, types, onClick }: PokemonCardProps) {
  return (
    <Card 
      className="p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200 flex flex-col items-center"
      onClick={onClick}
    >
      <div className="w-full flex justify-end mb-2">
        <span className="text-muted-foreground">#{id.toString().padStart(3, '0')}</span>
      </div>
      <div className="w-32 h-32 mb-3 relative">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-contain"
        />
      </div>
      <h3 className="capitalize mb-2">{name}</h3>
      <div className="flex gap-2 flex-wrap justify-center">
        {types.map((type) => (
          <Badge 
            key={type} 
            className={`${typeColors[type]} text-white border-0`}
          >
            {typeTranslations[type] || type}
          </Badge>
        ))}
      </div>
    </Card>
  );
}
