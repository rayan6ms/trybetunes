import React from 'react';
import PropTypes from 'prop-types';
import searchAlbumsAPI from '../services/searchAlbumsAPI';
import {
  Header,
  Loading,
  SearchBar,
  SearchContent,
} from '../components';
import '../styles/Search.css';

class Search extends React.Component {
  state = {
    searchInput: '',
    currentPage: 1,
    albumsPerPage: 30,
    neededAlbums: 0,
    isLoading: false,
    isLoaded: false,
    isRecommendation: { fromList: false, fromFavorites: false },
    searchResult: [],
    genresList: [
      'rock', 'pop', 'jazz', 'blues', 'country', 'rap', 'metal', 'soul',
      'hip hop', 'funk', 'indie', 'classical', 'reggae', 'electro',
      'dance', 'ambient', 'folk', 'r&b', 'house', 'techno',
      'trance', 'punk', 'hard rock', 'heavy metal',
      'psychedelic', 'ska', 'grunge', 'progressive', 'disco',
      'gospel', 'swing', 'latin', 'synth', 'new wave',
      'dub', 'dubstep', 'chillout', 'emo',
    ],
  };

  componentDidMount() {
    const favoriteAlbums = this.getFavorites();
    const randomFavoritedArtist = this.getRandomFavoritedArtist(favoriteAlbums);
    const { genresList } = this.state;

    const randomGenre = genresList[Math.floor(Math.random() * genresList.length)];

    if (randomFavoritedArtist) {
      this.fetchRecommendedAlbums(randomFavoritedArtist);
      this.setState({ isRecommendation: { fromFavorites: true, fromList: false } });
    } else {
      this.fetchRecommendedAlbums(randomGenre);
      this.setState({ isRecommendation: { fromList: true, fromFavorites: false } });
    }
  }

  getFavorites = () => JSON.parse(localStorage.getItem('favorite_albums')) || {};

  paginate = (pageNumber) => this.setState({ currentPage: pageNumber });

  fetchRecommendedAlbums = async (genre, isFromSideBar) => {
    const { albumsPerPage } = this.state;
    this.setState({ isLoading: true });
    const searchResult = await searchAlbumsAPI(genre);
    const neededAlbums = (searchResult.length > albumsPerPage
      ? albumsPerPage * 2 : albumsPerPage) - searchResult.length;

    if (neededAlbums > 0) {
      const recommendations = await this.fetchAdditionalRecommendations(neededAlbums);
      searchResult.push(...recommendations);
    }

    if (isFromSideBar) {
      this.setState({ isRecommendation: { fromList: true, fromFavorites: false } });
    }

    this.setState({
      searchResult,
      isLoading: false,
      isLoaded: true,
      artist: genre,
      neededAlbums,
    });
  };

  fetchAdditionalRecommendations = async (neededAlbums) => {
    const { genresList } = this.state;
    const randomGenre = genresList[Math.floor(Math.random() * genresList.length)];

    const recommendations = await searchAlbumsAPI(randomGenre);
    return recommendations.slice(0, neededAlbums);
  };

  getRandomFavoritedArtist = (favoriteAlbums) => {
    if (Object.keys(favoriteAlbums).length === 0) return null;
    const artists = Object.values(favoriteAlbums).map(({ artistName }) => artistName);
    return artists[Math.floor(Math.random() * artists.length)];
  };

  handleFormSubmit = (event) => {
    const { searchInput } = this.state;
    event.preventDefault();
    if (searchInput.length < 2) return;
    this.handleSearchButton();
  };

  handleSearchButton = async () => {
    const { searchInput, albumsPerPage } = this.state;
    this.setState({ isLoading: true });
    const searchResult = await searchAlbumsAPI(searchInput);
    const neededAlbums = (searchResult.length > albumsPerPage
      ? albumsPerPage * 2 : albumsPerPage) - searchResult.length;

    if (neededAlbums > 0 && searchResult.length > 0) {
      const recommendations = await this.fetchAdditionalRecommendations(neededAlbums);
      searchResult.push(...recommendations);
    }

    this.setState({
      searchResult,
      isLoading: false,
      isLoaded: true,
      isRecommendation: false,
      artist: searchInput,
      searchInput: '',
      neededAlbums,
    });
  };

  handleInputChange = ({ target }) => {
    this.setState({ artist: target.value, searchInput: target.value });
  };

  handleInputClick = () => {
    const { searchInput } = this.state;
    if (searchInput.length > 2) this.setState({ searchInput: '' });
  };

  handleUpdateFavorites = (favoriteData) => {
    const { collectionId, isFavorite } = favoriteData;
    const favoriteAlbums = this.getFavorites();
    const { onUpdateFavorites } = this.props;

    if (isFavorite) {
      favoriteAlbums[collectionId] = favoriteData;
    } else {
      delete favoriteAlbums[collectionId];
    }

    localStorage.setItem('favorite_albums', JSON.stringify(favoriteAlbums));
    onUpdateFavorites(favoriteAlbums);
  };

  render() {
    const {
      searchInput,
      isLoading,
      artist,
      isLoaded,
      isRecommendation: { fromList, fromFavorites },
      searchResult,
      genresList,
      currentPage,
      albumsPerPage,
      neededAlbums,
    } = this.state;

    const favoriteAlbums = this.getFavorites();
    const indexOfLastAlbum = currentPage * albumsPerPage;
    const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage;
    const currentAlbums = searchResult.slice(indexOfFirstAlbum, indexOfLastAlbum);

    const genresListFormatted = genresList.map((genre) => (
      genre.charAt(0).toUpperCase() + genre.slice(1)));

    return (
      <div data-testid="page-search" className="search-page">
        <Header isLoading={ false } />
        { isLoading ? <Loading /> : (
          <SearchBar
            isLoading={ isLoading }
            artist={ artist }
            fromList={ fromList }
            fromFavorites={ fromFavorites }
            searchInput={ searchInput }
            handleInputChange={ this.handleInputChange }
            handleInputClick={ this.handleInputClick }
            handleEnterKey={ this.handleFormSubmit }
            handleSearchButton={ this.handleSearchButton }
          />)}
        {isLoaded && (
          <SearchContent
            searchResult={ currentAlbums }
            favoriteAlbums={ favoriteAlbums }
            handleUpdateFavorites={ this.handleUpdateFavorites }
            genresList={ genresListFormatted }
            onGenreClick={ this.fetchRecommendedAlbums }
            isPaginationVisible={ searchResult.length > albumsPerPage }
            albumsPerPage={ albumsPerPage }
            totalAlbums={ searchResult.length }
            currentPage={ currentPage }
            paginate={ this.paginate }
            neededAlbums={ neededAlbums }
            isLastPage={ currentPage === Math.ceil(searchResult.length / albumsPerPage) }
          />
        )}
      </div>
    );
  }
}

Search.propTypes = {
  onUpdateFavorites: PropTypes.func.isRequired,
};

export default Search;
