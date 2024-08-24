import React from 'react';
import { PaginationProps } from '@/type'

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination">
        {[...Array(totalPages).keys()].map(pageNumber => (
          <li className={`page-item ${currentPage === pageNumber + 1 ? 'active' : ''}`} key={pageNumber}>
            <a
              className="page-link"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageClick(pageNumber + 1);
              }}
            >
              {pageNumber + 1}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
