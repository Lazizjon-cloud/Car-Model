
import React, { useState, useCallback } from 'react';
import { 
  CarStyle, 
  FuelType, 
  CarModel, 
  ConfigOptions 
} from './types';
import { generateCarData, generateCarImage } from './services/geminiService';
import PerformanceChart from './components/PerformanceChart';
import LoadingOverlay from './components/LoadingOverlay';

const App: React.FC = () => {
  const [config, setConfig] = useState<ConfigOptions>({
    style: CarStyle.SUPERCAR,
    fuel: FuelType.ELECTRIC,
    color: 'Obsidian Black',
    additionalPrompt: ''
  });

  const [currentCar, setCurrentCar] = useState<CarModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [history, setHistory] = useState<CarModel[]>([]);

  const handleGenerate = async () => {
    setLoading(true);
    setLoadingStage('Analyzing aerodynamic profiles');
    
    try {
      const carData = await generateCarData(config);
      setLoadingStage(`Rendering ${carData.name} visuals`);
      
      const imageUrl = await generateCarImage(config, carData.name || 'Concept');
      
      const newCar: CarModel = {
        id: Date.now().toString(),
        name: carData.name || 'Prototype X',
        brand: carData.brand || 'AutoForge',
        style: config.style,
        fuel: config.fuel,
        primaryColor: config.color,
        description: carData.description || '',
        specs: carData.specs || { topSpeed: 200, acceleration: 3.5, range: 400, horsepower: 800 },
        imageUrl: imageUrl,
        features: carData.features || [],
        launchYear: carData.launchYear || 2026
      };

      setCurrentCar(newCar);
      setHistory(prev => [newCar, ...prev].slice(0, 10));
    } catch (error) {
      console.error("Generation failed", error);
      alert("Failed to build the car. The AI engineers need a break. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg p-4 md:p-8">
      {loading && <LoadingOverlay stage={loadingStage} />}

      {/* Header */}
      <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl md:text-6xl font-orbitron font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-red-500">
            AUTOFORGE AI
          </h1>
          <p className="text-slate-400 mt-2 font-light">Conceptualize the next generation of performance.</p>
        </div>
        <div className="flex gap-4">
            <div className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-mono uppercase tracking-tighter text-slate-300">Generative System Active</span>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Configurator */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <section className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm">
            <h2 className="text-xl font-orbitron text-white mb-6">Build Specifications</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-slate-500 font-bold mb-2">Chassis Style</label>
                <select 
                  value={config.style}
                  onChange={(e) => setConfig({...config, style: e.target.value as CarStyle})}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  {Object.values(CarStyle).map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase text-slate-500 font-bold mb-2">Powertrain</label>
                <select 
                  value={config.fuel}
                  onChange={(e) => setConfig({...config, fuel: e.target.value as FuelType})}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  {Object.values(FuelType).map(fuel => (
                    <option key={fuel} value={fuel}>{fuel}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase text-slate-500 font-bold mb-2">Exterior Color</label>
                <input 
                  type="text"
                  value={config.color}
                  onChange={(e) => setConfig({...config, color: e.target.value})}
                  placeholder="e.g. Electric Cyan, Satin White"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-slate-500 font-bold mb-2">Special Directives</label>
                <textarea 
                  value={config.additionalPrompt}
                  onChange={(e) => setConfig({...config, additionalPrompt: e.target.value})}
                  placeholder="e.g. Add glowing rims, gull-wing doors..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white h-24 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <button 
                onClick={handleGenerate}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-orbitron font-bold rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all transform hover:-translate-y-1 active:translate-y-0"
              >
                GENERATE CONCEPT
              </button>
            </div>
          </section>

          {/* History Snippet */}
          {history.length > 0 && (
            <section className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl hidden lg:block">
              <h3 className="text-xs uppercase text-slate-500 font-bold mb-4 tracking-widest">Recent Archive</h3>
              <div className="space-y-3">
                {history.map(car => (
                  <button 
                    key={car.id}
                    onClick={() => setCurrentCar(car)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-colors group"
                  >
                    <img src={car.imageUrl} alt={car.name} className="w-12 h-12 rounded object-cover border border-slate-700" />
                    <div className="text-left overflow-hidden">
                      <p className="text-sm text-white font-semibold truncate group-hover:text-blue-400">{car.name}</p>
                      <p className="text-[10px] text-slate-500 uppercase">{car.brand}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Display */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {currentCar ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Main Visual */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
                <img 
                  src={currentCar.imageUrl} 
                  alt={currentCar.name} 
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute top-6 left-6 flex flex-col gap-1">
                  <span className="text-blue-500 font-orbitron text-sm tracking-[0.2em] font-bold uppercase">{currentCar.brand}</span>
                  <h1 className="text-4xl md:text-5xl font-orbitron text-white font-bold drop-shadow-lg">{currentCar.name}</h1>
                </div>
                <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                  <span className="text-white font-mono text-sm">LAUNCH READY: {currentCar.launchYear}</span>
                </div>
              </div>

              {/* Specs and Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-6">
                  <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                    <h3 className="text-slate-400 text-sm font-semibold mb-3 uppercase tracking-wider">Design Philosophy</h3>
                    <p className="text-slate-200 leading-relaxed font-light text-sm italic">
                      {currentCar.description}
                    </p>
                  </div>

                  <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                    <h3 className="text-slate-400 text-sm font-semibold mb-4 uppercase tracking-wider">Propulsion & Innovation</h3>
                    <ul className="grid grid-cols-1 gap-3">
                      {currentCar.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <PerformanceChart stats={currentCar.specs} />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-center">
                        <span className="block text-[10px] text-slate-500 uppercase mb-1">Top Velocity</span>
                        <span className="text-2xl font-orbitron font-bold text-red-500">{currentCar.specs.topSpeed}</span>
                        <span className="text-[10px] text-slate-400 ml-1">MPH</span>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-center">
                        <span className="block text-[10px] text-slate-500 uppercase mb-1">Output</span>
                        <span className="text-2xl font-orbitron font-bold text-blue-500">{currentCar.specs.horsepower}</span>
                        <span className="text-[10px] text-slate-400 ml-1">HP</span>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-center">
                        <span className="block text-[10px] text-slate-500 uppercase mb-1">Acceleration</span>
                        <span className="text-2xl font-orbitron font-bold text-yellow-500">{currentCar.specs.acceleration}</span>
                        <span className="text-[10px] text-slate-400 ml-1">SEC</span>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-center">
                        <span className="block text-[10px] text-slate-500 uppercase mb-1">Operational Range</span>
                        <span className="text-2xl font-orbitron font-bold text-emerald-500">{currentCar.specs.range}</span>
                        <span className="text-[10px] text-slate-400 ml-1">MI</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[500px] border-2 border-dashed border-slate-800 rounded-3xl opacity-50">
              <div className="w-24 h-24 mb-6 rounded-full bg-slate-800 flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h2 className="text-2xl font-orbitron text-slate-500">Awaiting Specifications</h2>
              <p className="text-slate-600 mt-2">Configure and generate to forge your first vehicle.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-24 pt-8 border-t border-slate-800 text-center">
        <p className="text-slate-600 text-xs font-mono tracking-widest uppercase">
          Powered by Gemini Vision & Language Systems // Build {new Date().getFullYear()}.04.22
        </p>
      </footer>
    </div>
  );
};

export default App;
