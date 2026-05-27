import React from 'react';
import { Mail } from 'lucide-react';
import ImageLoader from '../../../components/ui/ImageLoader';

const BillingDetail = ({ agents = [] }) => {
  const roleColors = {
    Admin: 'bg-[#F3E8FF] text-[#8200DB]',
    Manager: 'bg-[#DBEAFE] text-[#1447E6]',
    Maker: 'bg-[#18667C0F] text-[#18667C]',
    Checker: 'bg-[#CBFBF1] text-[#17B26A]',
  };
  return (
    <div className=' overflow-hidden'>
      <div className='px-4 md:px-6 py-5 border-b border-[#CDD0D1]'>
        <h2 className='text-[16px] md:text-[16px] font-semibold! text-[#111827] mb-0!'>
          Total Agents
        </h2>

        <p className='text-[13px] md:text-[14px] text-[#818A8C] mt-1'>
          {agents?.length || 0} Agents in this organization
        </p>
      </div>

      {agents?.length === 0 ? (
        <div className='py-14 flex items-center justify-center text-[#6B7280] text-[14px]'>
          No Agents Found
        </div>
      ) : (
        <div className=''>
          {agents.map((agent, index) => (
            <div
              key={agent?.id || index}
              className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-4 md:px-6 py-5 border-b border-[#CDD0D1]'
            >
              <div className='flex items-start gap-4 min-w-0'>
                <div className='w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#14B8A6] flex items-center justify-center text-white font-semibold text-[14px] md:text-[16px] shrink-0 uppercase'>
                  {agent?.initials ||
                    agent?.name
                      ?.split(' ')
                      ?.map(word => word[0])
                      ?.join('')
                      ?.slice(0, 2)}
                </div>

                <div className='min-w-0'>
                  <h3 className='text-[15px] md:text-[16px] font-semibold! text-[#0B1C20]'>
                    {agent?.name || '-'}
                  </h3>

                  <div className='flex flex-wrap items-center gap-2 mt-1'>
                    <div className='flex items-center gap-1 text-[#6A7174] text-[13px] md:text-[14px] min-w-0'>
                      <ImageLoader imageKey='InboxMail' />

                      <span className='truncate'>{agent?.email || '-'}</span>
                    </div>

                    {agent?.role && (
                      <>
                        <span className='text-[#9CA3AF]'>•</span>

                        <span
                          className={`
          px-2 py-[3px] rounded-full
          text-[11px] md:text-[12px]
          font-medium whitespace-nowrap
          ${roleColors[agent.role]}
        `}
                        >
                          {agent.role}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className='lg:mr-30'>
                <div
                  className={`flex items-center gap-2 rounded-full px-4 py-1 w-fit border
          ${
            agent?.status === 'Active'
              ? 'border-[#CDD0D1] '
              : 'border-[#CDD0D1] '
          }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full
            ${agent?.status === 'Active' ? 'bg-[#22C55E]' : 'bg-[#EF4444]'}`}
                  />

                  <span className='text-[13px] md:text-[14px] font-medium text-[#111827]'>
                    {agent?.status || 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BillingDetail;
