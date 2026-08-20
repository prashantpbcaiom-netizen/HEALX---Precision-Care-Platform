import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { HourlyTriageFlowData } from '../types';
import { Activity, Clock, TrendingUp, Users, Filter, CheckCircle2 } from 'lucide-react';

interface TriageFlowD3ChartProps {
  data: HourlyTriageFlowData[];
}

export const TriageFlowD3Chart: React.FC<TriageFlowD3ChartProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [shiftFilter, setShiftFilter] = useState<'all' | 'morning' | 'afternoon'>('all');
  const [hoveredData, setHoveredData] = useState<HourlyTriageFlowData | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  const filteredData = React.useMemo(() => {
    if (shiftFilter === 'morning') return data.filter((d) => parseInt(d.hour.split(':')[0], 10) < 12);
    if (shiftFilter === 'afternoon') return data.filter((d) => parseInt(d.hour.split(':')[0], 10) >= 12);
    return data;
  }, [data, shiftFilter]);

  const totalIntake = filteredData.reduce((acc, d) => acc + d.intake, 0);
  const totalDischarged = filteredData.reduce((acc, d) => acc + d.discharged, 0);
  const avgWait = Math.round(
    filteredData.reduce((acc, d) => acc + d.avgWaitMin, 0) / (filteredData.length || 1)
  );

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !filteredData.length) return;

    const svgElement = svgRef.current;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 240;
    const margin = { top: 20, right: 40, bottom: 35, left: 40 };

    const innerWidth = Math.max(150, width - margin.left - margin.right);
    const innerHeight = Math.max(100, height - margin.top - margin.bottom);

    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('style', 'max-width: 100%; height: auto; overflow: visible;');

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale (band for bars)
    const xScale = d3
      .scaleBand()
      .domain(filteredData.map((d) => d.hour))
      .range([0, innerWidth])
      .padding(0.35);

    // Y Scale for intake / discharge volume
    const maxVol = Math.max(...filteredData.map((d) => Math.max(d.intake, d.discharged, d.activeCensus))) + 2;
    const yScale = d3.scaleLinear().domain([0, maxVol]).range([innerHeight, 0]).nice();

    // Right Y Scale for wait minutes
    const maxWait = Math.max(...filteredData.map((d) => d.avgWaitMin)) + 4;
    const yWaitScale = d3.scaleLinear().domain([0, maxWait]).range([innerHeight, 0]).nice();

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .selectAll('line')
      .data(yScale.ticks(4))
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', (d) => yScale(d))
      .attr('y2', (d) => yScale(d))
      .attr('stroke', '#f1f5f9')
      .attr('stroke-width', 1);

    // X Axis
    const xAxis = d3.axisBottom(xScale).tickSize(0).tickPadding(8);
    const xAxisG = g.append('g').attr('transform', `translate(0,${innerHeight})`).call(xAxis);
    xAxisG.select('.domain').attr('stroke', '#e2e8f0');
    xAxisG
      .selectAll('text')
      .attr('fill', '#64748b')
      .attr('font-size', '10px')
      .attr('font-family', 'ui-monospace, monospace')
      .attr('font-weight', '600');

    // Left Y Axis (Patient Count)
    const yAxis = d3.axisLeft(yScale).ticks(4).tickSize(0).tickPadding(8);
    const yAxisG = g.append('g').call(yAxis);
    yAxisG.select('.domain').remove();
    yAxisG.selectAll('text').attr('fill', '#94a3b8').attr('font-size', '10px').attr('font-family', 'monospace');

    // 1. Draw Intake Bars (Vibrant Cyan)
    g.selectAll('.intake-bar')
      .data(filteredData)
      .enter()
      .append('rect')
      .attr('class', 'intake-bar')
      .attr('x', (d) => xScale(d.hour) || 0)
      .attr('y', (d) => yScale(d.intake))
      .attr('width', (xScale.bandwidth() || 10) / 2)
      .attr('height', (d) => Math.max(0, innerHeight - yScale(d.intake)))
      .attr('fill', '#06b6d4') // cyan-500
      .attr('rx', 3)
      .attr('opacity', 0.9);

    // 2. Draw Discharged Bars (Emerald)
    g.selectAll('.discharged-bar')
      .data(filteredData)
      .enter()
      .append('rect')
      .attr('class', 'discharged-bar')
      .attr('x', (d) => (xScale(d.hour) || 0) + (xScale.bandwidth() || 10) / 2 + 1)
      .attr('y', (d) => yScale(d.discharged))
      .attr('width', (xScale.bandwidth() || 10) / 2)
      .attr('height', (d) => Math.max(0, innerHeight - yScale(d.discharged)))
      .attr('fill', '#10b981') // emerald-500
      .attr('rx', 3)
      .attr('opacity', 0.85);

    // 3. Draw Active Census Trendline (Indigo curved line)
    const censusLine = d3
      .line<HourlyTriageFlowData>()
      .x((d) => (xScale(d.hour) || 0) + (xScale.bandwidth() || 10) / 2)
      .y((d) => yScale(d.activeCensus))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(filteredData)
      .attr('fill', 'none')
      .attr('stroke', '#6366f1') // indigo-500
      .attr('stroke-width', 2.5)
      .attr('d', censusLine);

    // 4. Draw Census Point Markers
    g.selectAll('.census-dot')
      .data(filteredData)
      .enter()
      .append('circle')
      .attr('cx', (d) => (xScale(d.hour) || 0) + (xScale.bandwidth() || 10) / 2)
      .attr('cy', (d) => yScale(d.activeCensus))
      .attr('r', 3.5)
      .attr('fill', '#ffffff')
      .attr('stroke', '#6366f1')
      .attr('stroke-width', 2);

    // 5. Invisible interaction hover strips
    g.selectAll('.hover-rect')
      .data(filteredData)
      .enter()
      .append('rect')
      .attr('class', 'hover-rect')
      .attr('x', (d) => xScale(d.hour) || 0)
      .attr('y', 0)
      .attr('width', xScale.bandwidth())
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .attr('cursor', 'pointer')
      .on('mousemove', (event, d) => {
        const [px, py] = d3.pointer(event);
        setHoveredData(d);
        setHoverPos({ x: px + margin.left, y: py + margin.top });
      })
      .on('mouseleave', () => {
        setHoveredData(null);
        setHoverPos(null);
      });
  }, [filteredData]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      {/* Header & Shift Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-200">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Hourly Patient Intake & Unit Throughput</h3>
            <p className="text-xs text-slate-500">Live census vs. completed discharges</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Shift Filter buttons */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setShiftFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                shiftFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500'
              }`}
            >
              Full Day
            </button>
            <button
              onClick={() => setShiftFilter('morning')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                shiftFilter === 'morning' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500'
              }`}
            >
              AM Shift
            </button>
            <button
              onClick={() => setShiftFilter('afternoon')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                shiftFilter === 'afternoon' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500'
              }`}
            >
              PM Shift
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-3 gap-2 py-1 text-center bg-slate-50 rounded-xl border border-slate-100">
        <div className="py-1">
          <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Total Intake</span>
          <div className="text-base font-extrabold text-cyan-700 font-mono">{totalIntake} Patients</div>
        </div>
        <div className="py-1 border-x border-slate-200">
          <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Discharged</span>
          <div className="text-base font-extrabold text-emerald-700 font-mono">{totalDischarged} Completed</div>
        </div>
        <div className="py-1">
          <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Avg Wait</span>
          <div className="text-base font-extrabold text-slate-800 font-mono">{avgWait} Mins</div>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-cyan-500" />
            <span>Intake</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
            <span>Discharged</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-1 bg-indigo-500 rounded-full" />
            <span className="text-indigo-700 font-semibold">Active Census</span>
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">D3 Real-time Stream</span>
      </div>

      {/* SVG Container */}
      <div ref={containerRef} className="w-full relative min-h-[240px]">
        <svg ref={svgRef} className="w-full h-full" />

        {hoveredData && hoverPos && (
          <div
            className="absolute z-20 pointer-events-none bg-slate-900 text-white text-xs p-2.5 rounded-xl shadow-xl border border-slate-700 font-mono space-y-1"
            style={{
              left: `${Math.min(
                containerRef.current ? containerRef.current.clientWidth - 160 : 200,
                Math.max(10, hoverPos.x - 70)
              )}px`,
              top: `${Math.max(5, hoverPos.y - 85)}px`,
            }}
          >
            <div className="font-bold text-cyan-300 border-b border-slate-800 pb-0.5">
              Hour {hoveredData.hour}
            </div>
            <div className="flex justify-between gap-4 text-slate-300">
              <span>Intake:</span>
              <strong className="text-cyan-400">{hoveredData.intake} pts</strong>
            </div>
            <div className="flex justify-between gap-4 text-slate-300">
              <span>Discharged:</span>
              <strong className="text-emerald-400">{hoveredData.discharged} pts</strong>
            </div>
            <div className="flex justify-between gap-4 text-slate-300">
              <span>Active Census:</span>
              <strong className="text-indigo-300">{hoveredData.activeCensus} in unit</strong>
            </div>
            <div className="flex justify-between gap-4 text-slate-300">
              <span>Avg Wait:</span>
              <strong className="text-amber-300">{hoveredData.avgWaitMin} min</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
