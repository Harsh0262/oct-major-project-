import React, { useState } from 'react';
import { Brain, Play, RefreshCw, CheckCircle2, Sliders, Activity } from 'lucide-react';
import { INITIAL_AI_MODELS } from '../data/mockData';
import { AIModel } from '../types';

export const AIModelsView: React.FC = () => {
  const [models, setModels] = useState<AIModel[]>(INITIAL_AI_MODELS);
  const [retrainingId, setRetrainingId] = useState<string | null>(null);
  const [confidenceThreshold, setConfidenceThreshold] = useState(75);

  const handleRetrain = (id: string) => {
    setRetrainingId(id);
    setTimeout(() => {
      setModels((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, status: 'Online', lastTrained: 'Just Now', accuracy: Number((m.accuracy + 0.2).toFixed(1)) } : m
        )
      );
      setRetrainingId(null);
    }, 2500);
  };

  return (
    <div className="p-4 max-w-[1600px] mx-auto space-y-6 text-[#e5e5e5]">
      <div className="border-b border-[#1a1a1a] pb-3 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-serif italic text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#f27d26]" />
            <span>Neural Network Model Registry</span>
          </h2>
          <p className="text-xs text-[#737373] mt-0.5">Deployed deep learning architectures and hyperparameter tuning</p>
        </div>

        <div className="flex items-center gap-3 bg-[#080808] border border-[#1a1a1a] px-3 py-1.5 rounded-xl text-xs">
          <span className="text-[#737373] font-mono text-[11px]">Confidence Threshold:</span>
          <input
            type="range"
            min="50"
            max="95"
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
            className="w-24 accent-[#f27d26] cursor-pointer"
          />
          <span className="font-mono font-bold text-[#f27d26]">{confidenceThreshold}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {models.map((model) => (
          <div
            key={model.id}
            className="bg-[#080808] border border-[#1a1a1a] rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{model.name}</span>
                  <span className="text-[10px] font-mono text-[#737373]">v{model.version}</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                    model.status === 'Online'
                      ? 'bg-[#111111] text-[#4ade80] border-[#4ade80]/40'
                      : 'bg-[#111111] text-[#f27d26] border-[#f27d26]/40 animate-pulse'
                  }`}
                >
                  {model.status}
                </span>
              </div>

              <p className="text-xs text-[#737373] mt-1">{model.architecture}</p>
              <p className="text-xs text-[#f27d26] font-mono mt-0.5">Target: {model.targetModality}</p>

              <div className="grid grid-cols-3 gap-2 bg-[#050505] p-3 rounded-xl border border-[#1a1a1a] mt-4 text-center">
                <div>
                  <p className="text-[10px] text-[#737373] font-mono">Accuracy</p>
                  <p className="text-sm font-bold text-[#4ade80] font-mono mt-0.5">{model.accuracy}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#737373] font-mono">Latency</p>
                  <p className="text-sm font-bold text-white font-mono mt-0.5">{model.latencyMs}ms</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#737373] font-mono">Uptime</p>
                  <p className="text-sm font-bold text-white font-mono mt-0.5">{model.uptimePercentage}%</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1a1a1a] flex items-center justify-between text-xs font-mono">
              <span className="text-[#737373] text-[11px]">Dataset: {model.datasetSize}</span>
              <button
                onClick={() => handleRetrain(model.id)}
                disabled={retrainingId === model.id}
                className="px-3 py-1.5 bg-[#111111] hover:bg-[#1a1a1a] text-[#e5e5e5] font-mono font-medium text-xs rounded-lg border border-[#262626] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#f27d26] ${retrainingId === model.id ? 'animate-spin' : ''}`} />
                <span>{retrainingId === model.id ? 'Retraining...' : 'Trigger Fine-Tuning'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
