import React from 'react';
import { BarChart3, TrendingUp, Cpu, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const accuracyData = [
    { time: '00:00', accuracy: 95.8, latency: 1.3 },
    { time: '04:00', accuracy: 96.1, latency: 1.2 },
    { time: '08:00', accuracy: 96.4, latency: 1.1 },
    { time: '12:00', accuracy: 96.2, latency: 1.2 },
    { time: '16:00', accuracy: 96.8, latency: 1.0 },
    { time: '20:00', accuracy: 96.4, latency: 1.2 },
  ];

  const pathologyData = [
    { name: 'Pneumonia', count: 88, fill: '#f27d26' },
    { name: 'Lung Nodule', count: 64, fill: '#38bdf8' },
    { name: 'Effusion', count: 42, fill: '#c084fc' },
    { name: 'Cardiomegaly', count: 31, fill: '#facc15' },
    { name: 'Normal', count: 112, fill: '#404040' },
  ];

  const severityData = [
    { name: 'Critical', value: 18, color: '#ef4444' },
    { name: 'High', value: 34, color: '#f27d26' },
    { name: 'Moderate', value: 72, color: '#eab308' },
    { name: 'Normal', value: 123, color: '#4ade80' },
  ];

  return (
    <div className="p-4 max-w-[1600px] mx-auto space-y-6 text-[#e5e5e5]">
      <div className="border-b border-[#1a1a1a] pb-3">
        <h2 className="text-2xl font-serif italic text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#f27d26]" />
          <span>Platform Intelligence & Model Analytics</span>
        </h2>
        <p className="text-xs text-[#737373] mt-0.5">Real-time throughput, accuracy tracking, and pathology distribution</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Chart 1: Accuracy Curve (8 cols) */}
        <div className="lg:col-span-8 bg-[#080808] border border-[#1a1a1a] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#737373]">24H Diagnostic Accuracy Trend (%)</h3>
              <p className="text-[11px] text-[#737373] mt-0.5">Model CNN-V4 validation accuracy compared against radiologist ground truth</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#4ade80] bg-[#111111] px-2.5 py-1 rounded-lg border border-[#262626]">
              Mean: 96.4%
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={accuracyData}>
                <defs>
                  <linearGradient id="accuracyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f27d26" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f27d26" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis dataKey="time" stroke="#737373" fontSize={11} />
                <YAxis domain={[90, 100]} stroke="#737373" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#080808', borderColor: '#1a1a1a', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="accuracy" stroke="#f27d26" strokeWidth={2} fill="url(#accuracyGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Severity Distribution Donut (4 cols) */}
        <div className="lg:col-span-4 bg-[#080808] border border-[#1a1a1a] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#737373] mb-2">Severity Distribution</h3>

          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#080808', borderColor: '#1a1a1a', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-[#1a1a1a]">
            {severityData.map((s) => (
              <div key={s.name} className="flex items-center gap-2 font-mono">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-[#737373]">{s.name}:</span>
                <span className="text-white font-bold">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Pathology Volume Bar Chart (12 cols) */}
        <div className="lg:col-span-12 bg-[#080808] border border-[#1a1a1a] rounded-2xl p-5 shadow-xl">
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#737373] mb-2">Diagnostic Scan Volume by Detected Pathology</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pathologyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis dataKey="name" stroke="#737373" fontSize={11} />
                <YAxis stroke="#737373" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#080808', borderColor: '#1a1a1a', borderRadius: '12px' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#f27d26" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
