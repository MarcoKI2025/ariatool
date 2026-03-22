import React, { useEffect, useRef } from 'react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

export function EUAIAChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Feb 2025\nArt. 5 Active', 'Aug 2025\nGPAI Rules', 'Aug 2026\nHigh-Risk', '2027\nFull Enforcement'],
        datasets: [{
          label: 'Max Penalty (€M)',
          data: [35, 15, 15, 35],
          backgroundColor: ['#b53020', '#9c6200', '#9c6200', '#b53020'],
          borderRadius: 4
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
              callback: (v) => '€' + v + 'M'
            },
            grid: { color: '#2e2c22' }
          },
          x: {
            ticks: { color: '#888478', font: { size: 9 }, maxRotation: 0 },
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

    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, []);

  return <canvas ref={canvasRef} height={110} />;
}
