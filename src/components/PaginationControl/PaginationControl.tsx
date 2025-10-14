import ReactPaginate from 'react-paginate';
import css from './PaginationControl.module.css';

export interface PaginationControlProps {
  totalPages: number;
  page: number;
  setPage: (page: number) => void;
}

export default function PaginationControl({ totalPages, page, setPage }: PaginationControlProps) {
  if (totalPages <= 1) return null;

  return (
    <ReactPaginate
  pageCount={totalPages}
  pageRangeDisplayed={5}
  marginPagesDisplayed={1}
  onPageChange={({ selected }) => setPage(selected + 1)}
  forcePage={page - 1}
  containerClassName={css.pagination}
  activeClassName={css.active}
  nextLabel="→"
  previousLabel="←"
/>

  );
}
