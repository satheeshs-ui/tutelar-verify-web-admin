import React from 'react';
import Chart from 'react-apexcharts';

const UsageRadialChart = ({ percentage = 48.6 }) => {
  const options = {
    chart: {
      type: 'radialBar',
      sparkline: {
        enabled: true,
      },
    },

    colors: ['#0F6B81'],

    plotOptions: {
      radialBar: {
        startAngle: -125,
        endAngle: 235,

        hollow: {
          size: '68%',
          background: '#fff',
        },

        track: {
          background: '#E5E7EB',
          strokeWidth: '100%',
          margin: 0,
        },

        dataLabels: {
          name: {
            show: false,
          },

          value: {
            show: true,
            offsetY: 5,
            fontSize: '34px',
            fontWeight: 600,
            color: '#111827',
            formatter: () => `${percentage}%`,
          },
        },
      },
    },

    stroke: {
      lineCap: 'round',
    },
  };

  return (
    <div className='relative w-[200px] h-[200px] flex items-center justify-center'>
      <Chart
        options={options}
        series={[percentage]}
        type='radialBar'
        width={190}
        height={190}
      />

      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-5'>
        <p className='text-[14px] text-[#6B7280] font-medium mb-0! text-center'>
          Used
        </p>
      </div>
    </div>
  );
};

export default UsageRadialChart;
