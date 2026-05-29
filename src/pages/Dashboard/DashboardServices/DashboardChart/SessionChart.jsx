import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';

const SessionResultChart = ({ seriesData }) => {
  const series = seriesData || [
    { name: 'Successful', data: [25, 25, 75, 80, 140, 140, 80, 110, 115, 145] },
    { name: 'Failed', data: [65, 65, 35, 35, 75, 75, 120, 120, 75, 85] },
    { name: 'Case pending', data: [20, 20, 45, 50, 90, 90, 90, 45, 45, 85] },
    {
      name: 'Pending approvals',
      data: [30, 55, 40, 15, 15, 15, 55, 80, 85, 85],
    },
  ];

  const seriesColors = {
    Successful: '#11B56B',
    Failed: '#FF3B30',
    'Case pending': '#F59E0B',
    'Pending approvals': '#9CA3AF',
  };

  const options = useMemo(
    () => ({
      chart: {
        type: 'line',
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: 'Inter, sans-serif',
        foreColor: '#6B7280',
      },

      colors: ['#11B56B', '#FF3B30', '#F59E0B', '#9CA3AF'],

      stroke: {
        curve: 'smooth',
        width: [3, 3, 3, 2.5],
        dashArray: [0, 0, 0, 7],
      },

      markers: { size: 0, hover: { size: 5 } },

      grid: {
        borderColor: '#E5E7EB',
        strokeDashArray: 6,
        xaxis: { lines: { show: false } },
        padding: { left: 0, right: 10, top: 10, bottom: 0 },
      },

      dataLabels: { enabled: false },

      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
        ],
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
        crosshairs: { show: false },
      },

      yaxis: {
        min: 0,
        max: 160,
        tickAmount: 4,
        labels: {
          style: { colors: '#9CA3AF', fontSize: '12px', fontWeight: 500 },
          formatter: v => `${v}`,
        },
      },

      legend: {
        position: 'bottom',
        horizontalAlign: 'left',
        fontSize: '13px',
        fontWeight: 500,

        markers: {
          show: false,
        },

        labels: {
          useSeriesColors: true,
        },
        itemMargin: { horizontal: 16, vertical: 8 },

        formatter: function (val) {
          const color = seriesColors[val] || '#000';
          const isDashed = val === 'Pending approvals';

          const marker = isDashed
            ? `<span style="display:inline-flex;align-items:center;width:22px;height:10px;margin-right:6px;">
           <svg width="22" height="4" viewBox="0 0 22 4">
             <line x1="0" y1="2" x2="22" y2="2"
               stroke="${color}" stroke-width="2.5"
               stroke-dasharray="5 3"
               stroke-linecap="round"/>
           </svg>
         </span>`
            : `<span style="display:inline-block;width:22px;height:5px;border-radius:10px;background:${color};margin-right:6px;"></span>`;
return `<span style="display:inline-flex;align-items:center;font-weight:500;">  ${marker}${val}
            </span>`;
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
        theme: 'light',
        style: { fontSize: '12px' },
      },

      responsive: [
        {
          breakpoint: 1024,
          options: {
            chart: { height: 320 },
            legend: { horizontalAlign: 'center' },
          },
        },
        {
          breakpoint: 768,
          options: {
            chart: { height: 280 },
            legend: {
              position: 'bottom',
              horizontalAlign: 'center',
              fontSize: '11px',
            },
          },
        },
      ],
    }),
    [],
  );

  return (
    <div className='w-full bg-white border border-[#CDD0D1] rounded-2xl p-4 sm:p-5'>
      <div className='mb-4'>
        <h2 className='text-[16px] sm:text-[18px] font-medium text-[#0B1C20] mb-0!'>
          Sessions Result
        </h2>
        <p className='text-[11px] sm:text-[12px] text-[#6A7174] mt-1'>
          Track sessions performance and monitoring
        </p>
      </div>

      <div className='w-full overflow-x-auto'>
        <div className='min-w-[600px] sm:min-w-full'>
          <Chart
            options={options}
            series={series}
            type='line'
            height={300}
            width='100%'
          />
        </div>
      </div>
    </div>
  );
};

export default SessionResultChart;
