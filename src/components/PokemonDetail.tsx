import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { typeTranslations, statTranslations } from "../utils/translations";
import { EvolutionChain } from "./EvolutionChain";

interface PokemonDetailProps {
  pokemon: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  onEvolutionClick?: (pokemonName: string) => void;
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

export function PokemonDetail({ pokemon, open, onOpenChange, onNext, onPrevious, hasNext, hasPrevious, onEvolutionClick }: PokemonDetailProps) {
  if (!pokemon) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
        {/* Navigation Arrows positioned at image height */}
        {hasPrevious && (
          <Button
            variant="outline"
            size="icon"
            className="hidden md:flex absolute left-2 top-[200px] z-50 rounded-full shadow-lg hover:scale-110 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              onPrevious?.();
            }}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
        
        {hasNext && (
          <Button
            variant="outline"
            size="icon"
            className="hidden md:flex absolute right-2 top-[200px] z-50 rounded-full shadow-lg hover:scale-110 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              onNext?.();
            }}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}

        <DialogHeader>
          <DialogTitle className="capitalize pr-8">{pokemon.name}</DialogTitle>
          <DialogDescription>
            Información detallada
          </DialogDescription>
        </DialogHeader>
        
        <div className="text-center">
          <span className="text-muted-foreground">
            #{pokemon.id.toString().padStart(3, '0')}
          </span>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <img 
              src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-64 h-64 object-contain"
            />
            <div className="flex gap-2 mt-4">
              {pokemon.types.map((type: any) => (
                <Badge 
                  key={type.type.name}
                  className={`${typeColors[type.type.name]} text-white border-0`}
                >
                  {typeTranslations[type.type.name] || type.type.name}
                </Badge>
              ))}
            </div>
            
            {/* Mobile navigation buttons below image */}
            <div className="flex md:hidden gap-4 mt-4">
              {hasPrevious && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrevious?.();
                  }}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
              )}
              
              {hasNext && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNext?.();
                  }}
                  className="flex items-center gap-2"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="stats">Estadísticas</TabsTrigger>
              <TabsTrigger value="about">Acerca de</TabsTrigger>
              <TabsTrigger value="evolution">Evolución</TabsTrigger>
              <TabsTrigger value="moves">Movimientos</TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="space-y-4 min-h-[320px]">
              {pokemon.stats.map((stat: any) => (
                <div key={stat.stat.name} className="space-y-2">
                  <div className="flex justify-between">
                    <span>{statTranslations[stat.stat.name] || stat.stat.name}</span>
                    <span>{stat.base_stat}</span>
                  </div>
                  <Progress value={(stat.base_stat / 255) * 100} />
                </div>
              ))}
            </TabsContent>

            <TabsContent value="about" className="space-y-4 min-h-[320px]">
              {/* Description */}
              {pokemon.description && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-muted-foreground mb-2">Descripción</p>
                  <p className="italic">{pokemon.description}</p>
                </div>
              )}
              
              {/* Species info */}
              {pokemon.genus && (
                <div>
                  <p className="text-muted-foreground">Especie</p>
                  <p>{pokemon.genus}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">Altura</p>
                  <p>{pokemon.height / 10} m</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Peso</p>
                  <p>{pokemon.weight / 10} kg</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Experiencia Base</p>
                  <p>{pokemon.base_experience}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Habilidades</p>
                  <div className="flex flex-col gap-1">
                    {pokemon.abilities.map((ability: any) => (
                      <span key={ability.ability.name} className="capitalize">
                        {pokemon.abilitiesSpanish?.[ability.ability.name] || ability.ability.name.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="evolution" className="min-h-[320px]">
              <EvolutionChain 
                pokemonId={pokemon.id} 
                onPokemonClick={onEvolutionClick}
              />
            </TabsContent>

            <TabsContent value="moves" className="space-y-2 min-h-[320px]">
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {pokemon.moves.slice(0, 20).map((move: any) => (
                  <div 
                    key={move.move.name}
                    className="p-2 bg-muted rounded"
                  >
                    {pokemon.movesSpanish?.[move.move.name] || move.move.name.replace('-', ' ')}
                  </div>
                ))}
              </div>
              {pokemon.moves.length > 20 && (
                <p className="text-muted-foreground text-center">
                  Y {pokemon.moves.length - 20} movimientos más...
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
