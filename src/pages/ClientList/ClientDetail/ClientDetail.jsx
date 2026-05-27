import React, { useState, useEffect } from 'react';

import { Button, Tabs } from 'antd';
import ClientOverviewSection from './ClientOverviewSection';
import ImageLoader from '../../../components/ui/ImageLoader';
import { useHeaderStore } from '../../../store/Header/useHeaderStore';
import { PrimaryButton } from '../../../components/buttons/PrimaryButton';

const ClientDetail = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { setHeader, clearHeader } = useHeaderStore();

  useEffect(() => {
    setHeader({
      title: '',
      actions: (
        <div>
          <div>
            <PrimaryButton label={'Edit Client'} iconLeft={'EditWhiteIcon'} />
          </div>
        </div>
      ),
    });

    return () => clearHeader();
  }, []);

  const items = [
    {
      key: 'overview',
      label: (
        <div className='flex items-center gap-2'>
          <ImageLoader imageKey='OverViewIcon' className='w-4 h-5' />

          <span>Overview</span>
        </div>
      ),
      children: <ClientOverviewSection />,
    },
    {
      key: 'documents',
      label: (
        <div className='flex items-center gap-2'>
          <ImageLoader imageKey='OverViewIcon' className='w-4 h-5' />

          <span>Documents</span>
        </div>
      ),
      children: (
        <div className='bg-white rounded-[24px] p-10 text-center text-[#667085]'>
          Documents Content
        </div>
      ),
    },
    {
      key: 'billing',
      label: (
        <div className='flex items-center gap-2'>
          <ImageLoader imageKey='settlementsIcon' className='w-4 h-5' />
          <span>Billing</span>
        </div>
      ),
      children: (
        <div className='bg-white rounded-[24px] p-10 text-center text-[#667085]'>
          Billing Content
        </div>
      ),
    },
    {
      key: 'activity',
      label: (
        <div className='flex items-center gap-2'>
          <ImageLoader imageKey='Activity' className='w-4 h-5' />

          <span>Activity</span>
        </div>
      ),
      children: (
        <div className='bg-white rounded-[24px] p-10 text-center text-[#667085]'>
          Activity Content
        </div>
      ),
    },
    {
      key: 'settings',
      label: (
        <div className='flex items-center gap-2'>
          <ImageLoader imageKey='MenuSettingsIcon' className='w-4 h-5' />

          <span>Settings</span>
        </div>
      ),
      children: (
        <div className='bg-white rounded-[24px] p-10 text-center text-[#667085]'>
          Settings Content
        </div>
      ),
    },
  ];

  return (
    <div className=''>
      <div className='rounded-[16px] bg-gradient-to-r from-[#057E73] to-[#32889F] px-6 py-5'>
        <div className='grid grid-cols-1 lg:grid-cols-3 items-center'>
          <div className='flex items-center gap-4'>
            <div className='w-10 h-10 flex items-center justify-center rounded-[14px] bg-white/10'>
              <ImageLoader imageKey='tickicons' className='w-5 h-5' />
            </div>

            <div className='leading-tight'>
              <p className='text-[13px] text-white/70'>Client ID</p>
              <h2 className='text-[16px] font-semibold text-white tracking-wide'>
                TUTTUTOMNFK00094
              </h2>
            </div>
          </div>

          <div className='lg:border-l lg:border-white/20 lg:px-8 flex flex-col justify-center mt-4 lg:mt-0'>
            <p className='text-[13px] text-white/70'>Member Since</p>
            <h2 className='text-[16px] font-semibold text-white'>2026-01-10</h2>
          </div>

          <div className='lg:border-l lg:border-white/20 lg:px-8 flex flex-col justify-center mt-4 lg:mt-0'>
            <p className='text-[13px] text-white/70'>Plan Type</p>
            <h2 className='text-[16px] font-semibold text-white'>
              Human Agent V-KYC
            </h2>
          </div>
        </div>
      </div>
      <div className='mt-6 custom-tabs-wrapper'>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items}
          size='large'
        />
      </div>
    </div>
  );
};

export default ClientDetail;
