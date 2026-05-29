import React from 'react';
import ImageLoader from '../../components/ui/ImageLoader';

const Cards = () => {
  const percentage = 48.6;
  const degree = (percentage / 100) * 360;

  return (
    <div className='grid grid-cols-11 gap-4 w-full'>
      <div className='xl:max-[1399px]:col-span-5 2xl:max-[1499px]:col-span-5 col-span-5 bg-[linear-gradient(288.17deg,#1B829F_8.28%,#124F5F_81.27%)] rounded-2xl min-h-[245px] p-7 relative overflow-hidden text-white'>
        <div className='absolute top-0 right-0 w-[180px] pointer-events-none'>
          <ImageLoader
            imageKey='CircleIcon'
            className='w-full h-full object-contain'
          />
        </div>

        <div className='relative z-10 h-full flex flex-col justify-between'>
          <div className='flex justify-between items-start'>
            <div>
              <div className='flex items-center gap-3 mb-5'>
                <div className='w-[50px] h-[50px] rounded-[14px] bg-white/20 flex items-center justify-center'>
                  <ImageLoader imageKey='VideoKycIcon' />
                </div>

                <div>
                  <p className='text-[14px] mt-2!'>Total V-KYC Sessions</p>

                  <p className='text-[12px] text-white/70'>This Month</p>
                </div>
              </div>

              <h2 className='text-[32px] font-medium leading-none'>5,450</h2>

              <div className='mt-4 flex items-center gap-2'>
                <div className='flex items-center gap-1 bg-[#ECFDF3] px-2 py-1 rounded-[3px]'>
                  <ImageLoader imageKey='Arrowicon' className='w-3 h-3' />

                  <span className='text-[12px] font-semibold text-[#17B26A]'>
                    +15%
                  </span>
                </div>

                <span className='text-[12px] text-white/60'>vs last month</span>
              </div>
            </div>

            <div className='text-right'>
              <div>
                <p className='text-[12px] text-white/70'>Avg. per day</p>

                <h3 className='text-[18px] font-normal! mt-1'>69</h3>
              </div>

              <div className='mt-7'>
                <p className='text-[12px] text-white/60'>Peak day</p>

                <h3 className='text-[18px] font-normal! mt-1'>320</h3>
              </div>
            </div>
          </div>

          <ImageLoader imageKey='TotalVkyc' />
        </div>
      </div>

      <div className='xl:max-[1399px]:col-span-4 col-span-4 bg-white border border-[#CDD0D1] rounded-2xl p-5 min-h-[220px]'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-10 h-10 xl:w-12 xl:h-12 rounded-[10px] bg-[#E9F0F2] flex items-center justify-center'>
            <ImageLoader imageKey='UsageIcon' />
          </div>

          <div>
            <h3 className='font-medium text-[16px] xl:text-[18px] text-[#111827] leading-tight mt-2!'>
              V-CIP Usage
            </h3>
            <p className='text-[11px] xl:text-[12px] text-[#6A7174]'>
              This month
            </p>
          </div>
        </div>

        <div className='flex items-center justify-between gap-4 xl:gap-6'>
          <div className='relative w-[180px] h-[180px] flex items-center justify-center'>
            <div className='absolute inset-0 rounded-full border-12 xl:border-20 border-[#E5E7EB]' />

            <div
              className='absolute inset-0 rounded-full'
              style={{
                background: `conic-gradient(#0B7285 0deg ${degree}deg, transparent ${degree}deg 360deg)`,
              }}
            >
              <div className='absolute inset-3 xl:inset-5 bg-white rounded-full' />
            </div>

            <div className='relative z-10 text-center'>
              <h2 className='text-[22px] xl:text-[24px] font-medium text-[#111827]'>
                {percentage}%
              </h2>
              <p className='text-[12px] xl:text-[13px] text-[#6B7280] mb-0!'>
                Used
              </p>
            </div>
          </div>

          <div className='flex-1 flex flex-col gap-2 xl:gap-3 min-w-0'>
            <div className='bg-[#E9F0F2] rounded-lg px-3 xl:px-4 py-4 flex items-center justify-between'>
              <p className='text-[12px] xl:text-[14px] text-[#051419] font-medium mb-0!'>
                Total :
              </p>
              <h3 className='text-[14px] xl:text-[18px] font-medium text-[#18667C] mb-0!'>
                10,000
              </h3>
            </div>

            <div className='bg-[#FEF3F2] rounded-lg px-3 xl:px-4 py-4 flex items-center justify-between'>
              <p className='text-[12px] xl:text-[14px] text-[#55160C] font-medium mb-0!'>
                Used :
              </p>
              <h3 className='text-[14px] xl:text-[18px] font-medium text-[#F04438] mb-0!'>
                4,800
              </h3>
            </div>

            <div className='bg-[#FFFAEB] rounded-lg px-3 xl:px-4 py-4 flex flex-col justify-center'>
              <div className='flex items-center justify-between'>
                <p className='text-[12px] xl:text-[14px] text-[#4E1D09] font-medium mb-2!'>
                  Remaining :
                </p>
                <ImageLoader imageKey='Crown' />
              </div>

              <h3 className='text-[14px] xl:text-[18px] font-medium text-[#F79009] mb-3!'>
                5,200
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className='xl:max-[1399px]:col-span-2 2xl:max-[1499px]:col-span-2 col-span-2 bg-white rounded-[20px] min-h-[245px] p-4 flex flex-col justify-between shadow-[0px_10px_30px_rgba(15,23,42,0.08)] border border-[#EEF2F6]'>
        <div className='flex justify-center'>
          <ImageLoader imageKey='Sprkles' />
        </div>

        <div>
          <h2 className='text-center font-bold text-[18px] text-[#111827]'>
            Quick Actions
          </h2>

          <p className='text-center text-[12px] text-[#6A7174] leading-5 mb-0!'>
            Onboard new clients and new users provide them with enterprise-grade
            VKYC verification services
          </p>
        </div>

        <div className='space-y-3! w-full'>
          <button className=' w-full h-11 rounded-lg  bg-[linear-gradient(180deg,#18667C_0%,#135263_100%)] px-4 flex items-center justify-between transition-all duration-200 cursor-pointer'>
            <span className='text-[14px]  text-[#FFFFFF] '>Create Case</span>

            <div className='w-[18px] h-[18px] flex items-center justify-center'>
              <ImageLoader imageKey='CreatecaseIcon' />
            </div>
          </button>

          <button
            className=' w-full h-11 rounded-lg  border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#F8FAFC] px-4 flex items-center justify-between text-[#0F172A] transition-all duration-200 cursor-pointer
    '
          >
            <span className='text-[14px]'>Add New Agent</span>

            <ImageLoader imageKey='UserPlus' className='w-4 h-4' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cards;
