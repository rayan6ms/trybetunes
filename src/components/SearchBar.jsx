import React from 'react';
import PropTypes from 'prop-types';

class SearchBar extends React.Component {
  render() {
    const {
      artist,
      fromList,
      fromFavorites,
      searchInput,
      handleInputChange,
      handleInputClick,
      handleEnterKey,
      handleSearchButton,
    } = this.props;
    const MAX_LENGTH = 30;
    const MIN_LENGTH = 2;

    const titleText = artist && artist.length > MAX_LENGTH
      ? `${artist.slice(0, MAX_LENGTH)}...` : artist || '';

    return (
      <div className="search-bar">
        <h1 className="search-title">
          {!fromFavorites
            ? `${fromList ? 'Recomendações' : 'Resultado'} de álbuns de: ${titleText}`
            : `Baseado nos seus favoritos de: ${titleText}`}
        </h1>
        <form className="search-container" onSubmit={ handleEnterKey }>
          <input
            type="text"
            data-testid="search-artist-input"
            name="artistName"
            minLength={ MIN_LENGTH }
            className="search-input"
            placeholder="Nome do Álbum 🔎"
            value={ searchInput }
            onChange={ handleInputChange }
            onClick={ handleInputClick }
          />
          <button
            type="button"
            className="search-button"
            data-testid="search-artist-button"
            onClick={ handleSearchButton }
            disabled={ searchInput.length < MIN_LENGTH }
          >
            Pesquisar
          </button>
        </form>
      </div>
    );
  }
}

SearchBar.propTypes = {
  artist: PropTypes.string,
  fromList: PropTypes.bool,
  fromFavorites: PropTypes.bool,
  searchInput: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleInputClick: PropTypes.func.isRequired,
  handleEnterKey: PropTypes.func.isRequired,
  handleSearchButton: PropTypes.func.isRequired,
};

SearchBar.defaultProps = {
  artist: '',
  fromList: false,
  fromFavorites: false,
};

export default SearchBar;
