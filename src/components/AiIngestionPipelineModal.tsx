import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  FileSearch,
  Cpu,
  Layers,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  ShieldCheck,
  Activity,
  AlertTriangle,
} from 'lucide-react';

interface AiIngestionPipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  patientName?: string;
  modality?: string;
}

export const AiIngestionPipelineModal: React.FC<AiIngestionPipelineModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  patientName = 'Rajesh Kumar',
  modality = 'XR - Chest Radiography',
}) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);

  const stages = [
    {
      id: 0,
      title: 'Reading DICOM Header',
      subtitle: 'Extracting metadata & de-identifying PHI elements',
      icon: FileSearch,
      duration: 18, // ticks
      logMessage: 'DICOM Tag 0020,000D Ingested • De-identifying Patient Demographics • Pixel Array (512x512 Mono2)',
    },
    {
      id: 1,
      title: 'CNN Feature Extraction',
      subtitle: 'Dense block multi-scale spatial feature maps',
      icon: Cpu,
      duration: 25,
      logMessage: 'CNN ResNet-51 Pass • Extracting 1024 Bottleneck Features • Computing Attention Kernels',
    },
    {
      id: 2,
      title: 'Grad-CAM Computation',
      subtitle: 'Generating activation heatmaps & region scoring',
      icon: Layers,
      duration: 22,
      logMessage: 'Grad-CAM Guided Backprop • Localization Map Generated • Peak Activation (x: 312, y: 240)',
    },
    {
      id: 3,
      title: 'Diagnostic Sign-off',
      subtitle: 'Drafting structured report & clinical recommendations',
      icon: ShieldCheck,
      duration: 15,
      logMessage: 'Pneumonia Logits 0.964 • Structuring Impression & Differential • Sign-off Complete',
    },
  ];

  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          if (currentStage < stages.length - 1) {
            const nextStage = currentStage + 1;
            setCurrentStage(nextStage);
            setLogs((prev) => [...prev, stages[nextStage].logMessage]);
            return 0;
          } else {
            setIsPlaying(false);
            if (onComplete) setTimeout(onComplete, 800);
            return 100;
          }
        }
        return prevProgress + 4;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, currentStage, onComplete]);

  // Reset pipeline
  const handleReset = () => {
    setCurrentStage(0);
    setProgress(0);
    setIsPlaying(true);
    setLogs([stages[0].logMessage]);
  };

  // Skip to finish
  const handleFastForward = () => {
    setCurrentStage(3);
    setProgress(100);
    setIsPlaying(false);
    setLogs(stages.map((s) => s.logMessage));
  };

  if (!isOpen) return null;

  const totalPercent = Math.min(
    100,
    Math.round(((currentStage * 100 + progress) / (stages.length * 100)) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#080808] border border-[#1a1a1a] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden text-[#e5e5e5] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#1a1a1a] bg-[#050505] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#f27d26]/10 border border-[#f27d26]/30 text-[#f27d26] flex items-center justify-center">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span>Multi-Stage AI Diagnosis Ingestion</span>
                <span className="px-2 py-0.5 rounded-full bg-[#38bdf8]/10 text-[#38bdf8] text-[10px] font-mono font-bold border border-[#38bdf8]/30">
                  {totalPercent}%
                </span>
              </h3>
              <p className="text-[11px] text-[#737373]">
                Patient: <strong className="text-white">{patientName}</strong> • Study: {modality}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#737373] hover:text-white hover:bg-[#111111] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-6 text-xs">
          {/* Total Pipeline Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#a3a3a3] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#f27d26]" />
                Overall Pipeline Status
              </span>
              <span className="text-[#f27d26] font-bold">{totalPercent}% Complete</span>
            </div>
            <div className="w-full h-2.5 bg-[#050505] border border-[#1a1a1a] rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#f27d26] via-[#38bdf8] to-[#4ade80] rounded-full transition-all duration-300"
                style={{ width: `${totalPercent}%` }}
              />
            </div>
          </div>

          {/* Stepper Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            {stages.map((st, idx) => {
              const IconComp = st.icon;
              const isCompleted = idx < currentStage || (idx === currentStage && progress === 100);
              const isCurrent = idx === currentStage && progress < 100;

              return (
                <div
                  key={st.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isCompleted
                      ? 'bg-[#050505] border-[#4ade80]/40 text-[#4ade80]'
                      : isCurrent
                      ? 'bg-[#111111] border-[#f27d26] text-white shadow-lg shadow-[#f27d26]/10 scale-[1.02]'
                      : 'bg-[#050505] border-[#1a1a1a] text-[#525252]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold opacity-70">
                      STEP 0{idx + 1}
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-[#4ade80]" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-[#f27d26] animate-ping" />
                    ) : (
                      <IconComp className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="font-semibold text-xs text-white mb-0.5">{st.title}</div>
                  <div className="text-[9px] text-[#737373] leading-tight">{st.subtitle}</div>

                  {/* Individual step progress */}
                  {isCurrent && (
                    <div className="mt-2 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#f27d26] transition-all duration-100"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Real-time Stage Log Stream */}
          <div className="bg-[#050505] border border-[#1a1a1a] rounded-xl p-3.5 font-mono text-[11px] space-y-2">
            <div className="flex items-center justify-between text-[#737373] text-[10px] uppercase border-b border-[#1a1a1a] pb-1.5">
              <span>Diagnostic Pipeline Real-time Stream</span>
              <span className="text-[#4ade80] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                Live Feed
              </span>
            </div>

            <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
              {logs.map((log, i) => (
                <div key={i} className="flex items-start gap-2 text-[#a3a3a3] animate-fadeIn">
                  <span className="text-[#f27d26] font-bold">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#1a1a1a] bg-[#050505] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg bg-[#111111] hover:bg-[#1a1a1a] border border-[#262626] text-white transition-colors cursor-pointer"
              title={isPlaying ? 'Pause Pipeline' : 'Play Pipeline'}
            >
              {isPlaying ? <Pause className="w-4 h-4 text-[#f27d26]" /> : <Play className="w-4 h-4 text-[#4ade80]" />}
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-lg bg-[#111111] hover:bg-[#1a1a1a] border border-[#262626] text-[#a3a3a3] hover:text-white transition-colors cursor-pointer"
              title="Restart Pipeline"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleFastForward}
              className="px-3 py-1.5 rounded-lg bg-[#111111] hover:bg-[#1a1a1a] border border-[#262626] text-xs text-[#a3a3a3] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 font-mono"
            >
              <FastForward className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Fast-forward</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#f27d26] hover:bg-[#e06c1b] text-white font-medium text-xs transition-colors cursor-pointer"
          >
            {totalPercent === 100 ? 'View Diagnostic Results' : 'Close & Run in Background'}
          </button>
        </div>
      </div>
    </div>
  );
};
