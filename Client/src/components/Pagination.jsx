import ReactPaginate from 'react-paginate';

const Pagination = ({ pageCount, handlePageClick }) => {
  return (
    <ReactPaginate
        previousLabel={"Précédent"}
  nextLabel={"Suivant"}
  pageCount={pageCount}
  onPageChange={handlePageClick}
  containerClassName={"flex justify-center mt-8"}
  pageClassName={"px-3 py-2"}
  previousLinkClassName={"border border-gray-300 px-4 py-2 rounded-l-md h-10 flex items-center"}
  nextLinkClassName={"border border-gray-300 px-4 py-2 rounded-r-md h-10 flex items-center"}
  disabledClassName={"opacity-50 cursor-not-allowed"}
  activeClassName={"bg-blue-500 text-white px-4 py-2 h-10 flex items-center"}
    />
  );
};

export default Pagination;
