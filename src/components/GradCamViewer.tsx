import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Sun,
  Contrast,
  RotateCcw,
  Eye,
  EyeOff,
  Maximize2,
  Sliders,
  Layers,
  Sparkles,
  Columns,
  Square,
  Scaling,
} from 'lucide-react';
import { ScanAnalysis } from '../types';
import { generateMedicalScanSvg } from '../data/mockData';

interface GradCamViewerProps {
  scan: ScanAnalysis;
  allScans: ScanAnalysis[];
  onSelectScan: (scan: ScanAnalysis) => void;
}

export const GradCamViewer: React.FC<GradCamViewerProps> = ({
  scan,
  allScans,
  onSelectScan,
}) => {
  const [gradCamOn, setGradCamOn] = useState(scan.gradCamOn ?? true);
  const [opacity, setOpacity] = useState(65);
  const [splitView, setSplitView] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [originalScale, setOriginalScale] = useState(100);
  const [heatmapScale, setHeatmapScale] = useState(100);
  const [showViewerTools, setShowViewerTools] = useState(true);
  const [showScanInfo, setShowScanInfo] = useState(true);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [inverted, setInverted] = useState(false);
  const [windowPreset, setWindowPreset] = useState<'default' | 'bone' | 'lung' | 'soft'>('default');

  // Size Adjustment Options
  const [frameSize, setFrameSize] = useState<'compact' | 'standard' | 'large' | 'full'>('standard');
  const [fitMode, setFitMode] = useState<'contain' | 'cover' | 'actual'>('contain');
  const [showSizeMenu, setShowSizeMenu] = useState(false);

  const handleReset = () => {
    setZoomLevel(1);
    setOriginalScale(100);
    setHeatmapScale(100);
    setBrightness(100);
    setContrast(100);
    setInverted(false);
    setWindowPreset('default');
    setOpacity(65);
    setFrameSize('standard');
    setFitMode('contain');
  };

  // Compute CSS filter string
  let filterStr = `brightness(${brightness}%) contrast(${contrast}%)`;
  if (inverted) filterStr += ` invert(100%)`;

  if (windowPreset === 'bone') filterStr += ` contrast(160%) brightness(110%)`;
  else if (windowPreset === 'lung') filterStr += ` contrast(130%) brightness(85%)`;
  else if (windowPreset === 'soft') filterStr += ` contrast(90%) brightness(105%)`;

  // Determine height classes based on frameSize
  const containerHeightClass =
    frameSize === 'compact'
      ? 'min-h-[260px] h-[260px]'
      : frameSize === 'large'
      ? 'min-h-[480px] h-[480px]'
      : frameSize === 'full'
      ? 'min-h-[620px] h-[620px]'
      : 'min-h-[360px] h-[360px]';

  const imgMaxHeight =
    frameSize === 'compact'
      ? 220
      : frameSize === 'large'
      ? 430
      : frameSize === 'full'
      ? 560
      : 320;

  // Determine standard original vs heatmap SVG or uploaded image
  const scanModalityType = scan.modality === 'CT' ? 'ct_scan' : scan.modality === 'MRI' ? 'brain_mri' : 'chest_xray';

  const originalSvg = generateMedicalScanSvg(scanModalityType, false);
  const heatmapSvg = generateMedicalScanSvg(scanModalityType, true, opacity / 100);

  // Determine if image is a raster image (JPG, PNG, Data URL) or generated SVG string
  const isRasterImage =
    !scan.fullImageUrl.includes('data:image/svg+xml') &&
    !scan.fullImageUrl.startsWith('<svg') &&
    (scan.fullImageUrl.includes('.jpg') ||
      scan.fullImageUrl.includes('.jpeg') ||
      scan.fullImageUrl.includes('.png') ||
      scan.fullImageUrl.startsWith('data:image/') ||
      scan.fullImageUrl.startsWith('/'));

  return (
    <div className="bg-[#080808] border border-[#1a1a1a] rounded-2xl p-4 flex flex-col justify-between shadow-xl h-full transition-all duration-300">
      {/* Top Card Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#737373] flex items-center gap-2">
          <span>AI Analysis Result</span>
          <span className="text-[10px] text-[#f27d26] font-normal border border-[#f27d26]/30 bg-[#f27d26]/10 px-1.5 py-0.5 rounded">
            {Math.round(zoomLevel * 100)}% Scale
          </span>
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {/* Size Adjust Toggle Button */}
          <button
            onClick={() => setShowSizeMenu(!showSizeMenu)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-colors flex items-center gap-1.5 cursor-pointer ${
              showSizeMenu ? 'bg-[#f27d26] text-white border-[#f27d26]' : 'bg-[#111111] text-white border-[#262626] hover:border-[#f27d26]/50'
            }`}
            title="Adjust Canvas & Image Viewport Size"
          >
            <Scaling className="w-3.5 h-3.5 text-[#f27d26]" />
            <span>Size Adjust</span>
          </button>

          <button
            onClick={() => {
              const nextSplitView = !splitView;
              setSplitView(nextSplitView);
              if (nextSplitView) setShowSizeMenu(true);
            }}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-colors flex items-center gap-1.5 cursor-pointer ${
              splitView ? 'bg-[#111111] text-[#f27d26] border-[#f27d26]/40' : 'bg-[#050505] text-[#737373] border-[#1a1a1a] hover:text-white'
            }`}
          >
            {splitView ? <Square className="w-3 h-3" /> : <Columns className="w-3 h-3" />}
            {splitView ? 'Single View' : 'Split Comparison'}
          </button>

          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#111111] border border-[#262626] text-[#4ade80] text-[11px] font-mono">
            <Sparkles className="w-3 h-3 text-[#4ade80]" />
            Analyzed
          </span>
        </div>
      </div>

      {/* Expandable Size Adjustment Option Bar */}
      {showSizeMenu && (
        <div className="mb-3 bg-[#050505] border border-[#f27d26]/30 rounded-xl p-3 text-xs space-y-2.5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#f27d26] font-bold flex items-center gap-1.5">
              <Scaling className="w-3.5 h-3.5" />
              <span>Viewport & Image Size Configuration</span>
            </span>
            <button
              onClick={() => setShowSizeMenu(false)}
              className="text-[#737373] hover:text-white text-[10px] font-mono"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
            {/* Viewport Frame Size */}
            <div>
              <label className="block text-[#737373] text-[10px] mb-1">Canvas Frame Size</label>
              <div className="grid grid-cols-4 gap-1">
                {(['compact', 'standard', 'large', 'full'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setFrameSize(sz)}
                    className={`py-1 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer border ${
                      frameSize === sz
                        ? 'bg-[#f27d26] text-white border-[#f27d26]'
                        : 'bg-[#080808] text-[#a3a3a3] border-[#1a1a1a] hover:bg-[#111111]'
                    }`}
                  >
                    {sz.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Scale % presets */}
            <div>
              <label className="block text-[#737373] text-[10px] mb-1">Scale Preset ({Math.round(zoomLevel * 100)}%)</label>
              <div className="grid grid-cols-4 gap-1">
                {[0.75, 1.0, 1.5, 2.0].map((sc) => (
                  <button
                    key={sc}
                    onClick={() => setZoomLevel(sc)}
                    className={`py-1 rounded text-[10px] font-bold transition-colors cursor-pointer border ${
                      zoomLevel === sc
                        ? 'bg-[#38bdf8] text-black border-[#38bdf8]'
                        : 'bg-[#080808] text-[#a3a3a3] border-[#1a1a1a] hover:bg-[#111111]'
                    }`}
                  >
                    {Math.round(sc * 100)}%
                  </button>
                ))}
              </div>
            </div>

            {/* Image Fit Mode */}
            <div>
              <label className="block text-[#737373] text-[10px] mb-1">Image Fit Mode</label>
              <div className="grid grid-cols-3 gap-1">
                {(['contain', 'cover', 'actual'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setFitMode(mode)}
                    className={`py-1 rounded text-[10px] font-bold capitalize transition-colors cursor-pointer border ${
                      fitMode === mode
                        ? 'bg-[#4ade80] text-black border-[#4ade80]'
                        : 'bg-[#080808] text-[#a3a3a3] border-[#1a1a1a] hover:bg-[#111111]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scale Slider */}
          <div className="flex items-center gap-3 pt-1 border-t border-[#1a1a1a]">
            <span className="text-[10px] text-[#737373] font-mono shrink-0">Fine Scale:</span>
            <input
              type="range"
              min="50"
              max="250"
              step="5"
              value={Math.round(zoomLevel * 100)}
              onChange={(e) => setZoomLevel(Number(e.target.value) / 100)}
              className="flex-1 h-1 bg-[#1a1a1a] accent-[#f27d26] rounded appearance-none cursor-pointer"
            />
            <span className="text-[10px] text-[#f27d26] font-mono font-bold w-12 text-right">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => {
                setZoomLevel(1);
                setOriginalScale(100);
                setHeatmapScale(100);
              }}
              className="px-2 py-0.5 bg-[#111111] hover:bg-[#1a1a1a] border border-[#262626] text-[10px] font-mono text-[#a3a3a3] rounded cursor-pointer"
            >
              Reset 1:1
            </button>
          </div>
        </div>
      )}

      {/* Main Image Display Box */}
      <div className={`relative flex-1 bg-[#050505] rounded-xl border border-[#1a1a1a] overflow-hidden ${containerHeightClass} flex items-center justify-center group select-none p-2 transition-all duration-300`}>
        {/* Left Side Interactive Toolbar */}
        <div className={`absolute left-3 ${showViewerTools ? 'top-3 bottom-3' : 'top-3'} z-20 flex flex-col justify-between bg-[#080808]/90 backdrop-blur-md border border-[#1a1a1a] rounded-lg p-1.5 text-[#737373]`}>
          <button
            type="button"
            role="switch"
            aria-checked={showViewerTools}
            aria-label="Show viewer tools"
            onClick={() => setShowViewerTools((visible) => !visible)}
            className="flex items-center gap-2 rounded px-1 py-1 text-[9px] font-mono font-bold text-[#a3a3a3] hover:bg-[#111111] cursor-pointer"
            title={showViewerTools ? 'Hide viewer tools' : 'Show viewer tools'}
          >
            <span>TOOLS</span>
            <span className={`relative h-3.5 w-6 rounded-full transition-colors ${showViewerTools ? 'bg-[#f27d26]' : 'bg-[#404040]'}`}>
              <span className={`absolute top-0.5 h-2.5 w-2.5 rounded-full bg-white transition-transform ${showViewerTools ? 'translate-x-3' : 'translate-x-0.5'}`} />
            </span>
          </button>
          {showViewerTools && <>
          <div className="space-y-1">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
              className="p-1.5 rounded hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.5))}
              className="p-1.5 rounded hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setFrameSize((s) => (s === 'standard' ? 'large' : s === 'large' ? 'full' : s === 'full' ? 'compact' : 'standard'))}
              className="p-1.5 rounded hover:bg-[#111111] hover:text-[#f27d26] transition-colors cursor-pointer"
              title={`Toggle Canvas Height (${frameSize.toUpperCase()})`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setBrightness((b) => (b === 100 ? 130 : b === 130 ? 70 : 100))}
              className="p-1.5 rounded hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
              title="Adjust Brightness"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setContrast((c) => (c === 100 ? 150 : c === 150 ? 80 : 100))}
              className="p-1.5 rounded hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
              title="Adjust Contrast"
            >
              <Contrast className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setInverted(!inverted)}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                inverted ? 'bg-[#f27d26] text-white font-bold' : 'hover:bg-[#111111] hover:text-white'
              }`}
              title="Invert Image"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            <button
              onClick={() =>
                setWindowPreset((p) =>
                  p === 'default' ? 'lung' : p === 'lung' ? 'bone' : p === 'bone' ? 'soft' : 'default'
                )
              }
              className="p-1 text-[10px] font-mono font-bold rounded hover:bg-[#111111] text-[#f27d26] cursor-pointer"
              title="Windowing Preset"
            >
              {windowPreset === 'default' ? 'DEF' : windowPreset.toUpperCase().slice(0, 3)}
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
          </>}
        </div>

        {/* Anatomical Orientation Markers */}
        <span className="absolute top-3 left-14 font-mono font-bold text-[#737373] text-xs z-10">
          R
        </span>

        {/* Image Render Layer - Split vs Single Mode */}
        {splitView ? (
          <div className="w-full h-full grid grid-cols-2 gap-2 p-2 max-w-full">
            {/* Left: Original Radiograph */}
            <div className="relative min-w-0 bg-black rounded-lg border border-[#1a1a1a] overflow-hidden flex flex-col items-center justify-center p-1">
              <span className="absolute top-2 left-2 z-10 bg-[#080808]/80 text-[#a3a3a3] text-[9px] font-mono px-2 py-0.5 rounded border border-[#1a1a1a]">
                ORIGINAL
              </span>
              <div style={{ transform: `scale(${zoomLevel * originalScale / 100})`, filter: filterStr }} className="w-full h-full flex items-center justify-center transition-transform duration-200">
                <img
                  src={isRasterImage ? scan.fullImageUrl : originalSvg}
                  alt="Original Radiograph"
                  style={{
                    maxHeight: `${imgMaxHeight}px`,
                    objectFit: fitMode === 'actual' ? 'none' : fitMode,
                  }}
                  className="w-auto pointer-events-none transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <label className="absolute bottom-2 left-2 right-2 z-10 flex items-center gap-2 rounded-md border border-[#262626] bg-[#080808]/90 px-2 py-1 text-[9px] font-mono text-[#a3a3a3]">
                <span className="shrink-0">Size</span>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="5"
                  value={originalScale}
                  onChange={(event) => setOriginalScale(Number(event.target.value))}
                  aria-label="Original image size"
                  className="min-w-0 flex-1 accent-[#f27d26] cursor-pointer"
                />
                <span className="w-8 shrink-0 text-right text-[#f27d26]">{originalScale}%</span>
              </label>
            </div>

            {/* Right: Grad-CAM Heatmap Overlay */}
            <div className="relative min-w-0 bg-black rounded-lg border border-[#1a1a1a] overflow-hidden flex flex-col items-center justify-center p-1">
              <span className="absolute top-2 left-2 z-10 bg-[#f27d26]/20 text-[#f27d26] text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-[#f27d26]/30">
                HEATMAP OVERLAY
              </span>
              <div style={{ transform: `scale(${zoomLevel * heatmapScale / 100})`, filter: filterStr }} className="w-full h-full flex items-center justify-center relative transition-transform duration-200">
                <img
                  src={isRasterImage ? scan.fullImageUrl : heatmapSvg}
                  alt="Grad-CAM Overlay"
                  style={{
                    maxHeight: `${imgMaxHeight}px`,
                    objectFit: fitMode === 'actual' ? 'none' : fitMode,
                  }}
                  className="w-auto pointer-events-none transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
                {isRasterImage && (
                  <div
                    className="absolute inset-0 pointer-events-none flex items-center justify-center"
                    style={{
                      background: `radial-gradient(circle at 60% 50%, rgba(239,68,68,${(opacity / 100) * 0.9}), rgba(249,115,22,${(opacity / 100) * 0.6}) 40%, rgba(234,179,8,${(opacity / 100) * 0.3}) 70%, transparent 100%)`,
                      mixBlendMode: 'screen',
                    }}
                  />
                )}
              </div>
              <label className="absolute bottom-2 left-2 right-2 z-10 flex items-center gap-2 rounded-md border border-[#262626] bg-[#080808]/90 px-2 py-1 text-[9px] font-mono text-[#a3a3a3]">
                <span className="shrink-0">Size</span>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="5"
                  value={heatmapScale}
                  onChange={(event) => setHeatmapScale(Number(event.target.value))}
                  aria-label="Heatmap image size"
                  className="min-w-0 flex-1 accent-[#f27d26] cursor-pointer"
                />
                <span className="w-8 shrink-0 text-right text-[#f27d26]">{heatmapScale}%</span>
              </label>
            </div>
          </div>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-200 relative"
            style={{
              transform: `scale(${zoomLevel})`,
              filter: filterStr,
            }}
          >
            <img
              src={gradCamOn ? (isRasterImage ? scan.fullImageUrl : heatmapSvg) : (isRasterImage ? scan.fullImageUrl : originalSvg)}
              alt={scan.study}
              style={{
                maxHeight: `${imgMaxHeight}px`,
                objectFit: fitMode === 'actual' ? 'none' : fitMode,
              }}
              className="w-auto pointer-events-none transition-all duration-300"
              referrerPolicy="no-referrer"
            />
            {isRasterImage && gradCamOn && (
              <div
                className="absolute inset-0 pointer-events-none flex items-center justify-center"
                style={{
                  background: `radial-gradient(circle at 60% 50%, rgba(239,68,68,${(opacity / 100) * 0.9}), rgba(249,115,22,${(opacity / 100) * 0.6}) 40%, rgba(234,179,8,${(opacity / 100) * 0.3}) 70%, transparent 100%)`,
                  mixBlendMode: 'screen',
                }}
              />
            )}
          </div>
        )}

        {/* Top-Right Overlaid Patient & Scan Metadata */}
        <div className="absolute top-3 right-3 z-20 bg-[#080808]/90 backdrop-blur-md border border-[#1a1a1a] rounded-lg p-2.5 text-[10px] text-[#e5e5e5] font-mono space-y-1 max-w-[190px] shadow-2xl">
          <button
            type="button"
            role="switch"
            aria-checked={showScanInfo}
            aria-label="Show scan information"
            onClick={() => setShowScanInfo((visible) => !visible)}
            className="w-full flex items-center justify-between gap-3 rounded px-1 py-1 text-[9px] font-bold text-[#a3a3a3] hover:bg-[#111111] cursor-pointer"
            title={showScanInfo ? 'Hide scan information' : 'Show scan information'}
          >
            <span>SCAN INFO</span>
            <span className={`relative h-3.5 w-6 rounded-full transition-colors ${showScanInfo ? 'bg-[#f27d26]' : 'bg-[#404040]'}`}>
              <span className={`absolute top-0.5 h-2.5 w-2.5 rounded-full bg-white transition-transform ${showScanInfo ? 'translate-x-3' : 'translate-x-0.5'}`} />
            </span>
          </button>
          {showScanInfo && <>
          <div className="flex items-center justify-between text-[#737373]">
            <span>ID</span>
            <span className="text-white font-bold">{scan.id}</span>
          </div>
          <div className="flex items-center justify-between text-[#737373]">
            <span>DOB</span>
            <span className="text-[#a3a3a3]">{scan.patientDob || 'May 14, 1968'}</span>
          </div>
          <div className="flex items-center justify-between text-[#737373]">
            <span>Age / Sex</span>
            <span className="text-[#a3a3a3]">{scan.patientAge || 56} / {scan.patientGender || 'Male'}</span>
          </div>
          <div className="flex items-center justify-between text-[#737373]">
            <span>Modality</span>
            <span className="text-[#f27d26] font-medium">{scan.modality}</span>
          </div>
          <div className="flex items-center justify-between text-[#737373] pt-1 border-t border-[#1a1a1a]">
            <span>Grad-CAM</span>
            <button
              onClick={() => setGradCamOn(!gradCamOn)}
              className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                gradCamOn
                  ? 'bg-[#f27d26] text-white'
                  : 'bg-[#111111] text-[#737373] border border-[#262626]'
              }`}
            >
              {gradCamOn ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
              {gradCamOn ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Opacity Slider */}
          <div className="pt-1 border-t border-[#1a1a1a] space-y-1">
            <div className="flex items-center justify-between text-[9px] text-[#737373]">
              <span>Opacity</span>
              <span className="text-[#f27d26] font-bold">{opacity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full h-1 bg-[#1a1a1a] accent-[#f27d26] rounded appearance-none cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between text-[#737373] pt-1">
            <span>AI Model</span>
            <span className="text-[#4ade80] font-medium">{scan.aiModel}</span>
          </div>
          <div className="text-[9px] text-[#404040] pt-0.5">
            {scan.acquiredTime}
          </div>
          </>}
        </div>
      </div>

      {/* Bottom Thumbnail Strip */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {allScans.map((item) => {
          const isSelected = item.id === scan.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectScan(item)}
              className={`relative w-14 h-14 rounded-lg overflow-hidden border shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#f27d26] ring-2 ring-[#f27d26]/30'
                  : 'border-[#1a1a1a] opacity-60 hover:opacity-100 hover:border-[#262626]'
              }`}
            >
              <img src={item.thumbnailUrl} alt={item.study} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              {isSelected && (
                <div className="absolute inset-0 bg-[#f27d26]/10 pointer-events-none" />
              )}
            </button>
          );
        })}

        {/* "+7" indicator badge */}
        <div className="w-12 h-14 rounded-lg border border-[#1a1a1a] bg-[#050505] flex flex-col items-center justify-center text-[#737373] text-xs font-bold shrink-0 cursor-pointer hover:bg-[#111111] transition-colors font-mono">
          <span>+7</span>
          <span className="text-[8px] text-[#404040] font-normal">slices</span>
        </div>
      </div>
    </div>
  );
};
