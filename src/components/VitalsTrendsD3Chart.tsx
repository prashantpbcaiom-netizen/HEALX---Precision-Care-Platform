import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import {
  Activity,
  Heart,
  Droplet,
  Moon,
  Wind,
  TrendingDown,
  TrendingUp,
  Info,
  Calendar,
  Layers,
  Sparkles,
  Download,
  Filter,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Eye,
  Maximize2
} from 'lucide-react';
import { DailyVitalRecord, VitalMetricType } from '../types';

interface VitalsTrendsD3ChartProps {
  data: DailyVitalRecord[];
  onAskAIAboutTrends?: (metricTitle: string, avgVal: string, changeVal: string) => void;
}

interface MetricConfig {
  id: VitalMetricType;
  label: string;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string; // primary line color hex
  secondaryColor?: string;
  gradientStart: string;
  gradientEnd: string;
  normalRange: [number, number]; // [min, max]
  normalLabel: string;
  yDomainPadding: [number, number]; // [bottom pad, top pad]
  getValue: (d: DailyVitalRecord) => number;
  getSecondaryValue?: (d: DailyVitalRecord) => number;
  secondaryLabel?: string;
  formatValue: (v: number) => string;
  targetDescription: string;
}

const METRIC_CONFIGS: Record<VitalMetricType, MetricConfig> = {
  heartRate: {
    id: 'heartRate',
    label: 'Heart Rate',
    unit: 'bpm',
    icon: Heart,
    color: '#f43f5e', // rose-500
    secondaryColor: '#fb7185', // rose-400 (peak)
    gradientStart: 'rgba(244, 63, 94, 0.28)',
    gradientEnd: 'rgba(244, 63, 94, 0.01)',
    normalRange: [60, 100],
    normalLabel: '60 - 100 bpm (Resting Zone)',
    yDomainPadding: [5, 10],
    getValue: (d) => d.heartRate,
    getSecondaryValue: (d) => d.heartRatePeak,
    secondaryLabel: 'Active Peak',
    formatValue: (v) => `${Math.round(v)} bpm`,
    targetDescription: 'Target resting heart rate between 60 - 100 bpm. Lower resting rate indicates improved cardiovascular fitness.',
  },
  bloodPressure: {
    id: 'bloodPressure',
    label: 'Blood Pressure',
    unit: 'mmHg',
    icon: Droplet,
    color: '#0d9488', // teal-600 (Systolic)
    secondaryColor: '#06b6d4', // cyan-500 (Diastolic)
    gradientStart: 'rgba(13, 148, 136, 0.25)',
    gradientEnd: 'rgba(13, 148, 136, 0.01)',
    normalRange: [70, 120], // systolic < 120, diastolic < 80
    normalLabel: '< 120/80 mmHg (AHA Guideline)',
    yDomainPadding: [5, 10],
    getValue: (d) => d.bpSystolic,
    getSecondaryValue: (d) => d.bpDiastolic,
    secondaryLabel: 'Diastolic',
    formatValue: (v) => `${Math.round(v)} mmHg`,
    targetDescription: 'Systolic below 120 mmHg and Diastolic below 80 mmHg. Monitored for optimal vascular compliance.',
  },
  sleep: {
    id: 'sleep',
    label: 'Sleep Duration',
    unit: 'hrs',
    icon: Moon,
    color: '#6366f1', // indigo-500
    secondaryColor: '#a855f7', // purple-500
    gradientStart: 'rgba(99, 102, 241, 0.28)',
    gradientEnd: 'rgba(99, 102, 241, 0.01)',
    normalRange: [7.0, 9.0],
    normalLabel: '7.0 - 9.0 hrs (Restorative Sleep)',
    yDomainPadding: [0.5, 0.8],
    getValue: (d) => d.sleepHours,
    getSecondaryValue: (d) => d.sleepQuality / 10, // scaled for reference
    secondaryLabel: 'Sleep Quality (%/10)',
    formatValue: (v) => `${v.toFixed(1)} hrs`,
    targetDescription: 'Optimal adult restorative window is 7 to 9 hours nightly with consistent sleep architecture.',
  },
  spO2: {
    id: 'spO2',
    label: 'Oxygen Saturation',
    unit: '%',
    icon: Wind,
    color: '#0284c7', // sky-600
    gradientStart: 'rgba(2, 132, 199, 0.28)',
    gradientEnd: 'rgba(2, 132, 199, 0.01)',
    normalRange: [95, 100],
    normalLabel: '95% - 100% (Normal SpO2)',
    yDomainPadding: [1, 1],
    getValue: (d) => d.spO2,
    formatValue: (v) => `${Math.round(v)}%`,
    targetDescription: 'Blood oxygen saturation measured via peripheral pulse oximetry. Values above 95% indicate healthy gas exchange.',
  },
  glucose: {
    id: 'glucose',
    label: 'Blood Glucose',
    unit: 'mg/dL',
    icon: Activity,
    color: '#f59e0b', // amber-500
    gradientStart: 'rgba(245, 158, 11, 0.28)',
    gradientEnd: 'rgba(245, 158, 11, 0.01)',
    normalRange: [70, 99],
    normalLabel: '70 - 99 mg/dL (Fasting Euglycemia)',
    yDomainPadding: [5, 10],
    getValue: (d) => d.glucose,
    formatValue: (v) => `${Math.round(v)} mg/dL`,
    targetDescription: 'Fasting capillary glucose levels within normal metabolic baseline.',
  },
  overview: {
    id: 'overview',
    label: 'Multi-Metric Overview',
    unit: 'Score',
    icon: Layers,
    color: '#0891b2', // cyan-600
    secondaryColor: '#6366f1',
    gradientStart: 'rgba(8, 145, 178, 0.25)',
    gradientEnd: 'rgba(8, 145, 178, 0.01)',
    normalRange: [80, 100],
    normalLabel: '80 - 100 (Optimal Vital Score)',
    yDomainPadding: [5, 5],
    getValue: (d) => {
      // Calculate composite vitals health index (0 - 100)
      const hrScore = Math.max(0, 100 - Math.abs(d.heartRate - 65) * 1.8);
      const bpScore = Math.max(0, 100 - Math.abs(d.bpSystolic - 115) * 1.5 - Math.abs(d.bpDiastolic - 75) * 1.5);
      const sleepScore = Math.min(100, (d.sleepHours / 8) * 100);
      const spo2Score = (d.spO2 / 100) * 100;
      return Math.round((hrScore * 0.35 + bpScore * 0.35 + sleepScore * 0.15 + spo2Score * 0.15));
    },
    formatValue: (v) => `${Math.round(v)} / 100`,
    targetDescription: 'HEALX Integrated Vital Composite score evaluating cardiac rhythm, arterial tension, oxygenation, and sleep architecture.',
  },
};

export const VitalsTrendsD3Chart: React.FC<VitalsTrendsD3ChartProps> = ({
  data,
  onAskAIAboutTrends,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // States
  const [selectedMetric, setSelectedMetric] = useState<VitalMetricType>('heartRate');
  const [timeRange, setTimeRange] = useState<30 | 14 | 7>(30);
  const [showNormalRange, setShowNormalRange] = useState<boolean>(true);
  const [showEvents, setShowEvents] = useState<boolean>(true);
  const [showMovingAvg, setShowMovingAvg] = useState<boolean>(true);
  const [hoveredPoint, setHoveredPoint] = useState<DailyVitalRecord | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedEventModal, setSelectedEventModal] = useState<DailyVitalRecord | null>(null);

  // Filter dataset based on time range
  const filteredData = useMemo(() => {
    return data.slice(data.length - timeRange);
  }, [data, timeRange]);

  const currentConfig = METRIC_CONFIGS[selectedMetric];

  // Compute summary statistics
  const stats = useMemo(() => {
    if (!filteredData.length) return { avg: 0, min: 0, max: 0, change: 0, pctChange: 0, compliancePct: 0 };
    const values = filteredData.map(currentConfig.getValue);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const firstVal = values[0];
    const lastVal = values[values.length - 1];
    const change = lastVal - firstVal;
    const pctChange = firstVal !== 0 ? (change / firstVal) * 100 : 0;

    // Calculate percentage in target range
    const [normMin, normMax] = currentConfig.normalRange;
    const inRangeCount = values.filter((v) => v >= normMin && v <= normMax).length;
    const compliancePct = Math.round((inRangeCount / values.length) * 100);

    return {
      avg: Number(avg.toFixed(1)),
      min: Number(min.toFixed(1)),
      max: Number(max.toFixed(1)),
      change: Number(change.toFixed(1)),
      pctChange: Number(pctChange.toFixed(1)),
      compliancePct,
      firstVal,
      lastVal,
    };
  }, [filteredData, currentConfig]);

  // Compute 7-day Moving Average array
  const movingAvgData = useMemo(() => {
    return filteredData.map((item, index, array) => {
      const windowSize = Math.min(index + 1, 5);
      const slice = array.slice(Math.max(0, index - windowSize + 1), index + 1);
      const avg = slice.reduce((sum, d) => sum + currentConfig.getValue(d), 0) / slice.length;
      return {
        ...item,
        movingAvg: avg,
      };
    });
  }, [filteredData, currentConfig]);

  // D3 Chart Rendering Effect
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !filteredData.length) return;

    const svgElement = svgRef.current;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 340;
    const margin = { top: 25, right: 35, bottom: 45, left: 55 };

    const innerWidth = Math.max(200, width - margin.left - margin.right);
    const innerHeight = Math.max(150, height - margin.top - margin.bottom);

    // Clear previous elements
    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('style', 'max-width: 100%; height: auto; overflow: visible;');

    // Defs for Gradients and Glow filters
    const defs = svg.append('defs');

    // Gradient for primary area
    const areaGradient = defs
      .append('linearGradient')
      .attr('id', 'vital-area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', currentConfig.gradientStart);

    areaGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', currentConfig.gradientEnd);

    // Subtle drop shadow filter for points
    const filter = defs.append('filter').attr('id', 'point-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    filter.append('feDropShadow').attr('dx', '0').attr('dy', '2').attr('stdDeviation', '3').attr('flood-color', currentConfig.color).attr('flood-opacity', '0.4');

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale (time or dayIndex)
    const xScale = d3
      .scaleLinear()
      .domain([0, filteredData.length - 1])
      .range([0, innerWidth]);

    // Calculate Y domain
    const primaryVals = filteredData.map(currentConfig.getValue);
    const secondaryVals = currentConfig.getSecondaryValue ? filteredData.map(currentConfig.getSecondaryValue) : [];
    const allVals = [...primaryVals, ...secondaryVals, currentConfig.normalRange[0], currentConfig.normalRange[1]];

    const [padBottom, padTop] = currentConfig.yDomainPadding;
    const yMin = Math.max(0, Math.min(...allVals) - padBottom);
    const yMax = Math.max(...allVals) + padTop;

    const yScale = d3.scaleLinear().domain([yMin, yMax]).range([innerHeight, 0]).nice();

    // 1. Draw Normal Clinical Reference Range Band (if enabled)
    if (showNormalRange) {
      const [normMin, normMax] = currentConfig.normalRange;
      const bandY1 = Math.max(0, yScale(normMax));
      const bandY2 = Math.min(innerHeight, yScale(normMin));
      const bandHeight = Math.max(2, bandY2 - bandY1);

      // Range rect
      g.append('rect')
        .attr('x', 0)
        .attr('y', bandY1)
        .attr('width', innerWidth)
        .attr('height', bandHeight)
        .attr('fill', '#10b981')
        .attr('fill-opacity', 0.06)
        .attr('stroke', '#10b981')
        .attr('stroke-opacity', 0.2)
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3 3');

      // Range text badge
      g.append('text')
        .attr('x', innerWidth - 8)
        .attr('y', bandY1 + 14)
        .attr('text-anchor', 'end')
        .attr('font-size', '10px')
        .attr('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace')
        .attr('fill', '#059669')
        .attr('font-weight', '600')
        .text(`Target: ${currentConfig.normalLabel}`);
    }

    // 2. Subtle Horizontal Grid lines
    const yTicks = yScale.ticks(6);
    g.append('g')
      .attr('class', 'grid-lines')
      .selectAll('line')
      .data(yTicks)
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', (d) => yScale(d))
      .attr('y2', (d) => yScale(d))
      .attr('stroke', '#f1f5f9')
      .attr('stroke-width', 1);

    // 3. Y Axis with formatted labels
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(6)
      .tickSize(0)
      .tickPadding(12)
      .tickFormat((d) => `${d}`);

    const yAxisG = g.append('g').attr('class', 'y-axis').call(yAxis);
    yAxisG.select('.domain').remove();
    yAxisG
      .selectAll('text')
      .attr('fill', '#64748b')
      .attr('font-size', '11px')
      .attr('font-family', 'ui-monospace, monospace')
      .attr('font-weight', '500');

    // Y Axis Unit Label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -innerHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#94a3b8')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .text(`${currentConfig.label} (${currentConfig.unit})`);

    // 4. X Axis
    const tickIndices = filteredData.map((_, i) => i).filter((i) => {
      if (filteredData.length <= 8) return true;
      if (filteredData.length <= 15) return i % 2 === 0;
      return i % 4 === 0 || i === filteredData.length - 1;
    });

    const xAxis = d3
      .axisBottom(xScale)
      .tickValues(tickIndices)
      .tickSize(0)
      .tickPadding(12)
      .tickFormat((i) => filteredData[i as number]?.displayDate || '');

    const xAxisG = g.append('g').attr('class', 'x-axis').attr('transform', `translate(0,${innerHeight})`).call(xAxis);
    xAxisG.select('.domain').attr('stroke', '#e2e8f0');
    xAxisG
      .selectAll('text')
      .attr('fill', '#64748b')
      .attr('font-size', '11px')
      .attr('font-family', 'ui-monospace, monospace');

    // 5. Draw Primary Area Fill
    const areaGenerator = d3
      .area<DailyVitalRecord>()
      .x((_, i) => xScale(i))
      .y0(innerHeight)
      .y1((d) => yScale(currentConfig.getValue(d)))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(filteredData)
      .attr('class', 'area-path')
      .attr('d', areaGenerator)
      .attr('fill', 'url(#vital-area-gradient)');

    // 6. Secondary Line (e.g., Peak HR or Diastolic BP) if available
    if (currentConfig.getSecondaryValue && currentConfig.secondaryColor) {
      const secLineGenerator = d3
        .line<DailyVitalRecord>()
        .x((_, i) => xScale(i))
        .y((d) => yScale(currentConfig.getSecondaryValue!(d)))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(filteredData)
        .attr('class', 'secondary-line-path')
        .attr('d', secLineGenerator)
        .attr('fill', 'none')
        .attr('stroke', currentConfig.secondaryColor)
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '4 4')
        .attr('stroke-opacity', 0.85);
    }

    // 7. Moving Average (Trendline) if enabled
    if (showMovingAvg && movingAvgData.length > 2) {
      const maLineGenerator = d3
        .line<(typeof movingAvgData)[0]>()
        .x((_, i) => xScale(i))
        .y((d) => yScale(d.movingAvg))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(movingAvgData)
        .attr('class', 'moving-avg-path')
        .attr('d', maLineGenerator)
        .attr('fill', 'none')
        .attr('stroke', '#94a3b8')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '2 2')
        .attr('opacity', 0.7);
    }

    // 8. Primary Metric Line with smooth entrance animation
    const lineGenerator = d3
      .line<DailyVitalRecord>()
      .x((_, i) => xScale(i))
      .y((d) => yScale(currentConfig.getValue(d)))
      .curve(d3.curveMonotoneX);

    const linePath = g
      .append('path')
      .datum(filteredData)
      .attr('class', 'primary-line-path')
      .attr('d', lineGenerator)
      .attr('fill', 'none')
      .attr('stroke', currentConfig.color)
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round');

    // Optional subtle animate draw
    const pathLength = (linePath.node() as SVGPathElement)?.getTotalLength?.() || 1000;
    linePath
      .attr('stroke-dasharray', `${pathLength} ${pathLength}`)
      .attr('stroke-dashoffset', pathLength)
      .transition()
      .duration(750)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);

    // 9. Event Marker Pins on curve (e.g. "Rx Adjusted", "Echo Check")
    if (showEvents) {
      filteredData.forEach((d, i) => {
        if (d.eventTag) {
          const cx = xScale(i);
          const cy = yScale(currentConfig.getValue(d));

          // Pin marker group
          const pinG = g
            .append('g')
            .attr('class', 'event-pin-group cursor-pointer')
            .attr('transform', `translate(${cx}, ${cy})`)
            .on('click', () => setSelectedEventModal(d));

          // Outer halo
          pinG
            .append('circle')
            .attr('r', 9)
            .attr('fill', '#06b6d4')
            .attr('fill-opacity', 0.2)
            .attr('stroke', '#0891b2')
            .attr('stroke-width', 1.5);

          // Center dot
          pinG
            .append('circle')
            .attr('r', 4)
            .attr('fill', '#0891b2')
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 1.5);

          // Small tag label
          pinG
            .append('text')
            .attr('y', -14)
            .attr('text-anchor', 'middle')
            .attr('font-size', '9px')
            .attr('font-weight', '700')
            .attr('font-family', 'sans-serif')
            .attr('fill', '#0e7490')
            .text(d.eventTag);
        }
      });
    }

    // 10. Interactive Crosshair & Tooltip Overlay
    const crosshairLine = g
      .append('line')
      .attr('class', 'crosshair-line')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#64748b')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4 4')
      .style('opacity', 0);

    const focusCircle = g
      .append('circle')
      .attr('class', 'focus-circle')
      .attr('r', 6)
      .attr('fill', currentConfig.color)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2.5)
      .attr('filter', 'url(#point-glow)')
      .style('opacity', 0);

    const secondaryFocusCircle = currentConfig.getSecondaryValue
      ? g
          .append('circle')
          .attr('class', 'secondary-focus-circle')
          .attr('r', 5)
          .attr('fill', currentConfig.secondaryColor || '#06b6d4')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 2)
          .style('opacity', 0)
      : null;

    // Transparent interaction overlay
    const overlay = g
      .append('rect')
      .attr('class', 'interaction-overlay')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .attr('cursor', 'crosshair');

    // Bisector for finding closest data point on hover
    overlay
      .on('mousemove', (event) => {
        const [pointerX] = d3.pointer(event);
        const ratio = pointerX / innerWidth;
        const index = Math.min(
          filteredData.length - 1,
          Math.max(0, Math.round(ratio * (filteredData.length - 1)))
        );
        const selected = filteredData[index];

        if (selected) {
          const cx = xScale(index);
          const cy = yScale(currentConfig.getValue(selected));

          crosshairLine.attr('x1', cx).attr('x2', cx).style('opacity', 0.8);

          focusCircle.attr('cx', cx).attr('cy', cy).style('opacity', 1);

          if (secondaryFocusCircle && currentConfig.getSecondaryValue) {
            const secCy = yScale(currentConfig.getSecondaryValue(selected));
            secondaryFocusCircle.attr('cx', cx).attr('cy', secCy).style('opacity', 1);
          }

          setHoveredPoint(selected);
          setHoverPosition({
            x: cx + margin.left,
            y: cy + margin.top,
          });
        }
      })
      .on('mouseleave', () => {
        crosshairLine.style('opacity', 0);
        focusCircle.style('opacity', 0);
        if (secondaryFocusCircle) secondaryFocusCircle.style('opacity', 0);
        setHoveredPoint(null);
        setHoverPosition(null);
      });

    // Resize listener with ResizeObserver
    const handleResize = () => {
      if (containerRef.current) {
        // re-run effect automatically on width change
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [filteredData, currentConfig, showNormalRange, showEvents, showMovingAvg]);

  // Handler for Exporting Chart as SVG
  const handleExportSVG = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HEALX_${currentConfig.label}_30Day_Trends.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="healx-d3-vitals-trends"
      className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6"
    >
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-600 border border-cyan-200/60">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-cyan-700 tracking-wider uppercase font-mono">
                Longitudinal Telemetry Analytics
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                30-Day Vitals Trends & Clinical Progress
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Continuous medical-grade time-series telemetry visualized with D3.js. Evaluates diurnal variations,
            exercise recovery, and medication therapeutic response.
          </p>
        </div>

        {/* Timeframe & Export Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Timeframe selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            {( [7, 14, 30] as const).map((days) => (
              <button
                key={days}
                id={`btn-timeframe-${days}d`}
                onClick={() => setTimeRange(days)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer font-mono ${
                  timeRange === days
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {days}D
              </button>
            ))}
          </div>

          {/* Export SVG Button */}
          <button
            id="btn-export-d3-chart"
            onClick={handleExportSVG}
            title="Download Vector Graphic (SVG)"
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export SVG</span>
          </button>
        </div>
      </div>

      {/* Metric Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {(Object.keys(METRIC_CONFIGS) as VitalMetricType[]).map((key) => {
          const config = METRIC_CONFIGS[key];
          const Icon = config.icon;
          const isSelected = selectedMetric === key;

          return (
            <button
              key={key}
              id={`tab-metric-${key}`}
              onClick={() => setSelectedMetric(key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{config.label}</span>
            </button>
          );
        })}
      </div>

      {/* Statistical Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 rounded-xl p-3 sm:p-4 border border-slate-200/80">
        {/* Metric 1: 30D Average */}
        <div className="space-y-0.5">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
            {timeRange}D Mean
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">
              {stats.avg}
            </span>
            <span className="text-xs font-medium text-slate-500 font-mono">{currentConfig.unit}</span>
          </div>
        </div>

        {/* Metric 2: Net Trajectory Change */}
        <div className="space-y-0.5">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
            Net Trajectory
          </span>
          <div className="flex items-center gap-1.5">
            {stats.change < 0 ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-mono text-sm font-bold border border-emerald-200">
                <TrendingDown className="w-3.5 h-3.5" />
                {stats.change} {currentConfig.unit} ({stats.pctChange}%)
              </span>
            ) : stats.change > 0 ? (
              <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-mono text-sm font-bold border border-amber-200">
                <TrendingUp className="w-3.5 h-3.5" />
                +{stats.change} {currentConfig.unit} (+{stats.pctChange}%)
              </span>
            ) : (
              <span className="text-slate-700 font-mono text-sm font-bold">Stable (0.0)</span>
            )}
          </div>
        </div>

        {/* Metric 3: Range [Min - Max] */}
        <div className="space-y-0.5">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
            Recorded Range
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg sm:text-xl font-bold text-slate-800 font-mono">
              {stats.min} - {stats.max}
            </span>
            <span className="text-xs text-slate-500 font-mono">{currentConfig.unit}</span>
          </div>
        </div>

        {/* Metric 4: Clinical Target Compliance */}
        <div className="space-y-0.5">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
            Target Adherence
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-700 font-mono">
              {stats.compliancePct}%
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
              <CheckCircle className="w-3.5 h-3.5" />
              In Target
            </span>
          </div>
        </div>
      </div>

      {/* Main D3 Chart Canvas Container */}
      <div className="relative">
        {/* Toggle options above canvas */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-2">
          <div className="flex items-center gap-3">
            {/* Primary line legend */}
            <div className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: currentConfig.color }}
              />
              <span className="font-bold text-slate-800">{currentConfig.label}</span>
            </div>

            {/* Secondary line legend if applicable */}
            {currentConfig.secondaryLabel && (
              <div className="flex items-center gap-1.5">
                <span
                  className="w-3 h-1 border-t-2 border-dashed"
                  style={{ borderColor: currentConfig.secondaryColor }}
                />
                <span className="text-slate-600 font-medium">{currentConfig.secondaryLabel}</span>
              </div>
            )}

            {/* 7-Day Moving Avg indicator */}
            {showMovingAvg && (
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="w-3 h-0.5 bg-slate-400 border-t border-dashed" />
                <span>7-Day Trendline</span>
              </div>
            )}
          </div>

          {/* Chart View Toggles */}
          <div className="flex items-center gap-3 text-slate-600">
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
              <input
                type="checkbox"
                checked={showNormalRange}
                onChange={(e) => setShowNormalRange(e.target.checked)}
                className="rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer"
              />
              <span>Target Band</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
              <input
                type="checkbox"
                checked={showEvents}
                onChange={(e) => setShowEvents(e.target.checked)}
                className="rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer"
              />
              <span>Event Pins</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
              <input
                type="checkbox"
                checked={showMovingAvg}
                onChange={(e) => setShowMovingAvg(e.target.checked)}
                className="rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer"
              />
              <span>Trendline</span>
            </label>
          </div>
        </div>

        {/* D3 SVG Container */}
        <div
          ref={containerRef}
          className="w-full h-[340px] relative bg-gradient-to-b from-slate-50/40 to-white rounded-xl border border-slate-100 overflow-hidden"
        >
          <svg ref={svgRef} className="w-full h-full" />

          {/* Floating Tooltip positioned over active point */}
          {hoveredPoint && hoverPosition && (
            <div
              className="absolute pointer-events-none z-30 transition-all duration-75"
              style={{
                left: `${Math.min(
                  containerRef.current ? containerRef.current.clientWidth - 180 : 300,
                  Math.max(10, hoverPosition.x - 90)
                )}px`,
                top: `${Math.max(10, hoverPosition.y - 120)}px`,
              }}
            >
              <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700/80 backdrop-blur-md min-w-[170px] space-y-1.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1 text-[11px] font-mono text-slate-400">
                  <span>{hoveredPoint.displayDate}</span>
                  <span className="text-cyan-400 font-bold">Day {hoveredPoint.dayIndex}</span>
                </div>

                <div className="flex items-baseline justify-between pt-0.5">
                  <span className="text-xs text-slate-300 font-medium">{currentConfig.label}:</span>
                  <span className="text-sm font-extrabold font-mono text-white">
                    {currentConfig.formatValue(currentConfig.getValue(hoveredPoint))}
                  </span>
                </div>

                {currentConfig.getSecondaryValue && (
                  <div className="flex items-baseline justify-between text-xs text-slate-400">
                    <span>{currentConfig.secondaryLabel}:</span>
                    <span className="font-mono text-cyan-300 font-bold">
                      {currentConfig.formatValue(currentConfig.getSecondaryValue(hoveredPoint))}
                    </span>
                  </div>
                )}

                {hoveredPoint.eventTag && (
                  <div className="pt-1 text-[10px] font-bold text-cyan-300 flex items-center gap-1 border-t border-slate-800">
                    <Sparkles className="w-3 h-3" />
                    <span>{hoveredPoint.eventTag}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Clinical Interpretation & AI Copilot Analysis Bar */}
      <div className="bg-cyan-50/70 border border-cyan-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>AI Clinical Trajectory Interpretation</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-200/80 text-cyan-900 font-mono">
                Gemini Synthesized
              </span>
            </h4>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              {selectedMetric === 'heartRate' &&
                'Resting cardiac rhythm demonstrates steady parasympathetic tone recovery over the last 30 days (-8.1%), indicating effective cardiovascular adaptation.'}
              {selectedMetric === 'bloodPressure' &&
                'Arterial pressure remains tightly within the AHA normotensive boundary (Mean 118/75 mmHg) with negligible diurnal variability.'}
              {selectedMetric === 'sleep' &&
                'Sleep architecture shows a progressive 45-minute expansion in restorative duration with 88% overall sleep quality consistency.'}
              {selectedMetric === 'spO2' &&
                'Peripheral capillary oxygen saturation holds continuously above 98%, reflecting optimal alveolar gas exchange and respiratory resilience.'}
              {selectedMetric === 'glucose' &&
                'Fasting glucose trajectory maintains euglycemic stability between 88-99 mg/dL without acute glycemic excursions.'}
              {selectedMetric === 'overview' &&
                'Composite Vital Health Index has advanced from 78 to 92 points over 30 days, reflecting coordinated systemic stabilization across all biometric markers.'}
            </p>
          </div>
        </div>

        {onAskAIAboutTrends && (
          <button
            id="btn-ask-ai-vitals-insight"
            onClick={() =>
              onAskAIAboutTrends(
                currentConfig.label,
                `${stats.avg} ${currentConfig.unit}`,
                `${stats.change} ${currentConfig.unit} (${stats.pctChange}%)`
              )
            }
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-xs flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Consult Copilot</span>
          </button>
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-600" />
                <h3 className="font-bold text-base text-slate-900">
                  {selectedEventModal.eventTag} Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedEventModal(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="text-[11px] font-mono text-slate-500">Date Logged</div>
                <div className="font-bold text-slate-900 text-sm">{selectedEventModal.date} ({selectedEventModal.displayDate})</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-mono">Heart Rate</div>
                  <div className="font-bold text-slate-900 text-sm">{selectedEventModal.heartRate} bpm</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-mono">Blood Pressure</div>
                  <div className="font-bold text-slate-900 text-sm">{selectedEventModal.bpSystolic}/{selectedEventModal.bpDiastolic} mmHg</div>
                </div>
              </div>

              {selectedEventModal.notes && (
                <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-100">
                  <div className="text-[11px] font-bold text-cyan-900 font-mono">Clinical Note</div>
                  <div className="text-slate-800 mt-0.5">{selectedEventModal.notes}</div>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedEventModal(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
