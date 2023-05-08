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
  }

  render() {
    const { isLoading } = this.props;
    const { name } = this.state;
    const MAX_LENGTH = 11;
    const formattedName = name && name.length > MAX_LENGTH
      ? `${name.slice(0, MAX_LENGTH)}...` : name;
    const storedUser = formattedName || 'Usuário';
    return isLoading ? <Loading /> : (
      <header data-testid="header-component">
        <header className="header">
          <div>
            <h1 data-testid="header-user-name">
              {'Bem-vindo, '}
            </h1>
            <h1 className="username">{`${storedUser}`}</h1>
          </div>
          <Link data-testid="link-to-search" to="/search">Search</Link>
          <Link data-testid="link-to-favorites" to="/favorites">Favorites</Link>
          <Link data-testid="link-to-profile" to="/profile">Profile</Link>
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
