import { useEffect, useMemo, useState } from 'react';
import UniversalTable from '../../components/ui/Table/UniversalTable';
import Pagination from '../../components/ui/Table/Pagination';
import {
  checkValue,
  returnSimpleFormatedDate,
  shortName,
  shouldShowPagination,
} from '../../utils';
import { TooltipCellOrFirstObject } from '../../components/ui/TooltipCell';
import LottieLoader from '../../components/ui/LottieUnique/LottieLoader';
import { useNavigate } from 'react-router-dom';
import SecondaryButton from '../../components/buttons/SecondaryButton';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import ImageLoader from '../../components/ui/ImageLoader';
import { ModalPopUp } from '../../components/ui/Modal/ModalPopUp';
import CommonPopover from '../../components/ui/CommonPopOver';
import UserFilter from './Filter';
import useUserStore from '../../store/User/useUserStore';
import { Button, Select, Tag, Tooltip } from 'antd';
import { useHeaderStore } from '../../store/Header/useHeaderStore';
import CommonStatusSelect from '../../components/ui/CommonStatusSelect';

const UserList = () => {
  // const { setHeaderAction } = useOutletContext();

  const navigate = useNavigate();
  const { getUserList, userList, updateUser, isLoading, unblockUserAccount } =
    useUserStore();

  const agentListData = userList;
  const { setHeader, clearHeader } = useHeaderStore();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [selectType, setSelectType] = useState('email');
  const [status, setStatus] = useState('');
  const [appUserType, setRole] = useState('');
  const [clear, setClear] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [filter, setFilter] = useState(false);

  const [dateRange, setDateRange] = useState([null, null]);
  const totalRecords = agentListData?.total;
  const totalPages = totalRecords > 0 ? Math.ceil(totalRecords / limit) : 0;
  const startDate = dateRange?.[0]?.format('YYYY-MM-DD');
  const endDate = dateRange?.[1]?.format('YYYY-MM-DD');

  const statusOptions = [
    {
      label: 'Active',
      value: 'active',
      color: 'bg-green-500',
    },
    {
      label: 'Inactive',
      value: 'inactive',
      color: 'bg-red-500',
    },
     {
      label: 'Unblock',
      value: 'unblock',
      color: 'bg-blue-500',
    },
  ];

  const params = useMemo(
    () => ({
      page,
      limit,
      ...(search ? { [selectType]: search } : {}),
      ...(status && status !== 'all' ? { status } : {}),
      ...(appUserType && appUserType !== 'all' ? { appUserType } : {}),

      ...(startDate && endDate && { startDate, endDate }),
    }),
    [page, limit, search, status, appUserType, selectType, dateRange],
  );
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    handleTable();
  }, [page, limit, getUserList, clear]);

  const handleTable = () => {
    const fetchData = async () => {
      await getUserList(params);
    };

    fetchData();
  };

  const handleStatusChange = (user, value) => {
    if (!user?.userId) {
      return;
    }

    updateUser(user.userId, { status: value }, res => {
      if (res) {
        getUserList(params);
      }
    });
  };

  const handleApply = () => {
    handleTable();
    setPage(1);
  };
  const handleReset = () => {
    setSearch('');
    setSelectType('email');
    setStatus('');
    setClear(true);
    setPage(1);
    setDateRange([null, null]);
    setRole('');
  };

  const handleClose = () => {
    setOpenModal(false);
    setOpenChangePassword(false);
  };

  const handleSubmit = () => {
    console.log('submit');
  };

  // const usercard = [
  //     {
  //         icon: (
  //             <div className="bg-[#18667C0F] pt-[15px] pb-3 px-4 rounded-2xl w-fit">
  //                 <ImageLoader imageKey={"tuser"} />
  //             </div>
  //         ),
  //         label: "Total User",
  //         value: "5",
  //         percentage: "0",
  //     },
  //     {
  //         icon: (
  //             <div className="bg-[#18667C0F] pt-[15px] pb-3 px-4 rounded-2xl w-fit">
  //                 <ImageLoader imageKey={"activeuser"} />
  //             </div>
  //         ),
  //         label: "Active User",
  //         value: "4",
  //         percentage: "0",
  //     },
  //     {
  //         icon: (
  //             <div className="bg-[#FEF3F2] pt-[15px] pb-3 px-4 rounded-2xl w-fit">
  //                 <ImageLoader imageKey={"inactiveUser"} />
  //             </div>
  //         ),
  //         label: "Inactive User",
  //         value: "1",
  //         percentage: "0",
  //     },
  // ];
  const userinfo = [
    { icon: 'emailIcon', label: 'Email Address', value: userDetails?.email },
    { icon: 'phoneIcon', label: 'Phone Number', value: userDetails?.mobile },
    {
      icon: 'department',
      label: 'Department',
      value: userDetails?.employeeDetails?.department,
    },
    {
      icon: 'caseIcon',
      label: 'Designation',
      value: userDetails?.employeeDetails?.designation,
    },
  ];
  const accountinfo = [
    {
      label: 'Date of Joining',
      value: userDetails?.employeeDetails?.dateOfJoining
        ? returnSimpleFormatedDate(userDetails?.employeeDetails?.dateOfJoining)
        : '-',
    },
    {
      label: 'Last Login',
      value: userDetails?.lastLoginAt
        ? returnSimpleFormatedDate(userDetails?.lastLoginAt)
        : '-',
    },
    {
      label: 'Password Expiry',
      value: userDetails?.passwordExpiry
        ? returnSimpleFormatedDate(userDetails?.passwordExpiry)
        : '-',
    },
    {
      label: 'Created At',
      value: userDetails?.createdAt
        ? returnSimpleFormatedDate(userDetails?.createdAt)
        : '-',
    },
    {
      label: 'Created By',
      value: userDetails?.createdBy?.name
        ? `${userDetails?.createdBy?.name} (${userDetails?.createdBy?.role})`
        : '-',
    },
  ];

  const handleUnblockAgent = obj => {
    if (!obj || !obj.userId) {
      console.error('Invalid user object', obj);
      return;
    }

    unblockUserAccount(obj.userId, {}, res => {
      if (res) {
        handleTable(params);
      }
    });
  };
  const handleAuthLock = (date, record) => {
    if (!date) return <Tag color={'green'}>{'Active'}</Tag>;

    const lockDate = new Date(date);
    if (isNaN(lockDate.getTime())) return 'UnBlock';

    const LOCK_DURATION = 10 * 60 * 1000;
    const unlockTime = new Date(lockDate.getTime() + LOCK_DURATION);

    return new Date() > unlockTime ? (
      <Tag color={'green'}>{'Active'}</Tag>
    ) : (
      <Button
        type='link'
        danger
        onClick={() => handleUnblockAgent(record)}
        className='bg-amber-600! text-[#fff]! h-8!'
      >
        Unblock
      </Button>
    );
  };
  useEffect(() => {
    setHeader({
      title: '',
      actions: (
        <div className='flex gap-3'>
          <div
            className='bg-[#F9FAFB] border border-[#E6E7E8] rounded-xl py-3 px-[15px] cursor-pointer'
            onClick={() => setFilter(true)}
          >
            <ImageLoader imageKey={'userFilter'} />
          </div>
          <div>
            <PrimaryButton
              iconLeft='userCreate'
              label='Create Users'
              onNotify={() => navigate('/users/users-list/create-user')}
            />
          </div>
        </div>
      ),
    });

    return () => clearHeader();
  }, [clearHeader, setHeader, navigate]);
  return (
    <>
      <div className=''>
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                    {usercard?.map((card, c) => (
                        <div
                            key={c}
                            className="flex justify-between p-4 border border-[#CDD0D1] rounded-xl transition h-full"
                        >
                            <div>
                                <div>{card.icon}</div>
                                <div className="text-[#16262B] text-[24px] font-bold mt-3">
                                    {card.value}
                                </div>
                                <div className="text-sm text-[#818A8C] font-normal">
                                    {card.label}
                                </div>
                            </div>

                            <div className="flex">
                                <ImageLoader
                                    imageKey={"percentageup"}
                                    className="w-5 h-5 mt-1 mr-2"
                                />
                                <div className="text-xs mt-1 text-[#17B26A] font-medium">
                                    {card.percentage}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div> */}

        {isLoading ? (
          <LottieLoader lottieKey='loaderIcon' playerClass='w-[80px]' />
        ) : (
          <>
            <UniversalTable
              rowKey='user_id'
              data={agentListData?.users}
              maxHeight='calc(100vh - 280px)'
              columns={[
                {
                  title: (
                    <div className='flex items-center gap-2'>
                      <span>User ID</span>
                    </div>
                  ),
                  render: u => (
                    <div className='flex items-center gap-2 text-[#0B1C20]'>
                      <span className='cursor-pointer'>
                        {' '}
                        {checkValue(u?.userId)}
                      </span>
                    </div>
                  ),
                  width: 100,
                },
                {
                  title: (
                    <div className='flex items-center gap-1'>
                      <span>Name</span>
                    </div>
                  ),
                  dataIndex: 'name',
                  width: 100,
                  render: u => {
                    const name = u?.name || '';
                    const truncate =
                      name.length > 16 ? name.slice(0, 16) + '...' : name;
                    return (
                      <Tooltip title={name}>
                        <span className='text-gray-900 font-normal capitalize cursor-pointer'>
                          {truncate}
                        </span>
                      </Tooltip>
                    );
                  },
                },
                {
                  title: (
                    <div className='flex items-center gap-1'>
                      <span>Email</span>
                    </div>
                  ),
                  dataIndex: 'email',
                  className: 'email-column',
                  width: 100,
                  render: u =>
                    TooltipCellOrFirstObject({
                      device: u,
                      field: 'email',
                      from: 'tooltip',
                    }),
                },
                {
                  title: (
                    <div className='flex items-center gap-1'>
                      <span>Role Name</span>
                    </div>
                  ),
                  dataIndex: 'appUserType',
                  width: 100,
                  render: u => (
                    <span className='text-gray-900 font-normal capitalize'>
                      {TooltipCellOrFirstObject({
                        device: u,
                        field: 'appUserType',
                        from: 'tooltip',
                      })}
                    </span>
                  ),
                },
                {
                  title: (
                    <div className='flex items-center gap-1'>
                      <span>Rule Access Control</span>
                    </div>
                  ),
                  dataIndex: 'appUserType',
                  width: 100,
                  render: u => (
                    <span className='text-gray-900 font-normal capitalize'>
                      {TooltipCellOrFirstObject({
                        device: u,
                        field: 'appUserType',
                        from: 'tooltip',
                      })}
                    </span>
                  ),
                },

                {
                  title: (
                    <div className='flex items-center gap-1'>
                      <span>Contact Number</span>
                    </div>
                  ),
                  dataIndex: 'appUserType',
                  width: 100,
                  render: u => (
                    <span className='text-gray-900 font-normal capitalize'>
                      {TooltipCellOrFirstObject({
                        device: u,
                        field: 'appUserType',
                        from: 'tooltip',
                      })}
                    </span>
                  ),
                },
                {
                  title: 'Status',
                  render: u => {
                    return (
                      <div>
                        <CommonStatusSelect
                          value={u.status}
                          options={statusOptions}
                          onChange={value => handleStatusChange(u, value)}
                        />
                      </div>
                    );
                  },
                  width: 100,
                },

                {
                  title: 'Created At',
                  render: u =>
                    TooltipCellOrFirstObject({
                      device: u,
                      field: 'createdAt',
                      from: 'time',
                    }),

                  width: 100,
                },

                // {
                //   title: 'Last Login',
                //   render: u =>
                //     TooltipCellOrFirstObject({
                //       device: u,
                //       field: 'lastLoginAt',
                //       from: 'time',
                //     }),

                //   width: 100,
                // },

                // {
                //   title: 'Password Expiry',
                //   render: u =>
                //     TooltipCellOrFirstObject({
                //       device: u,
                //       field: 'passwordExpiry',
                //       from: 'time',
                //     }),

                //   width: 100,
                // },
                // {
                //   title: 'Account Access',
                //   render: u => handleAuthLock(u.authLockedAt, u),
                //   width: 100,
                // },
                {
                  title: 'Action',
                  render: u => (
                    <div className='flex items-center gap-2'>
                      <div className='-mt-1'>
                        <ImageLoader
                          imageKey='userInfoIcon'
                          className='w-4 h-4 cursor-pointer'
                          onClick={() => {
                            setUserDetails(u);
                            setOpenModal(true);
                          }}
                        />
                      </div>

                      <div>
                        <CommonPopover
                          trigger={
                            <ImageLoader
                              imageKey='overflowMenus'
                              className='w-4 h-4 cursor-pointer'
                            />
                          }
                        >
                          {({ closePopover }) => (
                            <>
                              <div
                                className='common-popover-item flex items-center gap-2 text-[#6A7174]! text-[14px] font-normal'
                                onClick={() => {
                                  closePopover();
                                  navigate(
                                    `/users/users-list/edit-user/${u?.userId}`,
                                  );
                                }}
                              >
                                <ImageLoader imageKey={'editIcon'} /> Edit
                              </div>

                              {/* <div
                                                                className="common-popover-item flex items-center gap-2 text-[#6A7174]! text-[14px] font-normal"
                                                                onClick={() => {
                                                                
                                                                    setOpenChangePassword(true);
                                                                    closePopover();
                                                                }}
                                                            >
                                                                <ImageLoader
                                                                    imageKey={"userPassword"}
                                                                />{" "}
                                                                Change Password
                                                            </div> */}
                            </>
                          )}
                        </CommonPopover>
                      </div>
                    </div>
                  ),
                  width: 100,
                },
              ]}
            />

            {shouldShowPagination(agentListData, page) && (
              <div className='mt-4'>
                <Pagination
                  state={agentListData}
                  currentPage={page}
                  totalPages={totalPages}
                  rowsPerPage={limit}
                  setCurrentPage={setPage}
                  setRowsPerPage={setLimit}
                  totalRecords={agentListData?.total}
                />
              </div>
            )}
            {openModal && (
              <ModalPopUp
                isOpen={openModal}
                onClose={handleClose}
                closeBtn={false}
              >
                <div className='p-[18px]'>
                  <div className='flex justify-between items-center border-b border-[#CDD0D1] pb-4'>
                    <div>
                      <div className='flex items-center gap-2'>
                        <div>
                          <ImageLoader imageKey={'userProfile'} />
                        </div>
                        <div className='text-primary-black-15 text-[18px] font-medium'>
                          User Info
                        </div>
                      </div>
                      <div className='text-[#888C93] text-[12px] font-normal mt-1'>
                        The user's information can be edited or deleted
                      </div>
                    </div>
                    <div>
                      <ImageLoader
                        imageKey={'closeIcon'}
                        className={'cursor-pointer'}
                        onClick={handleClose}
                      />
                    </div>
                  </div>

                  <div className='border border-[#CDD0D1] p-[18px] mt-4 rounded-2xl'>
                    <div className='flex flex-wrap justify-between items-center border-b border-[#CDD0D1] pb-4'>
                      <div>
                        <div className='flex items-center gap-2'>
                          <div className='w-13 h-13 text-[#0B1C20] text-center flex justify-center items-center text-[18px] font-bold rounded-full cursor-pointer border border-[#D0D0D0] bg-white'>
                            {shortName(userDetails?.name)}
                          </div>

                          <div className='text-primary-black-15 text-[18px] font-medium'>
                            <div className='flex items-center gap-2'>
                              <div className='text-[#0B1C20] text-[16px] font-medium capitalize'>
                                {userDetails?.name}
                              </div>
                              <div className='text-[#0B1C20] border border-[#CDD0D1] pt-2 px-4 rounded-2xl flex items-center gap-2 text-[12px] font-normal w-fit'>
                                <p
                                  className={`w-2 h-2 ${userDetails?.status === 'inactive' ? 'bg-[#e91717]' : 'bg-[#17B26A]'}  rounded-full`}
                                ></p>{' '}
                                <p className='capitalize'>
                                  {userDetails?.status}
                                </p>
                              </div>
                            </div>
                            <div className='flex flex-wrap items-center gap-2'>
                              <div className='flex items-center gap-2'>
                                <div>
                                  <ImageLoader imageKey={'shilduser'} />
                                </div>
                                <p className='text-[#0B1C20] text-[12px] font-normal mt-2! capitalize'>
                                  {userDetails?.appUserType ?? '-'}
                                </p>
                              </div>
                              <p className='mt-2!'>|</p>
                              <div className='flex items-center gap-2 mt-2!'>
                                <p className='text-[#6A7174] text-[12px] font-normal'>
                                  User ID :
                                </p>
                                <p className='text-[#0B1C20] text-[12px] font-normal'>
                                  {userDetails?.userId ?? '-'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className='flex items-center gap-2 border border-[#CDD0D1] px-2.5 pt-2 rounded-xl cursor-pointer'
                        onClick={() => {
                          navigate(
                            `/users/users-list/edit-user/${userDetails?.userId}`,
                          );
                        }}
                      >
                        <div className='-mt-1'>
                          <ImageLoader imageKey={'editIcon'} />
                        </div>
                        <p className='text-[#818A8C] text-[14px] font-normal p-0! cursor-pointer'>
                          Edit User
                        </p>
                      </div>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3'>
                      {userinfo?.length > 0 &&
                        userinfo?.map((user, u) => (
                          <div
                            key={u}
                            className='bg-[#F9FAFB] py-3 px-4 rounded-2xl'
                          >
                            <div className='flex items-center gap-2'>
                              <div>
                                <ImageLoader imageKey={user.icon} />
                              </div>
                              <div className='text-[#6A7174] text-[12px] font-normal max-[500px]:text-[12px]'>
                                {user?.label}
                              </div>
                            </div>
                            <div className='text-[#0B1C20] text-[16px] font-normal mt-2 max-[500px]:text-[11px]'>
                              {user?.value ?? '-'}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className='border border-[#CDD0D1] p-[18px] mt-4 rounded-2xl'>
                    <div className='text-primary-black-15 text-[18px] font-normal border-b border-[#CDD0D1] pb-4 max-[500px]:text-[14px]'>
                      Account Info
                    </div>
                    <div className='mt-3'>
                      {accountinfo?.length > 0 &&
                        accountinfo.map((account, a) => (
                          <div
                            key={a}
                            className=' flex justify-between items-center mb-4'
                          >
                            <div className='text-[#6A7174] text-[14px] font-normal max-[500px]:text-[12px]'>
                              {account.label}
                            </div>

                            <div className='text-[#0B1C20] text-[16px] font-normal mt-2 max-[500px]:text-[11px]'>
                              {checkValue(account.value)}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </ModalPopUp>
            )}

            {openChangePassword && (
              <ModalPopUp
                isOpen={openChangePassword}
                onClose={handleClose}
                closeBtn={false}
              >
                <div className='p-[18px]'>
                  <div className='flex justify-between items-center border-b border-[#CDD0D1] pb-4'>
                    <div>
                      <div className='flex gap-2'>
                        <div>
                          <ImageLoader imageKey={'userPassword'} />
                        </div>
                        <div>
                          <p className='text-[#0B1C20] text-[18px] font-medium'>
                            Change Password
                          </p>
                          <p className='text-[#888C93] text-[12px] font-normal mt-1'>
                            Please confirm the email address to send the
                            password reset link.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <ImageLoader
                        imageKey={'closeIcon'}
                        className={'cursor-pointer'}
                        onClick={handleClose}
                      />
                    </div>
                  </div>

                  <div className='p-[18px] rounded-2xl'>
                    <p className='text-[#2C3436] text-[14px] font-normal'>
                      Email
                    </p>
                    <div className='mt-2 border border-[#CDD0D1] rounded-2xl py-3 px-4'>
                      satheeshvijay123@gmail.com
                    </div>
                  </div>

                  <div className='w-full flex justify-end mt-4'>
                    <div className='flex gap-2'>
                      <SecondaryButton
                        label={'Cancel'}
                        onNotify={handleClose}
                      />
                      <PrimaryButton label={'Submit'} onNotify={handleSubmit} />
                    </div>
                  </div>
                </div>
              </ModalPopUp>
            )}

            <UserFilter
              filter={filter}
              setFilter={setFilter}
              handleSubmit={handleApply}
              handleReset={handleReset}
              search={search}
              setSearch={setSearch}
              selectType={selectType}
              setSelectType={setSelectType}
              status={status}
              setStatus={setStatus}
              role={appUserType}
              setRole={setRole}
              dateRange={dateRange}
              setDateRange={setDateRange}
              clear={clear}
              setClear={setClear}
            />
          </>
        )}
      </div>
    </>
  );
};

export default UserList;
