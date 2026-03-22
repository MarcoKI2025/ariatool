import React, { useEffect, useRef } from 'react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

export function GapChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Hallucination', 'Model Drift', 'Continuation Risk', 'Provider Lock-in', 'Responsibility Gap'],
        datasets: [
          {
            label: 'Traditional risk models',
            data: [60, 40, 10, 15, 5],
            backgroundColor: '#4038b8',
            borderRadius: 4
          },
          {
            label: 'Structural exposure (this engine)',
            data: [75, 85, 95, 90, 88],
            backgroundColor: '#b53020',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              color: '#585650',
              font: { size: 10, family: 'IBM Plex Mono' }
            },
            grid: { color: '#2e2c22' }
          },
          x: {
            ticks: {
              color: '#888478',
              font: { size: 10 }
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
            borderWidth: 1
          }
        }
      }
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, []);

  return <div style={{ position: 'relative', height: '200px', width: '100%' }}><canvas ref={canvasRef} /></div>;
}
