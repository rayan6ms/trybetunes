import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Pagination.css';

class Pagination extends React.Component {
  render() {
    const { albumsPerPage, totalAlbums, paginate, currentPage, isTop } = this.props;
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalAlbums / albumsPerPage); i += 1) {
      pageNumbers.push(i);
    }

    return (
      <nav { ...isTop ? { className: 'pagination-top' } : { className: 'pagination' } }>
        <ul className="pagination-list">
          {pageNumbers.map((number) => (
            <li key={ number }>
              <button
                onClick={ () => paginate(number) }
                { ...currentPage === number
                  ? { className: 'pagination-button current-page', disabled: true }
                  : { className: 'pagination-button' } }
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}

Pagination.propTypes = {
  albumsPerPage: PropTypes.number.isRequired,
  totalAlbums: PropTypes.number.isRequired,
  paginate: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  isTop: PropTypes.bool,
};

Pagination.defaultProps = {
  isTop: false,
};

export default Pagination;
