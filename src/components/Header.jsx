import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getUser } from '../services/userAPI';
import Loading from './Loading';
import '../styles/Header.css';

class Header extends React.Component {
  state = {
    name: 'Usuário',
  };

  componentDidMount() {
    this.getUser();
  }

  async getUser() {
    const { name } = await getUser();
    this.setState({ name });
    localStorage.setItem('storedUserName', JSON.stringify(name));
  }

  shortenName = (name) => {
    const MAX_LENGTH = 11;
    return name.length > MAX_LENGTH ? `${name.slice(0, MAX_LENGTH)}...` : name;
  };

  render() {
    const { isLoading } = this.props;
    const { name } = this.state;

    const storedName = JSON.parse(localStorage.getItem('storedUserName'));
    const formattedName = this.shortenName(storedName || name);

    return isLoading ? <Loading /> : (
      <header data-testid="header-component">
        <header className="header">
          <div>
            <h1 data-testid="header-user-name">
              {'Bem-vindo, '}
            </h1>
            <h1 className="username">{`${formattedName}`}</h1>
          </div>
          <Link
            data-testid="link-to-search"
            to="/trybetunes/search"
          >
            Search
          </Link>
          <Link
            data-testid="link-to-favorites"
            to="/trybetunes/favorites"
          >
            Favorites
          </Link>
          <Link
            data-testid="link-to-profile"
            to="/trybetunes/profile"
          >
            Profile
          </Link>
        </header>
      </header>
    );
  }
}

Header.propTypes = {
  isLoading: PropTypes.bool,
};

Header.defaultProps = {
  isLoading: false,
};

export default Header;
