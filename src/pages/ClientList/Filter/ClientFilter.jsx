import { useEffect, useState, useRef } from 'react';

import { DatePicker, Input, Select } from 'antd';

const ClientFilter = ({
  onFilterChange,
  onValueChange,
  filterOptions,
  reset,
  setClear,
  value,
  selectedFilter,
}) => {
  const dropdownRef = useRef(null);

  const [selected, setSelected] = useState(null);

  const { RangePicker } = DatePicker;
  //   const [dateRange, setDateRange] = useState([null, null]);

  useEffect(() => {
    if (selectedFilter && filterOptions?.length) {
      const found = filterOptions.find(f => f.value === selectedFilter);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelected(found || null);
    } else {
      setSelected(null);
    }
  }, [selectedFilter, filterOptions]);
  useEffect(() => {
    if (!reset) return;

    const found = filterOptions.find(f => f.value === selectedFilter);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelected(found || null);

    onValueChange && onValueChange('');

    setClear && setClear(false);
  }, [reset]);

  return (
    <div className='relative w-full' ref={dropdownRef}>
      <div>
        <p className='text-[#2C3436] overall-table-text text-[14px]'>
          Search By
        </p>
        <Select
          value={selectedFilter}
          onChange={value => {
            const selectedItem = (filterOptions || []).find(
              f => f.value === value,
            );
            setSelected(selectedItem || null);
            onFilterChange && onFilterChange(value);
          }}
          placeholder='Select'
          options={filterOptions}
          className='w-full mt-1 h-11 rounded-xl! focus:shadow-none '
          style={{ height: '45px' }}
        />

        {selected && selected?.value !== 'dateRange' && (
          <div className='border-[#CDD0D1]! bg-white w-full mt-4'>
            <Input
              type='text'
              placeholder={`Search ${selected.label}`}
              value={value || ''}
              onChange={e => {
                onValueChange && onValueChange(e.target.value);
              }}
              className='flex-1 px-3 py-3! outline-none h-11 rounded-xl! focus:shadow-none '
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientFilter;
