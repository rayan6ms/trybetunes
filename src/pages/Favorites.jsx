import React from 'react';
import SearchResult from '../components/SearchResult';
import Header from '../components/Header';
import Pagination from '../components/Pagination';
import MusicCard from '../components/MusicCard';
import Loading from '../components/Loading';
import { getFavoriteSongs } from '../services/favoriteSongsAPI';
import getMusics from '../services/musicsAPI';

class Favorites extends React.Component {
  state = {
    searchTerm: '',
    currentPageAlbums: 1,
    currentPageMusics: 1,
    albumsPerPage: 30,
    musicsPerPage: 16,
    favoriteAlbums: JSON.parse(localStorage.getItem('favorite_albums')) || {},
    favoriteMusics: {},
    isLoading: true,
  };

  componentDidMount() {
    this.fetchFavoriteMusicData();
  }

  handleSearch = ({ target }) => {
    this.setState({ searchTerm: target.value });
  };

  handleUpdateFavorites = (favoriteData) => {
    const { collectionId, isFavorite } = favoriteData;
    const { favoriteAlbums } = this.state;

    if (!favoriteAlbums) return;

    if (!isFavorite) {
      delete favoriteAlbums[collectionId];
    } else {
      favoriteAlbums[collectionId] = favoriteData;
    }

    localStorage.setItem('favorite_albums', JSON.stringify(favoriteAlbums));
    this.setState({ favoriteAlbums });
  };

  async getFavoriteMusics() {
    const favoriteMusics = await getFavoriteSongs();
    return favoriteMusics.reduce((acc, cur) => {
      acc[cur.trackId] = cur;
      return acc;
    }, {});
  }

  fetchFavoriteMusicData = async () => {
    const favoriteMusics = await this.getFavoriteMusics();
    this.setState({ favoriteMusics });

    const promises = Object.values(favoriteMusics).map(async (music) => {
      const results = await getMusics(music.trackId);
      const result = results.find((r) => r.trackId === music.trackId);
      return {
        ...music,
        artistName: result.artistName,
        trackName: result.trackName,
      };
    });

    const updatedFavoriteMusics = await Promise.all(promises);
    const updatedFavoriteMusicsObject = updatedFavoriteMusics.reduce((acc, cur) => {
      acc[cur.trackId] = cur;
      return acc;
    }, {});
    this.setState({ favoriteMusics: updatedFavoriteMusicsObject, isLoading: false });
  };

  paginateAlbums = (pageNumber) => this.setState({ currentPageAlbums: pageNumber });

  paginateMusics = (pageNumber) => this.setState({ currentPageMusics: pageNumber });

  formatName = (name) => {
    const MAX_LENGTH = 28;
    return name.length > MAX_LENGTH ? `${name.slice(0, MAX_LENGTH)}...` : name;
  };

  render() {
    const {
      searchTerm,
      favoriteAlbums,
      favoriteMusics,
      albumsPerPage,
      musicsPerPage,
      currentPageAlbums,
      currentPageMusics,
      isLoading,
    } = this.state;

    const favoriteAlbumCards = Object.values(favoriteAlbums);
    const favoriteMusicCards = Object.values(favoriteMusics);
    const indexOfLastAlbum = currentPageAlbums * albumsPerPage;
    const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage;
    const indexOfLastMusic = currentPageMusics * musicsPerPage;
    const indexOfFirstMusic = indexOfLastMusic - musicsPerPage;

    const filteredFavoriteAlbumCards = favoriteAlbumCards.filter(
      ({ artistName, collectionName, collectionId }) => {
        const isCardFavorite = !!favoriteAlbums[collectionId];
        return (
          isCardFavorite && artistName && collectionName
          && (artistName.toLowerCase().includes(searchTerm.toLowerCase())
            || collectionName.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      },
    );
    const currentFavoriteAlbumCards = filteredFavoriteAlbumCards.slice(
      indexOfFirstAlbum,
      indexOfLastAlbum,
    );

    const filteredFavoriteMusicCards = favoriteMusicCards.filter(
      ({ artistName, trackName, trackId }) => {
        const isCardFavorite = !!favoriteMusics[trackId];
        return (
          isCardFavorite && artistName && trackName
          && (artistName.toLowerCase().includes(searchTerm.toLowerCase())
            || trackName.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      },
    );
    const currentFavoriteMusicCards = filteredFavoriteMusicCards.slice(
      indexOfFirstMusic,
      indexOfLastMusic,
    );

    return (
      <div data-testid="page-favorites">
        <Header />
        <div className="search-bar">
          <h1>Favoritos ⭐️</h1>
          <form
            className="search-container"
            onSubmit={ (event) => event.preventDefault() }
          >
            <input
              className="search-input"
              placeholder="Nome do Álbum 🔎"
              onChange={ this.handleSearch }
            />
            <button
              type="button"
              className="search-button"
              onClick={ this.handleSearch }
            >
              Pesquisar
            </button>
          </form>
        </div>
        <div className="favorites-content">
          <h2 className="favorite-title">Álbuns favoritos</h2>
          <div className="favorites-container">
            {filteredFavoriteAlbumCards.length === 0
            && <p className="favorites-error">Nenhum favorito encontrado 🤨</p>}
            {filteredFavoriteAlbumCards.length > albumsPerPage && (
              <Pagination
                albumsPerPage={ albumsPerPage }
                totalAlbums={ filteredFavoriteAlbumCards.length }
                paginate={ this.paginateAlbums }
                currentPage={ currentPageAlbums }
                isTop
              />
            )}
            {currentFavoriteAlbumCards.map(({
              collectionId, collectionName, artworkUrl100, artistName,
            }) => (
              <SearchResult
                key={ collectionId }
                albumInfo={ {
                  collectionId,
                  collectionName,
                  artworkUrl100,
                  artistName,
                } }
                isFavorite={ !!favoriteAlbums[collectionId] }
                onToggleFavorite={ this.handleUpdateFavorites }
                fromList
                favoriteAlbums={ favoriteAlbums }
                handleUpdateFavorites={ this.handleUpdateFavorites }
              />
            ))}
            {filteredFavoriteAlbumCards.length > albumsPerPage && (
              <Pagination
                albumsPerPage={ albumsPerPage }
                totalAlbums={ filteredFavoriteAlbumCards.length }
                paginate={ this.paginateAlbums }
                currentPage={ currentPageAlbums }
              />
            )}
          </div>
          <h2 className="favorite-title">Músicas favoritas</h2>
          <div className="favorite-musics-container">
            {filteredFavoriteMusicCards.length > musicsPerPage && (
              <Pagination
                currentPage={ currentPageMusics }
                albumsPerPage={ musicsPerPage }
                totalAlbums={ filteredFavoriteMusicCards.length }
                paginate={ this.paginateMusics }
                isTop
              />
            )}
            {isLoading ? (<Loading />)
              : (currentFavoriteMusicCards.map((
                { artistName, trackName, previewUrl, trackId },
              ) => (
                <div key={ trackId } className="favorite-music-item">
                  <div>
                    <h3 className="favorite-track-name">
                      {this.formatName(trackName)}
                    </h3>
                    <h3 className="favorite-artist-name">
                      {this.formatName(artistName)}
                    </h3>
                  </div>
                  <div className="favorite-music-card">
                    <MusicCard
                      trackId={ trackId }
                      previewUrl={ previewUrl }
                    />
                  </div>
                </div>
              )))}
            {filteredFavoriteMusicCards.length > musicsPerPage && (
              <Pagination
                currentPage={ currentPageMusics }
                albumsPerPage={ musicsPerPage }
                totalAlbums={ filteredFavoriteMusicCards.length }
                paginate={ this.paginateMusics }
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Favorites;
