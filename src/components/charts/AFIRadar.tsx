import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface AFIRadarProps {
  dr: number;
  jd: number;
  rc: number;
  cd: number;
  na: number;
}

export function AFIRadar({ dr, jd, rc, cd, na }: AFIRadarProps) {
  const data = {
    labels: ['DR', 'JD', 'RC', 'CD', 'NA'],
    datasets: [{
      label: 'AFI Components',
      data: [dr, jd, rc, cd, na],
      backgroundColor: 'rgba(181, 48, 32, 0.15)',
      borderColor: '#b53020',
      borderWidth: 2,
      pointBackgroundColor: '#b53020',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#b53020',
      pointHoverRadius: 6
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        min: 0,
        max: 1,
        beginAtZero: true,
        ticks: {
          stepSize: 0.2,
          color: '#585650',
          backdropColor: 'transparent',
          font: { size: 9, family: '"IBM Plex Mono", monospace' }
        },
        grid: { color: '#2e2c22', circular: true },
        angleLines: { color: '#2e2c22' },
        pointLabels: {
          color: '#888478',
          font: { size: 11, weight: '600' as const, family: 'Inter' }
        }
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
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: any) => `${context.label}: ${context.parsed.r.toFixed(3)}`
        }
      }
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div style={{ maxWidth: 300, maxHeight: 300, width: '100%' }}>
        <Radar data={data} options={options} />
      </div>
    </div>
  );
}
