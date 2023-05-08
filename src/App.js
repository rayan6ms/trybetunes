import React from 'react';
import { Route, Switch } from 'react-router-dom';
import {
  Login,
  Search,
  Album,
  Favorites,
  Profile,
  ProfileEdit,
  Loading,
  NotFound,
} from './pages';

class App extends React.Component {
  state = {
    favoriteAlbums: JSON.parse(localStorage.getItem('favorite_albums')) || {},
  };

  updateFavorites = (favoriteAlbums) => {
    this.setState({ favoriteAlbums });
  };

  render() {
    const { favoriteAlbums } = this.state;
    return (
      <Switch>
        <Route exact path="/" component={ Login } />
        <Route
          path="/search"
          render={ (props) => (
            <Search { ...props } onUpdateFavorites={ this.updateFavorites } />
          ) }
        />
        <Route path="/album/:id" component={ Album } />
        <Route
          path="/favorites"
          render={ (props) => (
            <Favorites
              { ...props }
              favoriteAlbums={ favoriteAlbums }
              onUpdateFavorites={ this.updateFavorites }
            />) }
        />
        <Route exact path="/profile" component={ Profile } />
        <Route path="/profile/edit" component={ ProfileEdit } />
        <Route path="/loading" component={ Loading } />
        <Route path="*" component={ NotFound } />
      </Switch>
    );
  }
}

export default App;
