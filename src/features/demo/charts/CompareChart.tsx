import React, { useEffect, useRef } from 'react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

export function CompareChart() {
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
        labels: ['Standard Cyber', 'Parametric AI', 'Compliance Audit', 'Manual UW', 'This Engine'],
        datasets: [{
          label: 'Governance Dimensions',
          data: [2, 3, 4, 3, 10],
          backgroundColor: ['#2e2c22', '#2e2c22', '#2e2c22', '#2e2c22', '#4038b8'],
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            max: 10,
            ticks: { color: '#585650', font: { size: 10, family: 'IBM Plex Mono' } },
            grid: { color: '#2e2c22' }
          },
          y: {
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
            borderWidth: 1
          }
        }
      }
    });

    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, []);

  return <canvas ref={canvasRef} height={110} />;
}
