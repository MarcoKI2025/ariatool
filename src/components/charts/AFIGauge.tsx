import React, { useRef, useEffect } from 'react';
import { Chart, ArcElement, DoughnutController, Tooltip } from 'chart.js';

Chart.register(ArcElement, DoughnutController, Tooltip);

interface AFIGaugeProps {
  afi: number;
  band: 'Stable' | 'Sensitive' | 'Fragile';
}

export function AFIGauge({ afi, band }: AFIGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const getColor = () => {
      if (afi < 0.85) return '#146030';
      if (afi < 1.35) return '#9c6200';
      return '#b53020';
    };

    const color = getColor();
    const maxAFI = 3.0;
    const normalizedAFI = Math.min(afi, maxAFI);

    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [normalizedAFI, maxAFI - normalizedAFI],
          backgroundColor: [color, '#1e1d14'],
          borderWidth: 0,
          circumference: 180,
          rotation: 270
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '75%',
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      },
      plugins: [{
        id: 'centerText',
        afterDraw: (chart) => {
          const ctx = chart.ctx;
          const width = chart.width;
          const centerX = width / 2;
          const centerY = chart.height / 2 + 20;

          ctx.save();

          ctx.font = 'bold 36px "IBM Plex Mono", monospace';
          ctx.fillStyle = color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(afi.toFixed(2), centerX, centerY - 15);

          ctx.font = '600 12px Inter';
          ctx.fillStyle = '#888478';
          ctx.fillText(band, centerX, centerY + 18);

          ctx.font = '500 9px "IBM Plex Mono"';
          ctx.fillStyle = '#585650';
          ctx.fillText('0.85', centerX - 80, centerY + 50);
          ctx.fillText('1.35', centerX + 80, centerY + 50);

          ctx.restore();
        }
      }]
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [afi, band]);

  return (
    <div className="flex items-center justify-center">
      <canvas ref={canvasRef} style={{ maxWidth: 280, maxHeight: 180 }} />
    </div>
  );
}
