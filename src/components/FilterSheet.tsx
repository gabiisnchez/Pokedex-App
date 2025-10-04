import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Filter, X, Sparkles, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generations } from './GenerationFilter';
import { Separator } from './ui/separator';

const pokemonTypes = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic',
  'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

const typeColors: { [key: string]: string } = {
  normal: 'bg-gray-400',
  fire: 'bg-orange-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-cyan-400',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-700',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-yellow-800',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-800',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300'
};

const typeTranslations: { [key: string]: string } = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  electric: 'Eléctrico',
  grass: 'Planta',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada'
};

interface FilterSheetProps {
  selectedTypes: string[];
  selectedGenerations: number[];
  onTypeToggle: (type: string) => void;
  onGenerationToggle: (generation: number) => void;
  onClearAll: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FilterButtonProps {
  totalFilters: number;
  onClick: () => void;
}

export function FilterButton({ totalFilters, onClick }: FilterButtonProps) {
  return (
    <Button variant="outline" className="gap-2" onClick={onClick}>
      <Filter className="h-4 w-4" />
      Filtros
      {totalFilters > 0 && (
        <Badge variant="default" className="ml-1 h-5 px-1.5 min-w-[20px] flex items-center justify-center">
          {totalFilters}
        </Badge>
      )}
    </Button>
  );
}

export function FilterSheet({
  selectedTypes,
  selectedGenerations,
  onTypeToggle,
  onGenerationToggle,
  onClearAll,
  open,
  onOpenChange
}: FilterSheetProps) {
  const totalFilters = selectedTypes.length + selectedGenerations.length;

  const handleClearTypes = () => {
    selectedTypes.forEach(type => onTypeToggle(type));
  };

  const handleClearGenerations = () => {
    selectedGenerations.forEach(gen => onGenerationToggle(gen));
  };

  return (
    <>
      {/* Sheet with filter content */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b bg-gradient-to-b from-primary/5 to-transparent">
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Filter className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <SheetTitle className="text-left">Filtros de Pokémon</SheetTitle>
                    <SheetDescription className="text-left">
                      Personaliza tu búsqueda
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              {totalFilters > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm">{totalFilters} filtro{totalFilters !== 1 ? 's' : ''} activo{totalFilters !== 1 ? 's' : ''}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClearAll}
                      className="h-7 px-2 hover:bg-primary/10"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Limpiar
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Content with scroll */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <Tabs defaultValue="types" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-11 bg-muted/50">
                  <TabsTrigger value="types" className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Tipos
                    {selectedTypes.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                        {selectedTypes.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="generations" className="gap-2">
                    <Layers className="h-4 w-4" />
                    Generaciones
                    {selectedGenerations.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                        {selectedGenerations.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="types" className="mt-6 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm">Selecciona tipos</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {selectedTypes.length > 0 
                          ? `${selectedTypes.length} seleccionado${selectedTypes.length !== 1 ? 's' : ''}`
                          : 'Ninguno seleccionado'
                        }
                      </p>
                    </div>
                    {selectedTypes.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearTypes}
                        className="h-8 px-2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Limpiar
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {pokemonTypes.map((type, index) => {
                      const isSelected = selectedTypes.includes(type);
                      
                      return (
                        <button
                          key={type}
                          onClick={() => onTypeToggle(type)}
                          className={`
                            relative overflow-hidden rounded-lg px-4 py-3 transition-all
                            ${isSelected 
                              ? `${typeColors[type]} text-white shadow-lg shadow-${type}/20` 
                              : 'bg-secondary/50 hover:bg-secondary text-foreground border border-border'
                            }
                          `}
                        >
                          <div className="relative z-10 flex items-center justify-between">
                            <span className="font-medium">{typeTranslations[type] || type}</span>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-white" />
                              </div>
                            )}
                          </div>
                          {isSelected && (
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="generations" className="mt-6 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm">Selecciona generaciones</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {selectedGenerations.length > 0 
                          ? `${selectedGenerations.length} seleccionada${selectedGenerations.length !== 1 ? 's' : ''}`
                          : 'Ninguna seleccionada'
                        }
                      </p>
                    </div>
                    {selectedGenerations.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearGenerations}
                        className="h-8 px-2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Limpiar
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {generations.map((gen, index) => {
                      const isSelected = selectedGenerations.includes(gen.number);
                      
                      return (
                        <button
                          key={gen.number}
                          onClick={() => onGenerationToggle(gen.number)}
                          className={`
                            relative w-full p-4 rounded-lg text-left transition-all
                            ${isSelected 
                              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                              : 'bg-secondary/50 hover:bg-secondary border border-border'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`
                                w-10 h-10 rounded-lg flex items-center justify-center
                                ${isSelected 
                                  ? 'bg-primary-foreground/10' 
                                  : 'bg-primary/10'
                                }
                              `}>
                                <span className={`font-bold ${isSelected ? 'text-primary-foreground' : 'text-primary'}`}>
                                  {gen.number}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">Generación {gen.number}</p>
                                <p className={`text-xs mt-0.5 ${isSelected ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                  {gen.name}
                                </p>
                              </div>
                            </div>
                            <div className={`
                              text-xs px-2 py-1 rounded 
                              ${isSelected 
                                ? 'bg-primary-foreground/10 text-primary-foreground' 
                                : 'bg-muted text-muted-foreground'
                              }
                            `}>
                              #{gen.range.start}-{gen.range.end}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="absolute right-4 top-4 w-2 h-2 rounded-full bg-primary-foreground" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Footer sticky */}
            <div className="border-t bg-background p-6">
              <AnimatePresence mode="wait">
                {totalFilters > 0 ? (
                  <motion.div
                    key="clear-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="destructive"
                      className="w-full h-11 gap-2"
                      onClick={() => {
                        onClearAll();
                        onOpenChange(false);
                      }}
                    >
                      <X className="h-4 w-4" />
                      Limpiar todos los filtros ({totalFilters})
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="apply"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      className="w-full h-11"
                      onClick={() => onOpenChange(false)}
                    >
                      Cerrar
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </SheetContent>
        </Sheet>

      {/* Active filters chips */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {selectedTypes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTypes.map((type, index) => (
              <motion.div
                key={type}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.25,
                  delay: index * 0.03,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
              >
                <Badge
                  className={`${typeColors[type]} text-white border-0 cursor-pointer hover:opacity-80 gap-1 transition-all`}
                  onClick={() => onTypeToggle(type)}
                >
                  {typeTranslations[type]}
                  <X className="h-3 w-3" />
                </Badge>
              </motion.div>
            ))}
          </div>
        )}

        {selectedGenerations.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedGenerations.map((genNumber, index) => {
              const gen = generations.find(g => g.number === genNumber);
              if (!gen) return null;
              
              return (
                <motion.div
                  key={genNumber}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: (selectedTypes.length + index) * 0.03,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                >
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80 gap-1 transition-all"
                    onClick={() => onGenerationToggle(genNumber)}
                  >
                    Gen {gen.number}
                    <X className="h-3 w-3" />
                  </Badge>
                </motion.div>
              );
            })}
          </div>
        )}

        {totalFilters > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.25,
              delay: totalFilters * 0.03,
              ease: [0.25, 0.1, 0.25, 1]
            }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-muted-foreground hover:text-foreground transition-all"
            >
              Limpiar todo
            </Button>
          </motion.div>
        )}
      </div>
    </>
  );
}