import React, { useState } from 'react';
import { Cpu } from 'lucide-react';

interface NetworkTopologyProps {
  interactive?: boolean;
}

const stages = [
  { name: 'DICOM', title: 'Input DICOM', details: 'Image input and normalization', color: '#38bdf8' },
  { name: 'CONV', title: 'Conv2D Block', details: 'Extracts edges and local image features', color: '#f27d26' },
  { name: 'RESNET', title: 'ResNet Layers', details: 'Builds deeper anatomical feature maps', color: '#a855f7' },
  { name: 'CLASS', title: 'Classifier', details: 'Scores the supported pathology classes', color: '#ec4899' },
  { name: 'CAM', title: 'Grad-CAM', details: 'Highlights image regions influencing the output', color: '#4ade80' },
];

export const NetworkTopology: React.FC<NetworkTopologyProps> = ({ interactive = true }) => {
  const [selectedStage, setSelectedStage] = useState(0);
  const selected = stages[selectedStage];

  return (
    <section
      className="w-full rounded-xl border border-[#1a1a1a] bg-[#050505] p-2.5"
      aria-label="CNN-V4 model pipeline"
    >
      <header className="mb-3 flex items-center justify-between border-b border-[#1a1a1a] pb-2">
        <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-wide text-[#a3a3a3]">
          <Cpu className="h-3.5 w-3.5 text-[#f27d26]" />
          CNN-V4 Pipeline
        </div>
        <span className="text-[9px] font-mono text-[#737373]">
          {selectedStage + 1} / {stages.length}
        </span>
      </header>

      <ol className="flex items-start">
        {stages.map((stage, index) => {
          const isSelected = index === selectedStage;
          const isComplete = index < selectedStage;

          return (
            <li key={stage.name} className="flex min-w-0 flex-1 items-start">
              <button
                type="button"
                disabled={!interactive}
                aria-label={`Stage ${index + 1}: ${stage.title}`}
                aria-pressed={isSelected}
                title={stage.title}
                onClick={() => setSelectedStage(index)}
                className="flex min-w-0 flex-col items-center gap-1.5 disabled:cursor-default enabled:cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f27d26]"
              >
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full border text-[9px] font-mono font-bold"
                  style={{
                    color: isSelected || isComplete ? stage.color : '#737373',
                    borderColor: isSelected || isComplete ? stage.color : '#404040',
                    backgroundColor: isSelected ? `${stage.color}20` : 'transparent',
                  }}
                >
                  {index + 1}
                </span>
                <span
                  className="w-full truncate text-center text-[7px] font-mono"
                  style={{ color: isSelected ? stage.color : '#737373' }}
                >
                  {stage.name}
                </span>
              </button>
              {index < stages.length - 1 && (
                <span
                  aria-hidden="true"
                  className="mt-3 h-px flex-1"
                  style={{ backgroundColor: isComplete ? stage.color : '#262626' }}
                />
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-3 border-t border-[#1a1a1a] pt-2" aria-live="polite">
        <p className="text-[10px] font-semibold" style={{ color: selected.color }}>
          {selected.title}
        </p>
        <p className="mt-0.5 text-[9px] leading-4 text-[#737373]">{selected.details}</p>
      </div>
    </section>
  );
};
