import React, { useEffect, useRef } from 'react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

export function MeridianChart() {
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
        labels: ['Expected Loss', 'Stress Scenario', 'Tail Risk', 'Portfolio Cascade'],
        datasets: [
          {
            label: 'Standard Actuarial',
            data: [0.8, 1.2, 2.1, 0],
            backgroundColor: '#4038b8',
            borderRadius: 4
          },
          {
            label: 'Structural Model (This Engine)',
            data: [1.4, 3.8, 8.2, 14.3],
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
            ticks: {
              color: '#585650',
              font: { size: 10, family: 'IBM Plex Mono' },
              callback: (v) => '€' + v + 'M'
            },
            grid: { color: '#2e2c22' }
          },
          x: {
            ticks: { color: '#888478', font: { size: 10 } },
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
            callbacks: { label: (ctx) => `${ctx.dataset.label}: €${ctx.parsed.y}M` }
          }
        }
      }
    });

    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, []);

  return <canvas ref={canvasRef} height={120} />;
}
