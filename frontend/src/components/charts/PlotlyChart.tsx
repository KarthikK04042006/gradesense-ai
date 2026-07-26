import React from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js-dist-min';

const Plot = createPlotlyComponent(Plotly);

interface PlotlyChartProps {
  data: Plotly.Data[];
  layout?: Partial<Plotly.Layout>;
  style?: React.CSSProperties;
  className?: string;
}

export const PlotlyChart: React.FC<PlotlyChartProps> = ({
  data,
  layout = {},
  style = { width: '100%', height: '100%', minHeight: '300px' },
  className = ''
}) => {
  const defaultLayout: Partial<Plotly.Layout> = {
    autosize: true,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(15, 23, 42, 0.4)',
    font: {
      color: '#94a3b8',
      family: 'Inter, sans-serif',
      size: 11
    },
    margin: { l: 45, r: 25, t: 30, b: 40 },
    xaxis: {
      gridcolor: '#1e293b',
      zerolinecolor: '#334155',
      tickfont: { color: '#64748b' }
    },
    yaxis: {
      gridcolor: '#1e293b',
      zerolinecolor: '#334155',
      tickfont: { color: '#64748b' }
    },
    legend: {
      font: { color: '#cbd5e1' },
      orientation: 'h',
      y: 1.15
    },
    ...layout
  };

  return (
    <div className={`w-full h-full relative overflow-hidden ${className}`}>
      <Plot
        data={data}
        layout={defaultLayout}
        config={{
          responsive: true,
          displayModeBar: false,
        }}
        style={style}
        useResizeHandler={true}
      />
    </div>
  );
};
