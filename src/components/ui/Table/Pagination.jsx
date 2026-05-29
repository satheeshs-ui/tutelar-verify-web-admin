import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
  state,
  currentPage,
  totalPages,
  rowsPerPage,
  setCurrentPage,
  setRowsPerPage,
  totalRecords,
}) => {
  const hasTotalCount = totalRecords > 0;

  const hasMoreData = state?.length === rowsPerPage;

  const isNextEnabled = hasTotalCount ? currentPage < totalPages : hasMoreData;

  const isPrevEnabled = currentPage > 1;

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className='flex gap-4 flex-wrap items-center justify-between py-3 px-4 max-[500px]:border-none border border-primary-grey-3 bg-white rounded-full'>
      <div>
        <select
          value={rowsPerPage}
          onChange={e => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className='custom-select-arrow px-4 py-3 border border-none! rounded-full text-[12px]! text-[#6A7174]! font-normal! bg-[#E6E7E8]  cursor-pointer transition-colors'
        >
          <option value={10}>10 items</option>
          <option value={20}>20 items</option>
          <option value={50}>50 items</option>
          <option value={100}>100 items</option>
        </select>
      </div>
      <div className='flex items-center gap-1'>
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={!isPrevEnabled}
          className='cursor-pointer px-4 py-2 text-[12px]! gap-3 !sm:text-[12px] font-medium text-[#6A7174]! bg-[#E6E7E8] border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white flex items-center transition-colors'
        >
          <ChevronLeft size={16} />
          <span className='max-[500px]:hidden'>Previous</span>
        </button>

        <div className='flex items-center gap-2'>
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => page !== '...' && setCurrentPage(page)}
              className={`
                min-w-[32px] h-[32px] rounded-full text-[10px]! font-medium transition-all
                ${
                  currentPage === page
                    ? 'bg-[#0B7285] text-[#F9FAFB]!'
                    : 'text-[#6A7174]! hover:bg-[#E6E7E8]'
                }
                ${page === '...' ? 'cursor-default' : 'cursor-pointer'}
              `}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            if (hasTotalCount) {
              setCurrentPage(Math.min(totalPages, currentPage + 1));
            } else {
              setCurrentPage(currentPage + 1);
            }
          }}
          disabled={!isNextEnabled}
          className='cursor-pointer px-4 py-2 !text-[#6A7174] bg-[#E6E7E8] !text-[10px] !sm:text-[12px] font-medium rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white flex items-center gap-1 transition-colors'
        >
          <span className='max-[500px]:hidden'>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
