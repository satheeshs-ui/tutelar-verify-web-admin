import React from 'react';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  Activity,
  FileText,
  MessageSquare,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import ImageLoader from '../../../components/ui/ImageLoader';

const quickActions = [
  {
    label: 'Send Message',
    icon: <MessageSquare size={16} />,
  },
  {
    label: 'Generate Report',
    icon: <FileText size={16} />,
  },
  {
    label: 'Sync Data',
    icon: <RefreshCw size={16} />,
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
          <div className='bg-white border border-[#E5E7EB] rounded-[12px] overflow-hidden'>
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
          <div className='bg-gradient-to-b from-[#18667C] to-[#135263] rounded-[20px] p-5 h-full text-white'>
            <h2 className='text-[18px] font-medium mb-6'>Contact Details</h2>

            <div className='flex items-center gap-4 mb-6'>
              <div className='w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-[16px] font-semibold'>
                SM
              </div>

              <div>
                <h3 className='text-[16px] font-[400] leading-none'>
                  Sarah Mitchell
                </h3>

                <p className='text-white/70 mt-1 text-[12px]'>
                  Senior Account Manager
                </p>
              </div>
            </div>

            <div className='bg-white/15 rounded-[18px] p-4 border border-white/10'>
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

      <div className='grid grid-cols-2 xl:grid-cols-12 gap-4 mt-4'>
        <div className='xl:col-span-4'>
          <div className='bg-white border border-[#E5E7EB] rounded-[12px] p-4 h-full'>
            <h2 className='text-[18px] font-bold text-[#111827] mb-6'>
              Quick Actions
            </h2>

            <div className='space-y-6'>
              {quickActions.map((item, index) => (
                <button
                  key={index}
                  className='w-full flex items-center gap-4 bg-[#F3F3F3]  border border-[#CDD0D1] rounded-[8px] px-3 py-2 transition-all mb-3! '
                >
                  <div className='w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#6B7280] shadow-sm'>
                    {item.icon}
                  </div>

                  <span className='text-[14px] font-medium text-[#314158]'>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className='xl:col-span-8'>
          <div className='bg-white border border-[#E5E7EB] rounded-[12px] md:rounded-[16px] p-4 sm:p-5 shadow-sm'>
            <div className='flex items-center gap-2 border-b border-[#ECEEF2] pb-3 md:pb-4'>
              <ImageLoader
                imageKey='Activity'
                className='w-4 h-4 md:w-5 md:h-5 text-black!'
              />

              <h2 className='text-[14px] sm:text-[16px] md:text-[18px] font-medium text-[#111827] leading-tight'>
                Performance Metrics
              </h2>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 mt-5 md:mt-6 pt-4 md:pt-5 gap-4 md:gap-5'>
              {metrics.map((item, index) => (
                <div key={index}>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-[10px] sm:text-[11px] md:text-[12px] font-medium text-[#6B7280] uppercase tracking-wide'>
                      {item.title}
                    </span>

                    <span
                      className='text-[10px] sm:text-[11px] md:text-[12px] font-semibold'
                      style={{ color: item.color }}
                    >
                      {item.value}
                    </span>
                  </div>

                  <div className='w-full h-[5px] sm:h-[6px] md:h-[7px] bg-[#ECEEF2] rounded-full overflow-hidden'>
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

            <div className='grid grid-cols-1 sm:grid-cols-3 border-t border-[#ECEEF2] mt-5 md:mt-6 pt-5 gap-4 sm:gap-0'>
              {stats.map((item, index) => (
                <div
                  key={index}
                  className={`
          text-center px-2 py-2 sm:py-0
          ${index === 1 ? 'sm:border-x border-[#ECEEF2]' : ''}
        `}
                >
                  <h3 className='text-[20px] sm:text-[24px] md:text-[28px] font-semibold text-[#111827] leading-tight'>
                    {item.value}
                  </h3>

                  <p className='text-[10px] sm:text-[11px] md:text-[12px] text-[#6B7280] mt-1 leading-[16px] md:leading-[18px]'>
                    {item.label}
                  </p>
                </div>
              ))}
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
