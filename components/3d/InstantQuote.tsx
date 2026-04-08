"use client";
import React, { useState, useCallback } from "react";
import { Upload, Trash2, Loader2, Weight, Clock, Layers, ChevronRight, Ruler } from "lucide-react";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import dynamic from 'next/dynamic';

const ModelViewer = dynamic(() => import("./ModelViewer"), { ssr: false });

export default function InstantQuote() {
  const [file, setFile] = useState<File | null>(null);
  const [geometry, setGeometry] = useState<any>(null);
  const [isSlicing, setIsSlicing] = useState(false);
  const [stats, setStats] = useState({ volume: 0, weight: 0, time: 0, dim: { x: 0, y: 0, z: 0 } });
  const [config, setConfig] = useState({ material: "PLA", infill: 20, resolution: "0.2" });

  const materialData = {
    PLA: { density: 1.24, price: 4.5 },
    ABS: { density: 1.04, price: 6.0 },
    PETG: { density: 1.27, price: 5.5 },
    Resin: { density: 1.15, price: 12.0 }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setIsSlicing(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const loader = new STLLoader();
      const geom = loader.parse(event.target?.result as ArrayBuffer);
      
      // Calculate Bounding Box
      geom.computeBoundingBox();
      const box = geom.boundingBox;
      const dims = {
        x: Math.abs(box.max.x - box.min.x),
        y: Math.abs(box.max.y - box.min.y),
        z: Math.abs(box.max.z - box.min.z)
      };

      // Calculate Volume
      let vol = 0;
      const pos = geom.attributes.position;
      for (let i = 0; i < pos.count; i += 3) {
        const v1 = { x: pos.getX(i), y: pos.getY(i), z: pos.getZ(i) };
        const v2 = { x: pos.getX(i+1), y: pos.getY(i+1), z: pos.getZ(i+1) };
        const v3 = { x: pos.getX(i+2), y: pos.getY(i+2), z: pos.getZ(i+2) };
        vol += (v1.x*v2.y*v3.z + v1.y*v2.z*v3.x + v1.z*v2.x*v3.y - v1.x*v2.z*v3.y - v1.y*v2.x*v3.z - v1.z*v2.y*v3.x) / 6;
      }

      const volumeCm3 = Math.abs(vol) / 1000;
      
      setTimeout(() => {
        setGeometry(geom);
        setFile(uploadedFile);
        setStats({
          volume: volumeCm3,
          weight: volumeCm3 * 1.24,
          time: (dims.z * 5) + (volumeCm3 * 10), // Rough time estimation
          dim: dims
        });
        setIsSlicing(false);
      }, 1200); // Artificial delay for UX
    };
    reader.readAsArrayBuffer(uploadedFile);
  };

  const currentMat = materialData[config.material as keyof typeof materialData];
  const calculatedPrice = (stats.weight * currentMat.price * (config.infill / 100 + 0.6) + 50).toFixed(2);

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* LEFT: 3D VIEWER & STATS */}
      <div className="lg:col-span-8 space-y-6">
        {!file ? (
          <label className="flex flex-col items-center justify-center h-[500px] border-2 border-dashed border-purple-500/20 rounded-[2rem] cursor-pointer hover:bg-purple-500/5 transition-all group">
            {isSlicing ? (
              <div className="flex flex-col items-center">
                <Loader2 className="animate-spin text-purple-500 mb-4" size={48} />
                <p className="text-purple-400 font-bold animate-pulse">Analyzing Mesh Geometry...</p>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 rounded-3xl bg-neutral-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Upload className="text-purple-500" size={32} />
                </div>
                <span className="text-2xl font-bold">Select 3D Model</span>
                <p className="text-gray-500 mt-2">STL or STEP formats supported (Max 50MB)</p>
                <input type="file" className="hidden" accept=".stl" onChange={handleFileUpload} />
              </>
            )}
          </label>
        ) : (
          <div className="relative h-[550px] bg-neutral-900 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
            <ModelViewer geometry={geometry} />
            
            {/* Overlay Info */}
            <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard icon={<Weight size={14}/>} label="Weight" val={`${stats.weight.toFixed(1)}g`} />
              <StatCard icon={<Ruler size={14}/>} label="Dimensions" val={`${stats.dim.x.toFixed(0)}x${stats.dim.z.toFixed(0)}mm`} />
              <StatCard icon={<Layers size={14}/>} label="Layers" val={Math.round(stats.dim.z / 0.2)} />
              <StatCard icon={<Clock size={14}/>} label="Est. Time" val={`${Math.floor(stats.time/60)}h ${Math.round(stats.time%60)}m`} />
            </div>

            <button onClick={() => setFile(null)} className="absolute top-6 right-6 p-3 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all">
              <Trash2 size={20} />
            </button>
          </div>
        )}
      </div>

      {/* RIGHT: CONFIGURATION BOX */}
      <div className="lg:col-span-4">
        <div className="bg-neutral-900 border border-white/10 rounded-[2rem] p-8 sticky top-24">
          <h3 className="text-xl font-bold mb-8">Print Settings</h3>
          
          <div className="space-y-8">
            {/* Material Select */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 block">Material Type</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(materialData).map((m) => (
                  <button 
                    key={m}
                    onClick={() => setConfig({...config, material: m})}
                    className={`py-3 rounded-xl border text-sm font-medium transition-all ${config.material === m ? 'bg-purple-600 border-purple-600 shadow-lg shadow-purple-600/20' : 'border-white/5 bg-black/40 hover:border-white/20'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Infill Select */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Infill Density</label>
                <span className="text-purple-400 font-bold">{config.infill}%</span>
              </div>
              <input 
                type="range" min="10" max="100" step="10"
                value={config.infill}
                onChange={(e) => setConfig({...config, infill: parseInt(e.target.value)})}
                className="w-full accent-purple-500 h-1.5 bg-black rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Final Price Card */}
            <div className="p-6 bg-black rounded-2xl border border-purple-500/20 mt-10">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-500 text-sm">Estimated Total</span>
                <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded">GST Incl.</span>
              </div>
              <div className="text-4xl font-extrabold text-white">
                ₹{file ? calculatedPrice : "0.00"}
              </div>
              <button className="w-full bg-white text-black py-4 rounded-xl font-bold mt-6 flex items-center justify-center gap-2 hover:bg-purple-600 hover:text-white transition-all group">
                Add to Cart <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, val }: any) {
  return (
    <div className="bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/10">
      <div className="flex items-center gap-2 text-gray-500 text-[10px] uppercase font-bold mb-1">
        {icon} {label}
      </div>
      <div className="text-sm font-bold text-white">{val}</div>
    </div>
  );
}