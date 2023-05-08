import React from 'react';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import Loading from '../components/Loading';
import MusicCard from '../components/MusicCard';
import Pagination from '../components/Pagination';
import getMusics from '../services/musicsAPI';
import '../styles/Album.css';

class Album extends React.Component {
  state = {
    musics: [],
    isLoading: true,
    currentPage: 1,
  };

  componentDidMount() {
    this.fetchMusics();
  }

  paginate = (pageNumber) => this.setState({ currentPage: pageNumber });

  formatName = (name) => {
    const MAX_LENGTH = 28;
    return name.length > MAX_LENGTH ? `${name.slice(0, MAX_LENGTH)}...` : name;
  };

  async fetchMusics() {
    const { match: { params: { id } } } = this.props;
    const musics = await getMusics(id);
    this.setState({ musics, isLoading: false });
  }

  render() {
    const { musics, isLoading, currentPage } = this.state;
    const musicsPerPage = 17;
    const indexOfLastMusic = currentPage * musicsPerPage;
    const indexOfFirstMusic = indexOfLastMusic - musicsPerPage;
    const currentMusics = musics.slice(indexOfFirstMusic, indexOfLastMusic);
    return (
      <div data-testid="page-album">
        <Header isLoading={ isLoading } />
        <div className="album-page">
          {isLoading ? (
            <Loading />
          ) : (
            <div className="album-info">
              <h1 className="album-title">Album</h1>
              <img
                className="album-img"
                src={ musics[0] && musics[0].artworkUrl100 }
                alt="album cover"
              />
              <h2 data-testid="album-name" className="album-name">
                {musics[0].collectionName}
              </h2>
              <h2 data-testid="artist-name" className="artist-name">
                {musics[0].artistName}
              </h2>
            </div>
          )}
          <div className="music-list">
            {musics.length > musicsPerPage && (
              <Pagination
                currentPage={ currentPage }
                albumsPerPage={ musicsPerPage }
                totalAlbums={ musics.length }
                paginate={ this.paginate }
                isTop
              />
            )}
            {currentMusics
              && currentMusics.map((music) => (
                music.previewUrl && (
                  <div key={ music.trackId } className="music-item">
                    <div className="music-card-container">
                      <h2 className="track-name">{ this.formatName(music.trackName) }</h2>
                      <div className="music-card">
                        <MusicCard
                          trackId={ music.trackId }
                          previewUrl={ music.previewUrl }
                        />
                      </div>
                    </div>
                  </div>
                )
              ))}
            {musics.length > musicsPerPage && (
              <Pagination
                currentPage={ currentPage }
                albumsPerPage={ musicsPerPage }
                totalAlbums={ musics.length }
                paginate={ this.paginate }
              />
            )}

          </div>
        </div>
      </div>
    );
  }
}

Album.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default Album;
