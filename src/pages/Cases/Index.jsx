import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterSearch from '../../components/ui/FilterSearch';
import UniversalTable from '../../components/ui/Table/UniversalTable';
import Pagination from '../../components/ui/Table/Pagination';
import {
  checkValue,
  getStatusColors,
  removeUnderScore,
  shouldShowPagination,
} from '../../utils';
import {
  TooltipCellOrFirstObject,
  TooltipCellOrSecondObject,
} from '../../components/ui/TooltipCell';
// import { Tooltip } from 'antd';
import { Copy, ExternalLink } from 'lucide-react';
import LottieLoader from '../../components/ui/LottieUnique/LottieLoader';
import { useAppStore } from '../../store/app.store';
import dayjs from 'dayjs';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import config from '../../utils/config';
import useCaseStore from '../../store/Case/useCaseStore';
import { usePermission } from '../../components/hooks/usePermission';
import AntdSelect from '../../components/ui/AntdSelect';
import AgentScheduleModal from '../../components/ui/Modal/AgentScheduleModal';
import CommonFilter from '../../components/ui/Filter';
import { useHeaderStore } from '../../store/Header/useHeaderStore';
import ImageLoader from '../../components/ui/ImageLoader';

const CaseList = () => {
  const {
    getCaseList,

    caseList,

    isLoading,
  } = useCaseStore();
  const { getPermission } = usePermission();
  const permission = getPermission();
  const caseListData = caseList;
  const { setHeader, clearHeader } = useHeaderStore();

  const filterOptions = [
    { label: 'Case Id', value: 'caseId' },
    { label: 'Name', value: 'name' },
    { label: 'Email', value: 'email' },
    { label: 'Mobile', value: 'phone' },
    // { label: "Date Range", value: "dateRange" },
  ];

  const [entityTypes] = useState([
    { label: 'Individual', value: 'individual' },
    { label: 'Partnership / LLP', value: 'partnership' },
    { label: 'Private Limited', value: 'private_limited' },
    { label: 'Sole Proprietorship', value: 'sole_proprietorship' },
    { label: 'Trust/NGO', value: 'ngo_trust' },

    // Private Limited, Sole Proprietorship, Partnership / LLP, Public Limited, Trust/NGO
  ]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [selectType, setSelectType] = useState('caseId');
  const [caseStatus, setStatus] = useState('');
  const [reviewStatus, setReviewstatus] = useState('');

  const { userDetails } = useAppStore()?.userDetails || {};
  //   const [copiedTxt, setCopyText] = useState('');
  const [scheduledDateTime, setScheduledDateTime] = useState(null);

  const [clear, setClear] = useState(false);
  const [applyTrigger, setApplyTrigger] = useState(0);

  const [dateRange, setDateRange] = useState([null, null]);
  const navigate = useNavigate();

  const [entityTypeFilter, setEntityTypeFilter] = useState('');

  const totalRecords = caseListData?.total;
  const totalPages = totalRecords > 0 ? Math.ceil(totalRecords / limit) : 0;
  const startDate = dateRange?.[0]
    ? dayjs(dateRange[0]).startOf('day').toISOString()
    : null;

  const endDate = dateRange?.[1]
    ? dayjs(dateRange[1]).endOf('day').toISOString()
    : null;
  const params = useMemo(
    () => ({
      page,
      limit,
      ...(search ? { [selectType]: search } : {}),
      ...(caseStatus && caseStatus !== 'all' ? { caseStatus } : {}),
      ...(reviewStatus && reviewStatus !== 'all' ? { reviewStatus } : {}),
      ...(entityTypeFilter ? { entity: entityTypeFilter } : {}),
      ...(startDate && endDate && { startDate, endDate }),
    }),
    [
      page,
      limit,
      search,
      selectType,
      caseStatus,
      reviewStatus,
      entityTypeFilter,
      startDate,
      endDate,
    ],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    handleTable();
  }, [page, limit, applyTrigger, clear]);

  const handleTable = async () => {
    await getCaseList(params);
  };

  const handleCreateCase = async () => {
    navigate('/cases/cases-list/create-case');
  };

  const handleFilterChange = filterType => {
    setSelectType(filterType);
    setSearch('');
  };

  const handleValueChange = value => {
    setSearch(value.trim());
  };

  //   const handleCopied = async text => {
  //     setCopyText(text);
  //     await navigator.clipboard.writeText(text);
  //     setTimeout(() => {
  //       setCopyText('');
  //     }, 1000);
  //   };

  const handleApply = () => {
    setPage(1);
    setApplyTrigger(prev => prev + 1);
    // handleTable();
  };
  const handleReset = () => {
    setSearch('');
    setSelectType('caseId');
    setStatus('');
    setReviewstatus('');
    setEntityTypeFilter('');
    setDateRange([null, null]);
    setClear(true);
    setPage(1);
  };

  const [isSchedulePending, setIsSchedulePending] = useState(false);

  useEffect(() => {
    if (!scheduledDateTime || !isSchedulePending) return;

    const scheduledTime = new Date(scheduledDateTime).getTime();

    const interval = setInterval(() => {
      const now = Date.now();

      if (now >= scheduledTime) {
        setIsSchedulePending(false);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [scheduledDateTime, isSchedulePending]);

  const handleCallConnect = (e, u) => {
    e.preventDefault();

    if (!u) return;

    const scheduledTime = u?.scheduledDateTime
      ? new Date(u.scheduledDateTime)
      : null;

    const now = new Date();

    setScheduledDateTime(scheduledTime);

    if (scheduledTime && now < scheduledTime) {
      setIsSchedulePending(true);
    } else {
      setIsSchedulePending(false);
      window.open(`/agents/agent-call/${u?.caseId}?name=${u?.name}`, '_self');
    }
  };

  const [caseSearch] = useState('');
  const filteredData = caseListData?.cases?.filter(item =>
    item.name?.toLowerCase().includes(caseSearch.toLowerCase()),
  );

  useEffect(() => {
    setHeader({
      title: '',
      actions: (
        <div className='flex gap-3'>
          {/* <div class="flex gap-2 p-3 bg-[#F9FAFB] border border-[#E6E7E8] rounded-[8px]">
                            {searchIcon}
                            <input
                                type="text"
                                placeholder="Search by name"
                                class="font-normal text-[#6A7174] text-[14px]"
                                value={caseSearch}
                                onChange={(e) => setCaseSearch(e.target.value)}
                            />
                        </div> */}
          <div>
            <CommonFilter
              onApply={handleApply}
              onReset={handleReset}
              dateRange={dateRange}
              setDateRange={setDateRange}
            >
              <div className='flex flex-col'>
                <div className='mt-0'>
                  <FilterSearch
                    onFilterChange={handleFilterChange}
                    onValueChange={handleValueChange}
                    filterOptions={filterOptions}
                    reset={clear}
                    setClear={setClear}
                    value={search}
                    selectedFilter={selectType}
                  />
                </div>

                <div className='mt-4'>
                  <label>Case Status</label>
                  <div className='flex flex-wrap gap-3 mt-3'>
                    {[
                      { value: 'created', label: 'Created' },
                      { value: 'processing', label: 'Processing' },
                      { value: 'completed', label: 'Completed' },
                      { value: 'expired', label: 'Expired' },
                    ].map(item => (
                      <button
                        key={item.value}
                        onClick={() => setStatus(item.value)}
                        className={`py-2 px-3 rounded-full border border-[#CDD0D1] text-sm transition cursor-pointer
                        ${
                        caseStatus === item.value
                        ? 'bg-linear-to-b from-[#18667C] to-[#135263] text-white! border-[#5b93a1]'
                        : 'bg-white text-gray-600'}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className='mt-4'>
                  <label>Review Status</label>
                  <div className='flex flex-wrap gap-3 mt-3'>
                    {[
                      { value: 'pending', label: 'Pending' },
                      { value: 'approved', label: 'Approved' },
                      { value: 'rejected', label: 'Rejected' },
                      // {
                      //     value: "agent_approved",
                      //     label: "Agent Approved",
                      // },
                      {
                        value: 'auditor_approved',
                        label: 'Auditor Approved',
                      },
                    ].map(item => (
                      <button
                        key={item.value}
                        onClick={() => setReviewstatus(item.value)}
                        className={`py-2 px-3 rounded-full border border-[#CDD0D1] text-sm transition cursor-pointer
                        ${
                        reviewStatus ===
                        item.value
                        ? 'bg-linear-to-b from-[#18667C] to-[#135263] text-white! border-[#5b93a1]'
                        : 'bg-white text-gray-600 '}`} >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className='mt-4'>
                  <AntdSelect
                    label='Entity Type'
                    placeholder='Select entity types'
                    options={entityTypes}
                    value={entityTypeFilter || undefined}
                    onChange={value => setEntityTypeFilter(value)}
                  />
                </div>
              </div>
            </CommonFilter>
          </div>

          <div>
            {permission?.write && userDetails?.role !== 'agent' && (
              <PrimaryButton
                label='Create Cases'
                onClick={() => handleCreateCase('')}
                iconLeft={'CreateIcon'}
              />
            )}
          </div>
        </div>
      ),
    });

    return () => clearHeader();
  }, [
    clearHeader,
    setHeader,
    navigate,
    reviewStatus,
    caseStatus,
    search,
    selectType,
    dateRange,
  ]);

  return (
    <>
      <div className=''>
        {isLoading ? (
          <LottieLoader lottieKey='loaderIcon' playerClass='w-[80px]' />
        ) : (
          <>
            <UniversalTable
              nodatamessage='Oops! There’s nothing here'
              describemessage='There is nothing here to view right now, please add
                            New cases data to get started.'
              data={filteredData}
              maxHeight='calc(100vh - 280px)'
              rowKey='caseId'
              columns={[
                {
                  title: 'Case ID',
                  width: '200px',
                  render: u => {
                    const isCompleted = u?.caseStatus === 'completed';

                    return (
                      <div
                        className={`flex items-center gap-2 normal-case ${
                          isCompleted
                            ? 'text-[#135263] text-[14px] underline cursor-pointer'
                            : 'text-[#9CA1A2] text-[14px]'
                        }`}
                        title={
                          !isCompleted
                            ? 'Report available after case completion'
                            : ''
                        }
                        onClick={() =>
                          isCompleted &&
                          navigate(`/cases/cases-list/report/${u?.caseId}`)
                        }
                      >
                        {checkValue(u?.caseId)}
                      </div>
                    );
                  },
                },

                {
                  title: 'Entity Type',
                  dataIndex: 'entity',
                  className: 'email-column',
                  width: '200px',
                  render: u => (
                    <span className='text-gray-900 font-normal capitalize'>
                      {removeUnderScore(checkValue(u?.entity))}
                    </span>
                  ),
                },

                {
                  title: 'Session ID',
                  dataIndex: '',
                  width: '200px',
                  render: u =>
                    TooltipCellOrFirstObject({
                      device: u,
                      field: '',
                      from: 'tim',
                    }),
                },

                {
                  title: 'Created At',
                  dataIndex: 'createdAt',
                  width: '200px',
                  render: u =>
                    TooltipCellOrFirstObject({
                      device: u,
                      field: 'createdAt',
                      from: 'time',
                    }),
                },

                {
                  title: 'Ended At',
                  dataIndex: '',
                  width: '200px',
                  render: u =>
                    TooltipCellOrFirstObject({
                      device: u,
                      field: '',
                      from: 'time',
                    }),
                },

                {
                  title: 'Case Status',
                  render: u => (
                    <span
                      className='py-1 px-2.5 rounded-md text-[12px] capitalize font-semibold'
                      style={getStatusColors(u.caseStatus)}
                    >
                      {checkValue(removeUnderScore(u?.caseStatus))}
                    </span>
                  ),
                  width: '200px',
                },

                {
                  title: 'Assigned By',
                  dataIndex: 'assignBy',
                  width: '200px',
                  render: u =>
                    TooltipCellOrSecondObject({
                      device: u,
                      fieldOne: 'assignBy',
                      fieldTwo: 'name',
                      from: 'tooltip',
                    }) || '-',
                },

                {
                  title: 'ScheduledDateTime',
                  dataIndex: 'scheduledDateTime',
                  width: '200px',
                  render: u =>
                    TooltipCellOrFirstObject({
                      device: u,
                      field: 'scheduledDateTime',
                      from: 'time',
                    }),
                },

                {
                  title: 'Section Expire In',
                  dataIndex: 'scheduledDateTime',
                  width: '200px',
                  render: u => {
                    if (!u?.scheduledDateTime) return '-';

                    const scheduledTime = new Date(
                      u.scheduledDateTime,
                    ).getTime();

                    const currentTime = Date.now();

                    const remainingTime =
                      30 * 60 * 1000 - (currentTime - scheduledTime);
                    if (remainingTime <= 0) {
                      return (
                        <span className='inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D9D9D9] bg-white text-black text-[14px]'>
                          <span className='w-2 h-2 rounded-full bg-[#FF4D4F]'></span>
                          Expired
                        </span>
                      );
                    }

                    const minutes = Math.floor(remainingTime / (1000 * 60));

                    return `${minutes} mins `;
                  },
                },

                // {
                //   title: 'Join link',
                //   dataIndex: 'returnUrl',
                //   width: '200px',
                //   className: 'lowercase',
                //   render: u => (
                //     <div className='text-gray-900 font-normal flex'>
                //       {u.caseStatus !== 'completed' &&
                //       u.caseStatus !== 'expired' ? (
                //         <>
                //           <p className='w-20 truncate'>
                //             <Tooltip
                //               title={`${config.CUSTOMER_URL}/${u.caseId}/${u.customerToken}`}
                //               placement='topLeft'
                //             >
                //               {`${config.CUSTOMER_URL}/${u.caseId}/${u.customerToken}`}
                //             </Tooltip>
                //           </p>
                //           <p>
                //             <Tooltip
                //               title={
                //                 copiedTxt ===
                //                 `${config.CUSTOMER_URL}/${u.caseId}/${u.customerToken}`
                //                   ? 'Copied'
                //                   : 'Copy'
                //               }
                //             >
                //               <Copy
                //                 className='w-4 h-4 cursor-pointer'
                //                 onClick={() =>
                //                   handleCopied(
                //                     `${config.CUSTOMER_URL}/${u.caseId}/${u.customerToken}`,
                //                   )
                //                 }
                //               />
                //             </Tooltip>
                //           </p>
                //         </>
                //       ) : (
                //         <Tooltip title='Link no longer available'>-</Tooltip>
                //       )}
                //     </div>
                //   ),
                // },
                {
                  title: 'Join link',
                  dataIndex: 'returnUrl',
                  width: '180px',
                  render: u => {
                    const isDisabled =
                      u?.caseStatus === 'completed' ||
                      u?.caseStatus === 'expired';

                    return (
                      <button
                        onClick={() => {
                          if (!isDisabled) {
                            const link = document.createElement('a');

                            link.href = `${config.CUSTOMER_URL}/${u.caseId}/${u.customerToken}`;
                            link.target = '_blank';
                            link.rel = 'noopener noreferrer';

                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }
                        }}
                        disabled={isDisabled}
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white! text-sm transition-all ${
                          isDisabled
                            ? 'bg-gray-500 cursor-not-allowed'
                            : 'bg-[#0E7490] hover:bg-[#155E75] cursor-pointer'
                        }`}
                      >
                     <ImageLoader imageKey="VideoCallIcon"/>
                        Join
                      </button>
                    );
                  },
                },

                {
                  title: 'Review Status',
                  render: u => {
                    const { dot } = getStatusColors(u.reviewStatus);

                    return (
                      <div className='flex items-center justify-center border border-[#CDD0D1] rounded-[20px] px-2'>
                        <span
                          className={`w-2! h-2! rounded-full ${dot}`}
                        ></span>
                        <span
                          className='py-1 px-2.5 capitalize '
                          style={getStatusColors(u.reviewStatus)}
                        >
                          {removeUnderScore(checkValue(u?.reviewStatus))}
                        </span>
                      </div>
                    );
                  },
                  width: '200px',
                },

                // {
                //   title: 'Name',
                //   dataIndex: 'name',
                //   width: '200px',
                //   render: u => (
                //     <span className='text-gray-900 font-normal capitalize'>
                //       {TooltipCellOrFirstObject({
                //         device: u,
                //         field: 'name',
                //         from: 'tooltip',
                //       })}
                //     </span>
                //   ),
                // },
                // {
                //   title: 'DOB',
                //   dataIndex: 'dateOfBirth',
                //   width: '200px',
                //   render: u =>
                //     TooltipCellOrFirstObject({
                //       device: u,
                //       field: 'dateOfBirth',
                //       from: 'date',
                //     }),
                // },
                // {
                //   title: 'Email',
                //   dataIndex: 'email',
                //   className: 'email-column',
                //   width: '200px',
                //   render: u =>
                //     TooltipCellOrFirstObject({
                //       device: u,
                //       field: 'email',
                //       from: 'tooltip',
                //     }),
                // },

                // {
                //   title: 'Phone Number',
                //   dataIndex: 'phoneNumber',
                //   width: '200px',
                //   render: u => (
                //     <span className='text-gray-900 font-normal'>
                //       <Tooltip
                //         title={
                //           (u?.phone?.countryCode || '') +
                //           ' ' +
                //           checkValue(u?.phone?.number)
                //         }
                //         placement='topLeft'
                //       >
                //         {(u?.phone?.countryCode || '') +
                //           ' ' +
                //           checkValue(u?.phone?.number)}
                //       </Tooltip>
                //     </span>
                //   ),
                // },
                // {
                //   title: 'Agent Name',

                //   className: 'email-column',
                //   width: '200px',
                //   render: u => (
                //     <span className='capitalize'>
                //       {TooltipCellOrFirstObject({
                //         device: u?.agent,
                //         field: 'name',
                //         from: 'tooltip',
                //       })}
                //     </span>
                //   ),
                // },
                // {
                //   title: 'Entity Type',
                //   dataIndex: 'entity',
                //   className: 'email-column',
                //   width: '200px',
                //   render: u => (
                //     <span className='text-gray-900 font-normal capitalize'>
                //       {/* {TooltipCellOrFirstObject({
                //                                 device: u,
                //                                 field: "entity",
                //                                 from: "tooltip",
                //                             })} */}
                //       {removeUnderScore(checkValue(u?.entity))}
                //     </span>
                //   ),
                // },
                // {
                //   title: 'ScheduledDateTime',
                //   dataIndex: 'scheduledDateTime',
                //   width: '200px',
                //   render: u =>
                //     TooltipCellOrFirstObject({
                //       device: u,
                //       field: 'scheduledDateTime',
                //       from: 'time',
                //     }),
                // },

                // {
                //   title: 'Customer Url',
                //   dataIndex: 'returnUrl',
                //   width: '200px',
                //   className: 'lowercase',
                //   render: u => (
                //     <div className='text-gray-900 font-normal flex'>
                //       {u.caseStatus !== 'completed' &&
                //       u.caseStatus !== 'expired' ? (
                //         <>
                //           <p className='w-20 truncate'>
                //             <Tooltip
                //               title={`${config.CUSTOMER_URL}/${u.caseId}/${u.customerToken}`}
                //               placement='topLeft'
                //             >
                //               {`${config.CUSTOMER_URL}/${u.caseId}/${u.customerToken}`}
                //             </Tooltip>
                //           </p>
                //           <p>
                //             <Tooltip
                //               title={
                //                 copiedTxt ===
                //                 `${config.CUSTOMER_URL}/${u.caseId}/${u.customerToken}`
                //                   ? 'Copied'
                //                   : 'Copy'
                //               }
                //             >
                //               <Copy
                //                 className='w-4 h-4 cursor-pointer'
                //                 onClick={() =>
                //                   handleCopied(
                //                     `${config.CUSTOMER_URL}/${u.caseId}/${u.customerToken}`,
                //                   )
                //                 }
                //               />
                //             </Tooltip>
                //           </p>
                //         </>
                //       ) : (
                //         <Tooltip title='Link no longer available'>-</Tooltip>
                //       )}
                //     </div>
                //   ),
                // },
                ...(userDetails?.appUserType === 'agent'
                  ? [
                      {
                        title: 'Agent Call Link',
                        width: 200,
                        render: u => {
                          return (
                            <div>
                              {u?.caseStatus !== 'expired' &&
                              u?.caseStatus !== 'completed' &&
                              userDetails?.userId === u?.agent?.id &&
                              u?.agent?.id ? (
                                <a
                                  href='#'
                                  rel='noopener noreferrer'
                                  className='text-blue-600 underline cursor-pointer'
                                  onClick={e => handleCallConnect(e, u)}
                                >
                                  Call Connect
                                </a>
                              ) : userDetails?.userId === u?.agent?.id ? (
                                'Link Expired'
                              ) : (
                                '-'
                              )}
                            </div>
                          );
                        },
                      },
                    ]
                  : []),

                // {
                //   title: 'Expires At',
                //   dataIndex: 'expiresAt',
                //   width: '200px',
                //   render: u =>
                //     TooltipCellOrFirstObject({
                //       device: u,
                //       field: 'expiresAt',
                //       from: 'time',
                //     }),
                // },

                // {
                //   title: 'Review Status',
                //   render: u => {
                //     const { dot } = getStatusColors(u.reviewStatus);

                //     return (
                //       <div className='flex items-center justify-center border border-[#CDD0D1] rounded-[20px] px-2'>
                //         <span
                //           className={`w-2! h-2! rounded-full ${dot}`}
                //         ></span>
                //         <span
                //           className='py-1 px-2.5 capitalize '
                //           style={getStatusColors(u.reviewStatus)}
                //         >
                //           {removeUnderScore(checkValue(u?.reviewStatus))}
                //         </span>
                //       </div>
                //     );
                //   },
                //   width: '200px',
                // },
              ]}
            />

            {shouldShowPagination(caseListData, page) && (
              <div className='mt-4'>
                <Pagination
                  state={caseListData}
                  currentPage={page}
                  totalPages={totalPages}
                  rowsPerPage={limit}
                  setCurrentPage={setPage}
                  setRowsPerPage={setLimit}
                  totalRecords={caseListData.total}
                />
              </div>
            )}
          </>
        )}
      </div>

      {isSchedulePending && (
        <AgentScheduleModal
          open={isSchedulePending}
          scheduledDateTime={scheduledDateTime}
          setIsSchedulePending={setIsSchedulePending}
        />
      )}
    </>
  );
};

export default CaseList;
