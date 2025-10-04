import { useState, useEffect } from 'react';
import { PokemonCard } from './components/PokemonCard';
import { PokemonListItem } from './components/PokemonListItem';
import { PokemonDetail } from './components/PokemonDetail';
import { HeroSection } from './components/HeroSection';
import { SearchBar } from './components/SearchBar';
import { StickySearchBar } from './components/StickySearchBar';
import { FilterSheet, FilterButton } from './components/FilterSheet';
import { generations } from './components/GenerationFilter';
import { Button } from './components/ui/button';
import { Skeleton } from './components/ui/skeleton';
import { motion, AnimatePresence } from 'motion/react';
import { useScrollThreshold } from './hooks/useScrollThreshold';

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonDetails {
  id: number;
  name: string;
  sprites: any;
  types: any[];
  stats: any[];
  height: number;
  weight: number;
  abilities: any[];
  moves: any[];
  base_experience: number;
  abilitiesSpanish?: { [key: string]: string };
  movesSpanish?: { [key: string]: string };
  description?: string;
  genus?: string;
  captureRate?: number;
  eggGroups?: string[];
  genderRate?: number;
}

export default function App() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [allPokemonNames, setAllPokemonNames] = useState<Pokemon[]>([]);
  const [pokemonDetails, setPokemonDetails] = useState<{ [key: string]: PokemonDetails }>({});
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<PokemonDetails[]>([]);
  const [searching, setSearching] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [typeFilteredPokemon, setTypeFilteredPokemon] = useState<PokemonDetails[]>([]);
  const [loadingTypeFilter, setLoadingTypeFilter] = useState(false);
  const [totalTypeResults, setTotalTypeResults] = useState(0);
  const [typeFilterLimit, setTypeFilterLimit] = useState(50);
  const [selectedGenerations, setSelectedGenerations] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    const saved = localStorage.getItem('pokemomViewMode');
    return (saved as 'grid' | 'list') || 'grid';
  });
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const limit = 21;
  const isScrolled = useScrollThreshold(200);

  useEffect(() => {
    fetchAllPokemonNames();
    fetchPokemonList();
  }, []);

  // View mode effect
  useEffect(() => {
    localStorage.setItem('pokemomViewMode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    if (offset > 0) {
      fetchPokemonList();
    }
  }, [offset]);

  // Search effect
  useEffect(() => {
    const searchPokemon = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        setSearching(false);
        return;
      }

      setSearching(true);
      try {
        // Filter from complete list of Pokemon names
        const matchingPokemon = allPokemonNames
          .filter(pokemon =>
            pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .slice(0, 30); // Limit to 30 results

        if (matchingPokemon.length === 0) {
          setSearchResults([]);
          setSearching(false);
          return;
        }

        // Fetch details for matching Pokemon that aren't already loaded
        const detailsToFetch = matchingPokemon.filter(
          pokemon => !pokemonDetails[pokemon.name]
        );

        if (detailsToFetch.length > 0) {
          const detailsPromises = detailsToFetch.map(pokemon =>
            fetch(pokemon.url).then(res => {
              if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
              return res.json();
            }).catch(() => null)
          );

          const newDetails = await Promise.all(detailsPromises);
          const validDetails = newDetails.filter(d => d !== null);
          
          const newDetailsMap = validDetails.reduce((acc, detail) => {
            acc[detail.name] = detail;
            return acc;
          }, {} as { [key: string]: PokemonDetails });

          setPokemonDetails(prev => {
            const updated = { ...prev, ...newDetailsMap };
            
            // Update search results with newly fetched details
            const results = matchingPokemon
              .map(pokemon => updated[pokemon.name])
              .filter(Boolean);
            setSearchResults(results);
            
            return updated;
          });
        } else {
          // All details already loaded
          const results = matchingPokemon
            .map(pokemon => pokemonDetails[pokemon.name])
            .filter(Boolean);
          setSearchResults(results);
        }
      } catch (error) {
        console.error('Error searching Pokemon:', error);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    };

    const timeoutId = setTimeout(searchPokemon, 400);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, allPokemonNames]);

  // Type filter effect
  useEffect(() => {
    const fetchPokemonByType = async () => {
      if (selectedTypes.length === 0) {
        setTypeFilteredPokemon([]);
        setTotalTypeResults(0);
        setLoadingTypeFilter(false);
        return;
      }

      setLoadingTypeFilter(true);
      try {
        // Fetch all Pokemon for each selected type
        const typePromises = selectedTypes.map(type =>
          fetch(`https://pokeapi.co/api/v2/type/${type}`).then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
          })
        );

        const typeData = await Promise.all(typePromises);
        
        // Combine all Pokemon from all types (union, not intersection)
        const allPokemonFromTypes = new Set<string>();
        typeData.forEach(data => {
          data.pokemon.forEach((p: any) => {
            allPokemonFromTypes.add(p.pokemon.name);
          });
        });

        // Store total count before limiting
        const totalCount = allPokemonFromTypes.size;
        setTotalTypeResults(totalCount);

        // Convert to array and limit results
        const pokemonNames = Array.from(allPokemonFromTypes).slice(0, typeFilterLimit);

        // Fetch details for Pokemon that aren't already loaded
        const detailsToFetch = pokemonNames.filter(
          name => !pokemonDetails[name]
        );

        if (detailsToFetch.length > 0) {
          const detailsPromises = detailsToFetch.map(name =>
            fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
              .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
              })
              .catch(() => null)
          );

          const newDetails = await Promise.all(detailsPromises);
          const validDetails = newDetails.filter(d => d !== null);
          
          const newDetailsMap = validDetails.reduce((acc, detail) => {
            acc[detail.name] = detail;
            return acc;
          }, {} as { [key: string]: PokemonDetails });

          setPokemonDetails(prev => {
            const updated = { ...prev, ...newDetailsMap };
            
            // Update filtered results
            const results = pokemonNames
              .map(name => updated[name])
              .filter(Boolean);
            setTypeFilteredPokemon(results);
            
            return updated;
          });
        } else {
          // All details already loaded
          const results = pokemonNames
            .map(name => pokemonDetails[name])
            .filter(Boolean);
          setTypeFilteredPokemon(results);
        }
      } catch (error) {
        console.error('Error fetching Pokemon by type:', error);
        setTypeFilteredPokemon([]);
        setTotalTypeResults(0);
      } finally {
        setLoadingTypeFilter(false);
      }
    };

    fetchPokemonByType();
  }, [selectedTypes, typeFilterLimit]);

  const fetchAllPokemonNames = async () => {
    try {
      // Fetch all Pokemon names (there are around 1000+)
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAllPokemonNames(data.results);
    } catch (error) {
      console.error('Error fetching all Pokemon names:', error);
    }
  };

  const fetchPokemonList = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      setPokemonList(prev => offset === 0 ? data.results : [...prev, ...data.results]);
      setHasMore(data.next !== null);

      // Fetch details for each pokemon
      const detailsPromises = data.results.map((pokemon: Pokemon) =>
        fetch(pokemon.url).then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        }).catch(() => null)
      );
      
      const details = await Promise.all(detailsPromises);
      const validDetails = details.filter(d => d !== null);
      const detailsMap = validDetails.reduce((acc, detail) => {
        acc[detail.name] = detail;
        return acc;
      }, {} as { [key: string]: PokemonDetails });

      setPokemonDetails(prev => ({ ...prev, ...detailsMap }));
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setOffset(prev => prev + limit);
  };

  const fetchPokemonSpecies = async (pokemonId: number) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
      
      if (!response.ok) {
        // 404 is expected for some Pokemon variants/forms, don't log it
        if (response.status !== 404) {
          console.error(`Error fetching Pokemon species #${pokemonId}: HTTP ${response.status}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Get Spanish description
      const spanishEntry = data.flavor_text_entries.find(
        (entry: any) => entry.language.name === 'es'
      );
      const description = spanishEntry?.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ') || 
                         'No hay descripción disponible.';
      
      // Get Spanish genus (species category)
      const spanishGenus = data.genera.find(
        (genus: any) => genus.language.name === 'es'
      );
      const genus = spanishGenus?.genus || 'Desconocido';
      
      // Get capture rate
      const captureRate = data.capture_rate;
      
      // Get egg groups in Spanish
      const eggGroupPromises = data.egg_groups.map(async (group: any) => {
        try {
          const response = await fetch(group.url);
          if (!response.ok) {
            return group.name;
          }
          const groupData = await response.json();
          const spanishName = groupData.names.find((n: any) => n.language.name === 'es');
          return spanishName?.name || group.name;
        } catch {
          return group.name;
        }
      });
      
      const eggGroups = await Promise.all(eggGroupPromises);
      
      // Gender rate (-1 = genderless, 0 = always male, 8 = always female, 4 = 50/50)
      const genderRate = data.gender_rate;
      
      return { description, genus, captureRate, eggGroups, genderRate };
    } catch (error) {
      // Return default values silently for 404s (expected for some Pokemon variants)
      // Other errors would have already been logged above
      return { 
        description: 'No hay descripción disponible.', 
        genus: 'Desconocido',
        captureRate: 0,
        eggGroups: [],
        genderRate: -1
      };
    }
  };

  const fetchSpanishTranslations = async (pokemon: PokemonDetails) => {
    try {
      // Fetch Spanish names for abilities (limit to first 5 to avoid too many requests)
      const abilityPromises = pokemon.abilities.slice(0, 5).map(async (ability: any) => {
        try {
          const response = await fetch(ability.ability.url);
          if (!response.ok) {
            return { key: ability.ability.name, value: ability.ability.name };
          }
          const data = await response.json();
          const spanishName = data.names.find((n: any) => n.language.name === 'es');
          return { key: ability.ability.name, value: spanishName?.name || ability.ability.name };
        } catch {
          return { key: ability.ability.name, value: ability.ability.name };
        }
      });

      // Fetch Spanish names for moves (limit to first 20 to avoid too many requests)
      const movePromises = pokemon.moves.slice(0, 20).map(async (move: any) => {
        try {
          const response = await fetch(move.move.url);
          if (!response.ok) {
            return { key: move.move.name, value: move.move.name };
          }
          const data = await response.json();
          const spanishName = data.names.find((n: any) => n.language.name === 'es');
          return { key: move.move.name, value: spanishName?.name || move.move.name };
        } catch {
          return { key: move.move.name, value: move.move.name };
        }
      });

      const [abilities, moves] = await Promise.all([
        Promise.all(abilityPromises),
        Promise.all(movePromises)
      ]);

      const abilitiesSpanish = abilities.reduce((acc, { key, value }) => {
        acc[key] = value;
        return acc;
      }, {} as { [key: string]: string });

      const movesSpanish = moves.reduce((acc, { key, value }) => {
        acc[key] = value;
        return acc;
      }, {} as { [key: string]: string });

      return { abilitiesSpanish, movesSpanish };
    } catch (error) {
      console.error('Error fetching Spanish translations:', error);
      return { abilitiesSpanish: {}, movesSpanish: {} };
    }
  };

  const handlePokemonClick = async (pokemon: PokemonDetails) => {
    setSelectedPokemon(pokemon);
    
    // If translations and species data haven't been loaded yet, fetch them
    if (!pokemon.abilitiesSpanish || !pokemon.movesSpanish || !pokemon.description) {
      const [translations, speciesData] = await Promise.all([
        fetchSpanishTranslations(pokemon),
        fetchPokemonSpecies(pokemon.id)
      ]);
      
      const updatedPokemon = {
        ...pokemon,
        ...translations,
        ...speciesData
      };
      
      // Update the pokemonDetails with translations and species data
      setPokemonDetails(prev => ({
        ...prev,
        [pokemon.name]: updatedPokemon
      }));
      
      setSelectedPokemon(updatedPokemon);
    }
  };

  const handleEvolutionClick = async (pokemonName: string) => {
    try {
      // Check if we already have this Pokemon's details
      if (pokemonDetails[pokemonName]) {
        await handlePokemonClick(pokemonDetails[pokemonName]);
        return;
      }

      // Fetch the Pokemon if we don't have it
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      if (!response.ok) throw new Error('Pokemon not found');
      
      const pokemonData = await response.json();
      
      // Update pokemonDetails
      setPokemonDetails(prev => ({
        ...prev,
        [pokemonName]: pokemonData
      }));

      // Open the new Pokemon
      await handlePokemonClick(pokemonData);
    } catch (error) {
      console.error('Error fetching Pokemon from evolution chain:', error);
    }
  };

  // Helper function to check if a Pokemon is in selected generations
  const isPokemonInSelectedGenerations = (pokemonId: number) => {
    if (selectedGenerations.length === 0) return true;
    
    return selectedGenerations.some(genNumber => {
      const gen = generations.find(g => g.number === genNumber);
      if (!gen) return false;
      return pokemonId >= gen.range.start && pokemonId <= gen.range.end;
    });
  };

  // Determine which Pokemon to display
  const getDisplayPokemon = () => {
    let result: PokemonDetails[] = [];
    
    // Start with the appropriate base list
    if (searchTerm) {
      result = searchResults;
    } else if (selectedTypes.length > 0) {
      result = typeFilteredPokemon;
    } else {
      result = pokemonList.map(p => pokemonDetails[p.name]).filter(Boolean);
    }
    
    // Apply type filter if we're searching and types are selected
    if (searchTerm && selectedTypes.length > 0) {
      result = result.filter(p => 
        p.types.some(type => selectedTypes.includes(type.type.name))
      );
    }
    
    // Apply generation filter
    if (selectedGenerations.length > 0) {
      result = result.filter(p => isPokemonInSelectedGenerations(p.id));
    }
    
    return result;
  };

  const displayPokemon = getDisplayPokemon();

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleGenerationToggle = (generation: number) => {
    setSelectedGenerations(prev =>
      prev.includes(generation)
        ? prev.filter(g => g !== generation)
        : [...prev, generation]
    );
  };

  const handleClearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedGenerations([]);
    setTypeFilterLimit(50);
  };

  const handleLoadMoreTypeResults = () => {
    setTypeFilterLimit(prev => prev + 50);
  };

  const handleNextPokemon = async () => {
    if (!selectedPokemon) return;
    
    const currentIndex = displayPokemon.findIndex(p => p?.id === selectedPokemon.id);
    if (currentIndex < displayPokemon.length - 1) {
      const nextPokemon = displayPokemon[currentIndex + 1];
      await handlePokemonClick(nextPokemon);
    }
  };

  const handlePreviousPokemon = async () => {
    if (!selectedPokemon) return;
    
    const currentIndex = displayPokemon.findIndex(p => p?.id === selectedPokemon.id);
    if (currentIndex > 0) {
      const previousPokemon = displayPokemon[currentIndex - 1];
      await handlePokemonClick(previousPokemon);
    }
  };

  const getCurrentPokemonIndex = () => {
    if (!selectedPokemon) return -1;
    return displayPokemon.findIndex(p => p?.id === selectedPokemon.id);
  };

  const hasNextPokemon = () => {
    const index = getCurrentPokemonIndex();
    return index !== -1 && index < displayPokemon.length - 1;
  };

  const hasPreviousPokemon = () => {
    const index = getCurrentPokemonIndex();
    return index !== -1 && index > 0;
  };

  const totalFilters = selectedTypes.length + selectedGenerations.length;

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Sticky search bar that appears on scroll */}
      <StickySearchBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filterButton={
          <FilterButton 
            totalFilters={totalFilters}
            onClick={() => setFilterSheetOpen(true)}
          />
        }
      />

      <div className="max-w-7xl mx-auto">
        <HeroSection />
        
        <div className="mb-8">
          <AnimatePresence>
            {!isScrolled && (
              <motion.div 
                className="mb-6"
                initial={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                <SearchBar 
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  filterButton={
                    <FilterButton 
                      totalFilters={totalFilters}
                      onClick={() => setFilterSheetOpen(true)}
                    />
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          <FilterSheet
            selectedTypes={selectedTypes}
            selectedGenerations={selectedGenerations}
            onTypeToggle={handleTypeToggle}
            onGenerationToggle={handleGenerationToggle}
            onClearAll={handleClearAllFilters}
            open={filterSheetOpen}
            onOpenChange={setFilterSheetOpen}
          />
          
          {(searchTerm || selectedTypes.length > 0 || selectedGenerations.length > 0) && (
            <div className="text-center mt-4">
              {(searching || loadingTypeFilter) ? (
                <p className="text-muted-foreground">Buscando...</p>
              ) : (
                <>
                  <p className="text-muted-foreground">
                    {displayPokemon.length} Pokémon encontrado{displayPokemon.length !== 1 ? 's' : ''}
                    {selectedTypes.length > 0 && !searchTerm && totalTypeResults > displayPokemon.length && selectedGenerations.length === 0 && (
                      <span> (mostrando {displayPokemon.length} de {totalTypeResults})</span>
                    )}
                  </p>
                  {selectedTypes.length > 0 && !searchTerm && totalTypeResults > displayPokemon.length && selectedGenerations.length === 0 && (
                    <p className="text-muted-foreground mt-1">
                      Hay {totalTypeResults - displayPokemon.length} Pokémon más disponibles
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8' : 'flex flex-col gap-4 mb-8 max-w-3xl mx-auto'}>
          {loading && offset === 0 && !searchTerm && selectedTypes.length === 0 ? (
            Array.from({ length: 21 }).map((_, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <Skeleton className="w-full h-32 mb-4" />
                <Skeleton className="w-3/4 h-6 mb-2 mx-auto" />
                <Skeleton className="w-1/2 h-4 mx-auto" />
              </div>
            ))
          ) : (searching || loadingTypeFilter) ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full flex justify-center py-12"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span>Buscando Pokémon...</span>
              </div>
            </motion.div>
          ) : displayPokemon.length === 0 && (searchTerm || selectedTypes.length > 0 || selectedGenerations.length > 0) ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="col-span-full text-center py-12"
            >
              <p className="text-muted-foreground">No se encontró ningún Pokémon con esos criterios</p>
              <p className="text-muted-foreground mt-2">
                {searchTerm && (selectedTypes.length > 0 || selectedGenerations.length > 0)
                  ? 'Intenta ajustar tu búsqueda o los filtros'
                  : searchTerm 
                  ? 'Intenta buscar por nombre exacto (ej: pikachu, charizard)'
                  : selectedTypes.length > 0 || selectedGenerations.length > 0
                  ? 'Intenta seleccionar otros filtros'
                  : 'No hay Pokémon disponibles'
                }
              </p>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {displayPokemon.map((details, index) => {
                if (!details) return null;

                const PokemonComponent = viewMode === 'grid' ? PokemonCard : PokemonListItem;

                return (
                  <motion.div
                    key={`${details.id}-${searchTerm}-${selectedTypes.join(',')}-${selectedGenerations.join(',')}-${viewMode}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.02,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                    layout
                  >
                    <PokemonComponent
                      name={details.name}
                      id={details.id}
                      image={details.sprites.other['official-artwork'].front_default || details.sprites.front_default}
                      types={details.types.map((type: any) => type.type.name)}
                      onClick={() => handlePokemonClick(details)}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Load more button for default list */}
        {!searchTerm && !selectedTypes.length && !selectedGenerations.length && hasMore && (
          <div className="flex justify-center mb-8">
            <Button 
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Cargar más Pokémon'}
            </Button>
          </div>
        )}

        {/* Load more button for type filter */}
        {selectedTypes.length > 0 && !searchTerm && !selectedGenerations.length && totalTypeResults > typeFilteredPokemon.length && (
          <div className="flex justify-center mb-8">
            <Button 
              onClick={handleLoadMoreTypeResults}
              disabled={loadingTypeFilter}
            >
              {loadingTypeFilter ? 'Cargando...' : `Cargar más Pokémon (${totalTypeResults - typeFilteredPokemon.length} restantes)`}
            </Button>
          </div>
        )}

        <PokemonDetail
          pokemon={selectedPokemon}
          open={!!selectedPokemon}
          onOpenChange={(open) => !open && setSelectedPokemon(null)}
          onNext={handleNextPokemon}
          onPrevious={handlePreviousPokemon}
          hasNext={hasNextPokemon()}
          hasPrevious={hasPreviousPokemon()}
          onEvolutionClick={handleEvolutionClick}
        />
      </div>
    </div>
  );
}
