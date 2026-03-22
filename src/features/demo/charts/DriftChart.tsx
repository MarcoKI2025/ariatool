import React, { useEffect, useRef } from 'react';
import { Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler);

export function DriftChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const months = Array.from({ length: 37 }, (_, i) => i);
    const exposureData = months.map(m => 100 + (Math.pow(1.08, m) - 1) * 100);

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months.map(m => m === 0 ? 'Deploy' : `M${m}`),
        datasets: [{
          label: 'Structural Exposure',
          data: exposureData,
          borderColor: '#b53020',
          backgroundColor: 'rgba(181, 48, 32, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#585650',
              font: { size: 10, family: 'IBM Plex Mono' },
              callback: (value) => value + '%'
            },
            grid: { color: '#2e2c22' }
          },
          x: {
            ticks: {
              color: '#888478',
              font: { size: 9 },
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 10
            },
            grid: { display: false }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#111108',
            titleColor: '#e8e4d8',
            bodyColor: '#888478',
            borderColor: '#2e2c22',
            borderWidth: 1,
            callbacks: {
              label: (context) => `Exposure: ${Math.round(context.parsed.y)}%`
            }
          }
        }
      }
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, []);

  return <canvas ref={canvasRef} height={110} />;
}
