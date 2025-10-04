import { useEffect, useState } from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';

interface EvolutionDetails {
  id: number;
  name: string;
  image: string;
  trigger?: string;
  minLevel?: number;
  item?: string;
  condition?: string;
}

interface EvolutionChainProps {
  pokemonId: number;
  onPokemonClick?: (pokemonName: string) => void;
}

export function EvolutionChain({ pokemonId, onPokemonClick }: EvolutionChainProps) {
  const [evolutionChain, setEvolutionChain] = useState<EvolutionDetails[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvolutionChain();
  }, [pokemonId]);

  const fetchEvolutionChain = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 1. Get species data
      const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
      if (!speciesResponse.ok) throw new Error('No se pudo obtener la información de la especie');
      
      const speciesData = await speciesResponse.json();
      
      // 2. Get evolution chain data
      const evolutionResponse = await fetch(speciesData.evolution_chain.url);
      if (!evolutionResponse.ok) throw new Error('No se pudo obtener la cadena evolutiva');
      
      const evolutionData = await evolutionResponse.json();
      
      // 3. Parse evolution chain
      const chain = await parseEvolutionChain(evolutionData.chain);
      setEvolutionChain(chain);
    } catch (err) {
      console.error('Error fetching evolution chain:', err);
      setError('No se pudo cargar la cadena evolutiva');
    } finally {
      setLoading(false);
    }
  };

  const parseEvolutionChain = async (chain: any): Promise<EvolutionDetails[][]> => {
    const stages: EvolutionDetails[][] = [];
    
    // Process the chain recursively
    const processChain = async (current: any, stage: number = 0) => {
      if (!stages[stage]) {
        stages[stage] = [];
      }
      
      // Get Pokemon ID from species URL
      const speciesUrlParts = current.species.url.split('/');
      const speciesId = parseInt(speciesUrlParts[speciesUrlParts.length - 2]);
      
      // Fetch Pokemon data to get the image
      const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${speciesId}`);
      const pokemonData = await pokemonResponse.json();
      
      // Get evolution details
      let evolutionInfo: Partial<EvolutionDetails> = {};
      if (current.evolution_details && current.evolution_details.length > 0) {
        const details = current.evolution_details[0];
        
        // Trigger
        evolutionInfo.trigger = details.trigger?.name;
        
        // Level
        if (details.min_level) {
          evolutionInfo.minLevel = details.min_level;
        }
        
        // Item
        if (details.item) {
          const itemName = details.item.name;
          evolutionInfo.item = translateItem(itemName);
        }
        
        // Other conditions
        const conditions: string[] = [];
        if (details.min_happiness) conditions.push(`Felicidad ≥${details.min_happiness}`);
        if (details.min_beauty) conditions.push(`Belleza ≥${details.min_beauty}`);
        if (details.min_affection) conditions.push(`Afecto ≥${details.min_affection}`);
        if (details.needs_overworld_rain) conditions.push('Lloviendo');
        if (details.time_of_day) conditions.push(details.time_of_day === 'day' ? 'De día' : 'De noche');
        if (details.location) conditions.push(`En ${details.location.name}`);
        if (details.known_move) conditions.push(`Con ${details.known_move.name}`);
        if (details.known_move_type) conditions.push(`Con movimiento tipo ${details.known_move_type.name}`);
        if (details.party_species) conditions.push(`Con ${details.party_species.name} en equipo`);
        if (details.party_type) conditions.push(`Con tipo ${details.party_type.name} en equipo`);
        if (details.relative_physical_stats !== null) {
          if (details.relative_physical_stats === 1) conditions.push('ATQ > DEF');
          else if (details.relative_physical_stats === -1) conditions.push('DEF > ATQ');
          else conditions.push('ATQ = DEF');
        }
        if (details.trade_species) conditions.push(`Intercambio con ${details.trade_species.name}`);
        if (details.turn_upside_down) conditions.push('Girar consola');
        
        if (conditions.length > 0) {
          evolutionInfo.condition = conditions.join(', ');
        }
      }
      
      stages[stage].push({
        id: pokemonData.id,
        name: pokemonData.name,
        image: pokemonData.sprites.other['official-artwork'].front_default || pokemonData.sprites.front_default,
        ...evolutionInfo
      });
      
      // Process evolutions (there can be multiple evolution paths)
      if (current.evolves_to && current.evolves_to.length > 0) {
        for (const evolution of current.evolves_to) {
          await processChain(evolution, stage + 1);
        }
      }
    };
    
    await processChain(chain);
    return stages;
  };

  const translateItem = (itemName: string): string => {
    const itemTranslations: { [key: string]: string } = {
      'fire-stone': 'Piedra Fuego',
      'water-stone': 'Piedra Agua',
      'thunder-stone': 'Piedra Trueno',
      'leaf-stone': 'Piedra Hoja',
      'moon-stone': 'Piedra Lunar',
      'sun-stone': 'Piedra Solar',
      'shiny-stone': 'Piedra Día',
      'dusk-stone': 'Piedra Noche',
      'dawn-stone': 'Piedra Alba',
      'ice-stone': 'Piedra Hielo',
      'kings-rock': 'Roca del Rey',
      'metal-coat': 'Revestimiento Metálico',
      'dragon-scale': 'Escama Dragón',
      'upgrade': 'Mejora',
      'protector': 'Protector',
      'electirizer': 'Electrizador',
      'magmarizer': 'Magmatizador',
      'dubious-disc': 'Disco Extraño',
      'reaper-cloth': 'Tela Terrible',
      'razor-claw': 'Garra Afilada',
      'razor-fang': 'Colmillo Agudo',
      'prism-scale': 'Escama Bella',
      'deep-sea-tooth': 'Diente Marino',
      'deep-sea-scale': 'Escama Marina',
      'oval-stone': 'Piedra Oval',
      'sweet-apple': 'Manzana Dulce',
      'tart-apple': 'Manzana Ácida',
      'cracked-pot': 'Tetera Agrietada',
      'chipped-pot': 'Tetera Rota',
      'galarica-cuff': 'Brazal Galanuez',
      'galarica-wreath': 'Corona Galanuez',
    };
    
    return itemTranslations[itemName] || itemName.replace('-', ' ');
  };

  const getEvolutionMethod = (evolution: EvolutionDetails): string | null => {
    if (!evolution.trigger) return null;
    
    const methods: string[] = [];
    
    if (evolution.trigger === 'level-up') {
      if (evolution.minLevel) {
        methods.push(`Nv. ${evolution.minLevel}`);
      } else if (evolution.condition) {
        methods.push(evolution.condition);
      } else {
        methods.push('Subir nivel');
      }
    } else if (evolution.trigger === 'trade') {
      if (evolution.item) {
        methods.push(`Intercambio + ${evolution.item}`);
      } else if (evolution.condition) {
        methods.push(`Intercambio (${evolution.condition})`);
      } else {
        methods.push('Intercambio');
      }
    } else if (evolution.trigger === 'use-item') {
      if (evolution.item) {
        methods.push(evolution.item);
      } else {
        methods.push('Usar objeto');
      }
    } else if (evolution.trigger === 'shed') {
      methods.push('Automático');
    }
    
    return methods.length > 0 ? methods.join(', ') : null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>{error}</p>
      </div>
    );
  }

  if (evolutionChain.length === 0 || (evolutionChain.length === 1 && evolutionChain[0].length === 1)) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Este Pokémon no tiene evoluciones</p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
        <AnimatePresence mode="wait">
          {evolutionChain.map((stage, stageIndex) => (
            <motion.div
              key={stageIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: stageIndex * 0.1 }}
              className="flex items-center gap-4 md:gap-6"
            >
              {/* Evolution stage */}
              <div className="flex flex-col gap-3">
                {stage.map((evolution, evolutionIndex) => (
                  <motion.div
                    key={evolution.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (stageIndex * 0.1) + (evolutionIndex * 0.05) }}
                    className="flex flex-col items-center"
                  >
                    <button
                      onClick={() => onPokemonClick?.(evolution.name)}
                      className="group relative flex flex-col items-center transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring rounded-lg p-2"
                    >
                      <div className="relative">
                        <img
                          src={evolution.image}
                          alt={evolution.name}
                          className="w-20 h-20 md:w-24 md:h-24 object-contain"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-lg transition-colors" />
                      </div>
                      <span className="capitalize mt-1 text-sm group-hover:text-primary transition-colors">
                        {evolution.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        #{evolution.id.toString().padStart(3, '0')}
                      </span>
                    </button>
                  </motion.div>
                ))}
              </div>
              
              {/* Arrow and evolution method */}
              {stageIndex < evolutionChain.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (stageIndex * 0.1) + 0.15 }}
                  className="flex flex-col items-center gap-2 mx-2"
                >
                  <ChevronRight className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                  {evolutionChain[stageIndex + 1].map((nextEvolution, idx) => {
                    const method = getEvolutionMethod(nextEvolution);
                    return method ? (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="text-xs whitespace-nowrap max-w-[120px] text-center"
                      >
                        {method}
                      </Badge>
                    ) : null;
                  })}
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
