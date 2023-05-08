import React from 'react';
import PropTypes from 'prop-types';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { addSong, getFavoriteSongs, removeSong } from '../services/favoriteSongsAPI';
import Loading from './Loading';

class MusicCard extends React.Component {
  state = {
    checkbox: false,
    isLoading: false,
  };

  componentDidMount() {
    this.checkIfFavorite();
  }

  checkIfFavorite = async () => {
    const { trackId } = this.props;
    const favoriteSongs = await getFavoriteSongs();
    const isFavorite = favoriteSongs.some((song) => song.trackId === trackId);
    this.setState({ checkbox: isFavorite });
  };

  handleFavoriteChange = async (event) => {
    const { checked } = event.target;
    const { previewUrl, trackId } = this.props;
    const song = { previewUrl, trackId };
    this.setState({ isLoading: true });

    if (!checked) await removeSong(song);
    else await addSong(song);

    this.setState({ checkbox: checked, isLoading: false });
  };

  render() {
    const { checkbox, isLoading } = this.state;
    const { previewUrl, trackId } = this.props;
    return isLoading ? <Loading /> : (
      <>
        <audio data-testid="audio-component" src={ previewUrl } controls>
          <track kind="captions" />
          O seu navegador não suporta o elemento
          <code>audio</code>
        </audio>
        <label
          data-testid={ `checkbox-music-${trackId}` }
          className="checkbox-heart"
        >
          <input
            type="checkbox"
            name="checkbox"
            checked={ checkbox }
            onChange={ (event) => this.handleFavoriteChange(event) }
            className="checkbox-input"
          />
          { checkbox ? <AiFillHeart size="24" color="#06c206" />
            : <AiOutlineHeart size="24" color="#06c206" /> }
        </label>
      </>
    );
  }
}

MusicCard.propTypes = {
  previewUrl: PropTypes.string,
  trackName: PropTypes.string,
  trackId: PropTypes.string,
}.isRequired;

export default MusicCard;
