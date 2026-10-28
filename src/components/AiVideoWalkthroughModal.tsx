import React, { useState } from 'react';
import { X, Play, Youtube, ExternalLink, Sparkles, CheckCircle2, Video, Layers, Stethoscope, ShieldCheck, Volume2 } from 'lucide-react';

interface AiVideoWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiVideoWalkthroughModal: React.FC<AiVideoWalkthroughModalProps> = ({ isOpen, onClose }) => {
  const [activeChapter, setActiveChapter] = useState(0);
  const videoId = 'sUeTik8Sf4o';

  const chapters = [
    {
      time: '0:00',
      title: 'Introduction & DICOM Study Ingestion',
      desc: 'Seamless ingestion of PACS DICOM studies, CT/MRI scans, and radiological metadata.',
      icon: Layers,
    },
    {
      time: '0:45',
      title: 'Grad-CAM Neural Attention Heatmaps',
      desc: 'Visualizing deep neural network decision regions with adjustable opacity and windowing presets.',
      icon: Sparkles,
    },
    {
      time: '1:20',
      title: 'Multi-Label Pathology & Confidence Scores',
      desc: 'Automated prediction for Pneumonia, Cardiomegaly, Atelectasis, Effusion, and Nodule lesions.',
      icon: Stethoscope,
    },
    {
      time: '2:10',
      title: 'Automated AI Clinical Reports & Voice Studio',
      desc: 'Instant structured impression drafting powered by Gemini AI with audio clinical narration.',
      icon: Volume2,
    },
    {
      time: '3:00',
      title: 'HIPAA Compliant Email & PACS Integration',
      desc: 'Automated routing to attending physicians & patients with formatting validation checks.',
      icon: ShieldCheck,
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#080808] border border-[#1a1a1a] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden text-[#e5e5e5] flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#1a1a1a] flex items-center justify-between bg-[#050505]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600/10 border border-red-500/30 text-red-500 flex items-center justify-center">
              <Youtube className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">MedVision AI Walkthrough & Video Inspiration</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#f27d26]/10 border border-[#f27d26]/30 text-[#f27d26] text-[10px] font-mono font-bold">
                  LIVE DEMO
                </span>
              </div>
              <p className="text-[11px] text-[#737373]">Featured video demonstration of AI radiology workflow & diagnostic intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://youtu.be/${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#111111] hover:bg-[#1a1a1a] border border-[#262626] text-xs text-[#a3a3a3] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-red-500" />
              <span>Watch on YouTube</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#737373] hover:text-white hover:bg-[#111111] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Main Embedded YouTube Player */}
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-[#1a1a1a] shadow-2xl">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              title="MedVision AI Radiology Video Walkthrough"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>

          {/* Interactive Chapter Timeline */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#f27d26] uppercase font-semibold flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" />
                <span>Interactive Video Chapters & Features</span>
              </span>
              <span className="text-[10px] text-[#737373] font-mono">Select chapter to review capabilities</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {chapters.map((ch, idx) => {
                const IconComponent = ch.icon;
                const isActive = activeChapter === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveChapter(idx)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? 'bg-[#111111] border-[#f27d26]/50 text-white shadow-lg shadow-[#f27d26]/5'
                        : 'bg-[#050505] border-[#1a1a1a] text-[#a3a3a3] hover:border-[#262626] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-[#f27d26]/10 text-[#f27d26] text-[10px] font-mono font-bold">
                        {ch.time}
                      </span>
                      <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-[#f27d26]' : 'text-[#525252]'}`} />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-white mb-0.5">{ch.title}</div>
                      <div className="text-[10px] text-[#737373] leading-normal">{ch.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Platform AI Capabilities inspired by video */}
          <div className="p-4 bg-[#050505] border border-[#1a1a1a] rounded-xl space-y-3">
            <h4 className="text-xs font-mono uppercase text-[#f5f2ed] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#f27d26]" />
              <span>Key Platform Capabilities Demonstrated in Video</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#a3a3a3]">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4ade80] shrink-0 mt-0.5" />
                <span><strong>Grad-CAM Visual Explanations:</strong> Localization heatmaps for high-confidence regional detection.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4ade80] shrink-0 mt-0.5" />
                <span><strong>Automated Multi-Recipient CC Email:</strong> Direct routing to attending physician & patient with regex address validation.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4ade80] shrink-0 mt-0.5" />
                <span><strong>Dynamic Viewport & Size Adjust:</strong> Custom scaling, viewport preset heights (Compact/Large/Full), and fit modes.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4ade80] shrink-0 mt-0.5" />
                <span><strong>Gemini AI Clinical Drafting:</strong> Automated radiological impressions, differential diagnoses, and recommendation text.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1a1a1a] bg-[#050505] flex items-center justify-between">
          <span className="text-[11px] text-[#525252] font-mono">
            Inspired by MedVision AI Clinical Showcase • Video ID: {videoId}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#f27d26] hover:bg-[#e06c1b] text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Close & Continue Exploring
          </button>
        </div>
      </div>
    </div>
  );
};
