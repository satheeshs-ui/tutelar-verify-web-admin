import { ChevronLeft, ChevronRight } from "lucide-react";

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

    return (
        <div className="flex gap-4 flex-wrap items-center justify-between py-3 px-4 max-[500px]:border-none border border-primary-grey-3 bg-white rounded-full">
            <div>
                <select
                    value={rowsPerPage}
                    onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                    className="custom-select-arrow px-4 py-2 border border-gray-300 rounded-full !text-[12px] !text-[#6A7174] font-medium bg-[#E6E7E8] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors"
                >
                    <option value={10}>10 items</option>
                    <option value={20}>20 items</option>
                    <option value={50}>50 items</option>
                    <option value={100}>100 items</option>
                </select>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={!isPrevEnabled}
                    className="cursor-pointer px-4 py-2 !text-[10px] gap-3 !sm:text-[12px] font-medium !text-[#6A7174] bg-[#E6E7E8] border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white flex items-center gap-1 transition-colors"
                >
                    <ChevronLeft size={16} />
                    <span className="max-[500px]:hidden">Previous</span>
                </button>

                <button
                    onClick={() => {
                        if (hasTotalCount) {
                            setCurrentPage(Math.min(totalPages, currentPage + 1));
                        } else {
                            setCurrentPage(currentPage + 1);
                        }
                    }}
                    disabled={!isNextEnabled}
                    className="cursor-pointer px-4 py-2 !text-[#6A7174] bg-[#E6E7E8] !text-[10px] !sm:text-[12px] font-medium rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white flex items-center gap-1 transition-colors"
                >
                    <span className="max-[500px]:hidden">Next</span>
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
