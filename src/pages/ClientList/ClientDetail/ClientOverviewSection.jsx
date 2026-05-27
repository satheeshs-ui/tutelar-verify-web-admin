import React from 'react';
import { Mail, Phone, FileText, MessageSquare, RefreshCw } from 'lucide-react';
import ImageLoader from '../../../components/ui/ImageLoader';

const quickActions = [
  {
    label: 'Send Message',
    icon: (
      <ImageLoader imageKey='SendMessage' className='w-4 h-4 md:w-5 md:h-5' />
    ),
  },
  {
    label: 'Generate Report',
    icon: (
      <ImageLoader imageKey='Reporticon' className='w-4 h-4 md:w-5 md:h-5' />
    ),
  },
  {
    label: 'Sync Data',
    icon: (
      <ImageLoader imageKey='SynceDetaicon' className='w-4 h-4 md:w-5 md:h-5' />
    ),
  },
];

const metrics = [
  {
    title: 'SUCCESS RATE',
    value: '94.2%',
    width: '94%',
    color: '#22C55E',
  },
  {
    title: 'AVG RESPONSE TIME',
    value: '94.2%',
    width: '94%',
    color: '#3B82F6',
  },
  {
    title: 'CUSTOMER SATISFACTION',
    value: '4.8/5.0',
    width: '96%',
    color: '#D946EF',
  },
];

const stats = [
  {
    value: '89',
    label: 'New KYCs This Month',
  },
  {
    value: '142',
    label: 'Active Users',
  },
  {
    value: '98.5%',
    label: 'Uptime',
  },
];

function ClientOverviewSection() {
  return (
    <div className='w-full  p-4'>
      <div className='grid grid-cols-2 xl:grid-cols-12 gap-4'>
        <div className='xl:col-span-8'>
          <div className='bg-white border border-[#CDD0D1] rounded-[12px] overflow-hidden'>
            <div className='flex items-center gap-3 px-4 py-4 border-b border-[#CDD0D1] bg-[#F9FAFB]'>
              <ImageLoader
                imageKey='Companyinfo'
                className='w-5 h-5 text-[#1F2937]'
              />

              <p className='text-[18px] font-medium text-[#111827] mb-0!'>
                Company Information
              </p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-10 p-4'>
              <InfoItem
                icon={<ImageLoader imageKey='InboxMail' />}
                label='EMAIL ADDRESS'
                value='contact@acmefinancial.com'
              />

              <InfoItem
                icon={<ImageLoader imageKey='ServicesIcon' />}
                label='INDUSTRY'
                value='Financial Services'
              />

              <InfoItem
                icon={<ImageLoader imageKey='phoneIcon' />}
                label='PHONE NUMBER'
                value='+1 (555) 123-4567'
              />

              <InfoItem
                icon={<ImageLoader imageKey='Enterprise' />}
                label='COMPANY SIZE'
                value='Enterprise'
              />

              <InfoItem
                icon={<ImageLoader imageKey='WebsiteIcon' />}
                label='WEBSITE'
                value={
                  <div className='flex items-center gap-2 text-[#0E7490] underline cursor-pointer'>
                    www.acmefinancial.com
                    <ImageLoader
                      imageKey='CopyIcon'
                      className='w-[14px] h-[14px] text-[#0E7490]'
                    />
                  </div>
                }
              />

              <InfoItem
                icon={<ImageLoader imageKey='LocationIcon' />}
                label='LOCATION'
                value='123 Business Avenue, New York, NY 10001'
              />
            </div>
          </div>
        </div>

        <div className='xl:col-span-4'>
          <div className='bg-gradient-to-b from-[#18667C] to-[#135263] rounded-[20px] p-8 h-full text-white'>
            <h2 className='text-[18px] font-medium mb-7!'>Contact Details</h2>

            <div className='flex items-center gap-4 mb-6'>
              <div className='w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-[16px] font-semibold'>
                SM
              </div>

              <div>
                <h3 className='text-[16px] font-[400] leading-none'>
                  Sarah Mitchell
                </h3>

                <p className='text-[#CBFBF1] mt-1 text-[12px]'>
                  Senior Account Manager
                </p>
              </div>
            </div>

            <div className='bg-white/20 rounded-[12px] p-4 border border-white/10'>
              <div className='flex items-center gap-3 pb-4 border-b border-white/20'>
                <Mail size={18} />

                <span className='text-[14px]'>
                  sarah.mitchell@acmefinancial.com
                </span>
              </div>

              <div className='flex items-center gap-3 pt-4'>
                <Phone size={18} />

                <span className='text-[14px]'>+91 987 787 0989</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 xl:grid-cols-12 gap-4 mt-4 items-stretch'>
        <div className='xl:col-span-4 flex'>
          <div className='bg-white border border-[#CDD0D1] rounded-[12px] p-4 md:p-5 w-full flex flex-col '>
            <h2 className='text-[16px] md:text-[18px] font-semibold text-[#111827] mb-5'>
              Quick Actions
            </h2>

            <div className='flex flex-col gap-3 flex-1'>
              {quickActions.map((item, index) => (
                <button
                  key={index}
                  className='w-full flex items-center gap-3 bg-[#F3F3F3]  border border-[#CDD0D1] rounded-[12px] px-3 py-3 transition-all duration-200'
                >
                  <div className='w-10 h-10 min-w-[40px] rounded-[10px] bg-white border border-[#ECEEF2] flex items-center justify-center '>
                    {item.icon}
                  </div>

                  <span className='text-[13px] md:text-[14px] font-medium text-[#314158] text-left leading-[18px]'>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className='xl:col-span-8 flex'>
          <div className='bg-white border border-[#CDD0D1] rounded-[12px] overflow-hidden  w-full flex flex-col'>
            <div className='flex items-center gap-3 px-4 md:px-5 py-4 border-b border-[#CDD0D1] bg-[#F9FAFB]'>
              <ImageLoader
                imageKey='MetriceIcon'
                className='w-4 h-4 md:w-5 md:h-5'
              />

              <h2 className='text-[15px] sm:text-[16px] md:text-[18px] font-medium text-[#111827] mb-0 leading-none mb-0!'>
                Performance Metrics
              </h2>
            </div>

            <div className='p-4 md:p-5 flex flex-col justify-between h-full mt-5'>
              <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'>
                {metrics.map((item, index) => (
                  <div key={index}>
                    <div className='flex items-center justify-between mb-3'>
                      <span className='text-[11px] md:text-[12px] font-medium text-[#6B7280] uppercase tracking-wide'>
                        {item.title}
                      </span>

                      <span
                        className='text-[11px] md:text-[12px] font-semibold'
                        style={{ color: item.color }}
                      >
                        {item.value}
                      </span>
                    </div>

                    <div className='w-full h-[6px] bg-[#ECEEF2] rounded-full overflow-hidden'>
                      <div
                        className='h-full rounded-full transition-all duration-500'
                        style={{
                          width: item.width,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-3 border-t border-[#CDD0D1] mt-6'>
                {stats.map((item, index) => (
                  <div
                    key={index}
                    className={`
                flex flex-col items-center justify-center
                py-5 px-3
                ${index !== stats.length - 1 ? '' : ''}
              `}
                  >
                    <h3 className='text-[22px] sm:text-[24px] md:text-[28px] font-medium text-[#16262B] leading-none'>
                      {item.value}
                    </h3>

                    <p className='text-[11px] md:text-[12px] text-[#6B7280] mt-2 text-center leading-[18px]'>
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const InfoItem = ({ icon, label, value }) => {
  return (
    <div>
      <p className='text-[12px] font-medium text-[#6A7174] mb-2'>{label}</p>

      <div className='flex items-center gap-2 text-[15px] text-[#111827] font-medium'>
        <span className='text-[#6B7280]'>{icon}</span>

        <span>{value}</span>
      </div>
    </div>
  );
};

function MetricItem({ title, value, width, color, text }) {
  return (
    <div>
      <div className='flex items-center justify-between mb-2'>
        <span className='text-[13px] tracking-wide text-[#6B7280] font-medium'>
          {title}
        </span>

        <span className={`text-[14px] font-semibold ${text}`}>{value}</span>
      </div>

      <div className='w-full h-3 rounded-full bg-[#EEF2F7] overflow-hidden'>
        <div className={`h-full rounded-full ${color}`} style={{ width }} />
      </div>
    </div>
  );
}

function StatBox({ value, label }) {
  return (
    <div>
      <h2 className='text-[32px] font-bold text-[#111827] leading-none'>
        {value}
      </h2>

      <p className='text-[13px] text-[#6B7280] mt-2'>{label}</p>
    </div>
  );
}

export default ClientOverviewSection;
