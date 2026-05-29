
import React from 'react';
import Chart from 'react-apexcharts';

const VCIPUsageChart = () => {
  const total = 10000;
  const used = 4800;
  const remaining = total - used;

  const percentage = ((used / total) * 100).toFixed(1);

  const series = [used, remaining];

  const options = {
    chart: {
      type: 'donut',
    },
    stroke: {
      width: 0,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val) => val.toLocaleString(),
      },
    },
    colors: ['#0B7285', '#E5E7EB'],
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
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
        donut: {
          size: '78%',
          labels: {
            show: true,
            name: {
              show: false,
            },
            value: {
              show: true,
              fontSize: '34px',
              fontWeight: 600,
              color: '#111827',
              offsetY: -2,
              formatter: () => `${percentage}%`,
            },
            total: {
              show: true,
              label: 'Used',
              fontSize: '14px',
              fontWeight: 400,
              color: '#6B7280',
              formatter: () => '',
            },
          },
        },
      },
    },
  };

  return (
    <div className='bg-white border border-[#CDD0D1] rounded-2xl p-5 min-h-[220px]'>
      <div className='flex items-center gap-3 mb-4'>
        <div className='w-10 h-10 rounded-[10px] bg-[#E9F0F2] flex items-center justify-center'>
          📊
        </div>

        <div>
          <h3 className='font-medium text-[18px] text-[#111827] leading-tight'>
            V-CIP Usage
          </h3>

          <p className='text-[12px] text-[#6A7174]'>
            This month
          </p>
        </div>
      </div>

      <div className='flex items-center justify-between gap-6'>
        {/* Donut Chart */}
        <div className='relative w-[220px]'>
          <Chart
            options={options}
            series={series}
            type='donut'
            height={220}
          />

          <div className='absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-4 text-center'>
            <p className='text-[13px] text-[#6B7280] mb-0'>
              Used
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className='flex-1 flex flex-col gap-3 min-w-0'>
          <div className='bg-[#E9F0F2] rounded-lg px-4 py-4 flex items-center justify-between'>
            <p className='text-[14px] text-[#051419] font-medium mb-0'>
              Total :
            </p>

            <h3 className='text-[18px] font-medium text-[#18667C] mb-0'>
              {total.toLocaleString()}
            </h3>
          </div>

          <div className='bg-[#FEF3F2] rounded-lg px-4 py-4 flex items-center justify-between'>
            <p className='text-[14px] text-[#55160C] font-medium mb-0'>
              Used :
            </p>

            <h3 className='text-[18px] font-medium text-[#F04438] mb-0'>
              {used.toLocaleString()}
            </h3>
          </div>

          <div className='bg-[#FFFAEB] rounded-lg px-4 py-4'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-[14px] text-[#4E1D09] font-medium mb-0'>
                Remaining :
              </p>

              👑
            </div>

            <h3 className='text-[18px] font-medium text-[#F79009] mb-0'>
              {remaining.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VCIPUsageChart;