import React from 'react';
import PropTypes from 'prop-types';
import Sidebar from './Sidebar';
import SearchResult from './SearchResult';
import Pagination from './Pagination';

class SearchContent extends React.Component {
  render() {
    const {
      searchResult,
      favoriteAlbums,
      handleUpdateFavorites,
      genresList,
      onGenreClick,
      isPaginationVisible,
      isLastPage,
      albumsPerPage,
      totalAlbums,
      neededAlbums,
      paginate,
      currentPage,
    } = this.props;

    return (
      <div className="content-container">
        <Sidebar genresList={ genresList } onGenreClick={ onGenreClick } />
        <div className="search-results-container">
          {searchResult.length < 1 && (
            <h2 className="no-results">Nenhum álbum foi encontrado</h2>
          )}
          {searchResult.length > 0 && isPaginationVisible && (
            <Pagination
              albumsPerPage={ albumsPerPage }
              totalAlbums={ totalAlbums }
              paginate={ paginate }
              currentPage={ currentPage }
              isTop
            />
          )}
          {searchResult.length > 0 && searchResult.map((album, index) => {
            const isFirstRecommendation = isLastPage && index
            === searchResult.length - neededAlbums;

            return (
              <React.Fragment key={ album.collectionId }>
                {isFirstRecommendation && (
                  <h2 className="recommendations">
                    Recomendações
                  </h2>)}
                <SearchResult
                  key={ album.collectionId }
                  albumInfo={ album }
                  favoriteAlbums={ favoriteAlbums }
                  handleUpdateFavorites={ handleUpdateFavorites }
                  index={ index }
                />
              </React.Fragment>
            );
          })}
          {searchResult.length > 0 && isPaginationVisible && (
            <Pagination
              albumsPerPage={ albumsPerPage }
              totalAlbums={ totalAlbums }
              paginate={ paginate }
              currentPage={ currentPage }
            />
          )}
        </div>
      </div>
    );
  }
}

SearchContent.propTypes = {
  searchResult: PropTypes.arrayOf(
    PropTypes.shape({
      collectionId: PropTypes.number,
      collectionName: PropTypes.string,
      artworkUrl100: PropTypes.string,
      artistName: PropTypes.string,
    }),
  ).isRequired,
  favoriteAlbums: PropTypes.objectOf(
    PropTypes.shape({
      collectionId: PropTypes.number,
      collectionName: PropTypes.string,
      artworkUrl100: PropTypes.string,
      artistName: PropTypes.string,
    }),
  ).isRequired,
  handleUpdateFavorites: PropTypes.func.isRequired,
  genresList: PropTypes.arrayOf(PropTypes.string).isRequired,
  onGenreClick: PropTypes.func.isRequired,
  isPaginationVisible: PropTypes.bool.isRequired,
  isLastPage: PropTypes.bool.isRequired,
  albumsPerPage: PropTypes.number.isRequired,
  totalAlbums: PropTypes.number.isRequired,
  neededAlbums: PropTypes.number.isRequired,
  paginate: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
};

export default React.memo(SearchContent);
