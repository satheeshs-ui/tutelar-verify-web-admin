import React from 'react';
import Chart from 'react-apexcharts';
import ImageLoader from '../../components/ui/ImageLoader';

const TopAgentsChart = () => {
  const series = [
    {
      name: 'Approved',
      data: [1000, 650, 1150, 750, 1300],
    },
    {
      name: 'Pending',
      data: [300, 250, 250, 350, 120],
    },
    {
      name: 'Rejected',
      data: [120, 180, 220, 180, 320],
    },
  ];

  const options = {
    chart: {
      type: 'bar',
      stacked: true,

      toolbar: {
        show: false,
      },

      zoom: {
        enabled: false,
      },

      fontFamily: 'Inter, sans-serif',

      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 700,
      },
    },

    states: {
      hover: {
        filter: {
          type: 'none', 
        },
      },

      active: {
        filter: {
          type: 'none',
        },
      },
    },

    colors: ['#10B981', '#F59E0B', '#EF4444'],

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '34%',

        borderRadius: 6,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },

    dataLabels: {
      enabled: false,
    },

    stroke: {
      show: false,
    },

    grid: {
      borderColor: '#E7EAEC',
      strokeDashArray: 5,

      padding: {
        top: 10,
        left: 0,
        right: 10,
        bottom: 0,
      },

      xaxis: {
        lines: {
          show: false,
        },
      },
    },

    xaxis: {
      categories: ['Satheesh S', 'Mathan', 'Vijay', 'Hari prasad', 'Karan Raj'],

      axisBorder: {
        show: false,
      },

      axisTicks: {
        show: false,
      },

      crosshairs: {
        show: false,
      },

      labels: {
        style: {
          colors: '#98A2B3',
          fontSize: '12px',
          fontWeight: 500,
        },
      },
    },

    yaxis: {
      min: 0,
      max: 1800,
      tickAmount: 4,

      labels: {
        style: {
          colors: '#98A2B3',
          fontSize: '12px',
          fontWeight: 500,
        },

        formatter: value => value,
      },
    },

    fill: {
      opacity: 1,
    },

    legend: {
      show: false,
    },
    tooltip: {
      enabled: true,
      shared: false,
      intersect: true,
      theme: 'light',

      custom: function ({ series, dataPointIndex, w }) {
        const approved = series[0][dataPointIndex];
        const pending = series[1][dataPointIndex];
        const rejected = series[2][dataPointIndex];

        const agent = w.globals.labels[dataPointIndex];

        return `
      <div class=" rounded-xl shadow-lg p-3 min-w-[180px]">

        <div class="text-[13px] font-semibold text-[#111827] mb-3">
          ${agent}
        </div>

        <div class="flex flex-col gap-2">

          <div class="flex items-center justify-between">
            <span class="flex items-center gap-2 text-[12px] text-[#10B981]">
              <span class="w-2 h-2 rounded-full bg-[#10B981]"></span>
              Approved
            </span>

            <span class="text-[12px] font-semibold text-[#111827]">
              ${approved}
            </span>
          </div>

          <div class="flex items-center justify-between">
            <span class="flex items-center gap-2 text-[12px] text-[#F59E0B]">
              <span class="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
              Pending
            </span>

            <span class="text-[12px] font-semibold text-[#111827]">
              ${pending}
            </span>
          </div>

          <div class="flex items-center justify-between">
            <span class="flex items-center gap-2 text-[12px] text-[#EF4444]">
              <span class="w-2 h-2 rounded-full bg-[#EF4444]"></span>
              Rejected
            </span>

            <span class="text-[12px] font-semibold text-[#111827]">
              ${rejected}
            </span>
          </div>

        </div>

      </div>
    `;
      },
    },
  };

  return (
    <div className='bg-white border border-[#CDD0D1] rounded-2xl p-5 h-full '>
      <div className='flex items-center justify-between mb-5'>
        <div>
          <h2 className='text-[18px] font-medium text-[#111827] leading-none mb-0!'>
            Top 5 Agent
          </h2>

          <p className='text-[12px] text-[#6B7280] mt-1.5'>
            Track agent performance and monitoring
          </p>
        </div>
        <div className='flex gap-3'>
          <button className='text-[13px]! text-[#6A7174]! transition-all duration-200 cursor-pointer'>
            View All
          </button>
          <ImageLoader imageKey='ArrowRight' />
        </div>
      </div>
      <Chart options={options} series={series} type='bar' height={310} />
    </div>
  );
};

export default TopAgentsChart;
