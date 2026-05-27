import React, { useState, useEffect } from 'react';
import { Button, Tabs } from 'antd';
import ClientOverviewSection from './ClientOverviewSection';
import ImageLoader from '../../../components/ui/ImageLoader';
import { useHeaderStore } from '../../../store/Header/useHeaderStore';
import { PrimaryButton } from '../../../components/buttons/PrimaryButton';
import { useNavigate } from 'react-router-dom';
import Documents from './Document';
import BillingDetail from './BillingDetail';

const ClientDetail = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { setHeader, clearHeader } = useHeaderStore();
  const navigate = useNavigate();

  const handleCreateAgentPage = (id = '') => {
    navigate(`/clients-list/edit-client/${id}`);
  };

  useEffect(() => {
    setHeader({
      title: '',
      actions: (
        <div>
          <div className='cursor-pointer'>
            <PrimaryButton
              label={'Edit Client'}
              iconLeft={'EditWhiteIcon'}
              onNotify={handleCreateAgentPage}
            />
          </div>
        </div>
      ),
    });

    return () => clearHeader();
  }, []);

  // const documents = [
  //   {
  //     id: 1,
  //     name: 'MSME certificate front.pdf',
  //     type: 'PDF',
  //     size: '1.20 MB',
  //     uploadedDate: '2026-01-10',
  //     verified: true,
  //   },
  //   {
  //     id: 2,
  //     name: 'Business PAN card.png',
  //     type: 'PNG',
  //     size: '820 KB',
  //     uploadedDate: '2026-01-11',
  //     verified: false,
  //   },
  // ];

  const agentsData = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@company.com',
      role: 'Admin',
      roleColor: 'bg-[#F3E8FF] text-[#9333EA]',
      status: 'Active',
    },
    {
      id: 1,
      name: 'John Doe',
      email: 'john@company.com',
      role: 'Checker',
      roleColor: 'bg-[#F3E8FF] text-[#9333EA]',
      status: 'Active',
    },
  ];

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
        <Documents
        // documents={documents}
        />
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
      children: <BillingDetail agents={agentsData} />,
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
      <div className='rounded-[16px] bg-[linear-gradient(90deg,_#057E73_0%,_#32889F_100%)] px-5 py-5 md:px-7 md:py-5'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
          <div className='flex flex-col sm:flex-row sm:items-center gap-6 lg:gap-10'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0'>
                <ImageLoader imageKey='tickicons' className='w-5 h-5' />
              </div>

              <div>
                <p className='text-[13px] text-white/70 mb-1'>Client ID</p>

                <h2 className='text-[16px] md:text-[15px] font-semibold! text-white tracking-wide'>
                  TUTTUTOMNFK00094
                </h2>
              </div>
            </div>

            <div className='hidden lg:block h-12 w-[1px] bg-white/20' />

            <div>
              <p className='text-[13px] text-white/70 mb-1'>Member Since</p>

              <h2 className='text-[16px] font-semibold! text-white'>
                2026-01-10
              </h2>
            </div>

            <div className='hidden lg:block h-12 w-[1px] bg-white/20' />

            <div>
              <p className='text-[13px] text-white/70 mb-1'>Plan Type</p>

              <h2 className='text-[16px] font-semibold! text-white'>
                Human Agent V-KYC
              </h2>
            </div>
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
