import { Zap } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-red-500 via-red-600 to-yellow-500 rounded-3xl mb-12 p-12 shadow-2xl">
      {/* Decorative Pokéballs */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
        <div className="w-full h-full rounded-full border-8 border-white relative">
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-white transform -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full border-8 border-gray-800 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-48 h-48 opacity-10 transform translate-y-1/4 -translate-x-1/4">
        <div className="w-full h-full rounded-full border-8 border-white relative">
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-white transform -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-white rounded-full border-8 border-gray-800 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Zap className="w-10 h-10 text-yellow-300" fill="currentColor" />
          <h1 className="text-white text-6xl">Pokédex</h1>
          <Zap className="w-10 h-10 text-yellow-300" fill="currentColor" />
        </div>
        
        <p className="text-white/90 text-xl max-w-2xl mx-auto">
          Explora el mundo Pokémon y descubre información detallada sobre todas las criaturas
        </p>
        
        
      </div>

      {/* Decorative dots pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-20 w-2 h-2 bg-white rounded-full"></div>
        <div className="absolute top-20 left-40 w-2 h-2 bg-white rounded-full"></div>
        <div className="absolute top-32 right-32 w-2 h-2 bg-white rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-white rounded-full"></div>
        <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-white rounded-full"></div>
      </div>
    </div>
  );
}
