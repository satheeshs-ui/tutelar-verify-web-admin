import React, { Children } from 'react';
import { useState } from 'react';
import ImageLoader from '../../components/ui/ImageLoader';
import { Drawer } from 'antd';
import SecondaryButton from '../buttons/SecondaryButton';
import { PrimaryButton } from '../buttons/PrimaryButton';
import CommonSideDrawer from './CommonSideDrawer';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const CommonFilter = ({
  children,
  onApply,
  onReset,
  dateRange,
  setDateRange,
}) => {
  const [open, setOpen] = useState(false);
  const handleApply = () => {
    onApply && onApply();
    setOpen(false);
  };

  const handleReset = () => {
    onReset && onReset();
  };
  return (
    <div>
      <div onClick={() => setOpen(true)}>
        <ImageLoader
          imageKey='filtericons'
          className={
            'py-1.5 px-3 bg-[#F9FAFB] border! border-[#E6E7E8] rounded-lg cursor-pointer'
          }
        />
      </div>

      {/* drawer */}

      <CommonSideDrawer
        title='Filters'
        placement='right'
        width='500px'
        open={open}
        onClose={() => setOpen(false)}
        className='bg-white rounded-tl-2xl rounded-bl-2xl'
        footer={
          <>
            <div className='w-full flex justify-end mt-0'>
              <div className='flex gap-2'>
                <SecondaryButton label='Reset' onNotify={handleReset} />
                <PrimaryButton label='Apply' onNotify={handleApply} />
              </div>
            </div>
          </>
        }
      >
        <div className='flex flex-col'>{children}</div>
        <div className='mt-4'>
          <p className='text-[#2C3436] text-[14px] font-normal'>Date Range</p>

          <RangePicker
            className='w-full mt-2 h-11 rounded-xl!'
            value={dateRange}
            format='YYYY-MM-DD'
            disabledDate={current => current && current > dayjs().endOf('day')}
            onChange={dates => {
              setDateRange(dates);
            }}
          />
        </div>
      </CommonSideDrawer>
    </div>
  );
};

export default CommonFilter;
