import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Sidebar.css';

class Sidebar extends React.Component {
  render() {
    const { genresList, onGenreClick } = this.props;
    return (
      <div className="sidebar">
        <h2 className="sidebar-title">Gêneros</h2>
        <ul className="sidebar-genres-list">
          {genresList.map((genre, index) => (
            <li key={ index }>
              <button
                className="sidebar-genre-button"
                onClick={ () => onGenreClick(genre, true) }
              >
                {genre}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

Sidebar.propTypes = {
  genresList: PropTypes.arrayOf(PropTypes.string).isRequired,
  onGenreClick: PropTypes.func.isRequired,
};

export default Sidebar;
