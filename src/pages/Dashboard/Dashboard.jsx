import React, { useEffect, useState } from 'react';
import { useHeaderStore } from '../../store/Header/useHeaderStore';
import Cards from './Cards';
import SessionResultChart from './DashboardServices/DashboardChart/SessionChart';
import TopAgentsChart from './TopAgentsChart';

const Dashboard = () => {
  const { setHeader, clearHeader } = useHeaderStore();
  const [activeFilter, setActiveFilter] = useState('7');
  useEffect(() => {
    const buttons = [
      { id: '7', label: 'Last 7 days' },
      { id: '30', label: 'Last 30 days' },
      { id: '90', label: 'Last 90 days' },
    ];

    setHeader({
      title: '',
      actions: (
        <div className='flex gap-3'>
          <div className='flex gap-2'>
            {buttons.map(btn => (
              <button
                key={btn.id}
                onClick={() => setActiveFilter(btn.id)}
                className={`px-4 py-2 rounded-[5px] text-[12px] border transition-all duration-200 cursor-pointer ${
                  activeFilter === btn.id
                    ? 'border-[#18667C] text-[#18667C]! bg-[#18667C0F]'
                    : 'border-[#CDD0D1] text-[#6A7174]! bg-white'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      ),
    });

    return () => clearHeader();
  }, [activeFilter, clearHeader, setHeader]);

  return (
    <div className=' min-h-screen'>
      <Cards />
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6'>
        <SessionResultChart />
        <TopAgentsChart />
      </div>
    </div>
  );
};

export default Dashboard;
