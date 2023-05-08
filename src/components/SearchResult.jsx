import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

class SearchResult extends React.Component {
  render() {
    const {
      albumInfo: { collectionId, artworkUrl100, artistName, collectionName },
      favoriteAlbums,
      handleUpdateFavorites,
    } = this.props;
    const isFavorite = Object.prototype.hasOwnProperty.call(favoriteAlbums, collectionId);

    const onToggleFavorite = (event) => {
      event.preventDefault();
      handleUpdateFavorites({
        collectionId,
        artworkUrl100,
        artistName,
        collectionName,
        isFavorite: !isFavorite,
      });
    };
    const MAX_LENGTH = 19;

    return (
      <Link
        className="search-results"
        data-testid={ `link-to-album-${collectionId}` }
        to={ `/album/${collectionId}` }
      >
        <img src={ artworkUrl100 } alt={ artistName } />
        <div className="card-texts">
          <div className="artist-plus-icon">
            <p
              style={ { color: '#c5e7e2' } }
              className="artist-name"
            >
              {artistName.length > MAX_LENGTH
                ? `${artistName.slice(0, MAX_LENGTH)}...` : artistName}
            </p>
            <button
              className="favorite-icon"
              onClick={ (event) => {
                event.preventDefault();
                onToggleFavorite(event);
              } }
            >
              {isFavorite ? (
                <AiFillHeart size={ 24 } color="#06c206" />
              ) : (
                <AiOutlineHeart size={ 24 } color="#06c206" />
              )}
            </button>
          </div>
          <p className="collection-name">
            {collectionName.length > MAX_LENGTH
              ? `${collectionName.slice(0, MAX_LENGTH)}...` : collectionName}
          </p>
        </div>
      </Link>
    );
  }
}

SearchResult.propTypes = {
  albumInfo: PropTypes.shape({
    artistName: PropTypes.string.isRequired,
    collectionId: PropTypes.number.isRequired,
    artworkUrl100: PropTypes.string.isRequired,
    collectionName: PropTypes.string.isRequired,
  }).isRequired,
  favoriteAlbums: PropTypes.objectOf(
    PropTypes.shape({
      collectionId: PropTypes.number,
      collectionName: PropTypes.string,
      artworkUrl100: PropTypes.string,
      artistName: PropTypes.string,
    }),
  ).isRequired,
  handleUpdateFavorites: PropTypes.func.isRequired,
};

export default SearchResult;
