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
        <Route exact path="/trybetunes/" component={ Login } />
        <Route
          path="/trybetunes/search"
          render={ (props) => (
            <Search { ...props } onUpdateFavorites={ this.updateFavorites } />
          ) }
        />
        <Route path="/trybetunes/album/:id" component={ Album } />
        <Route
          path="/trybetunes/favorites"
          render={ (props) => (
            <Favorites
              { ...props }
              favoriteAlbums={ favoriteAlbums }
              onUpdateFavorites={ this.updateFavorites }
            />) }
        />
        <Route exact path="/trybetunes/profile" component={ Profile } />
        <Route path="/trybetunes/profile/edit" component={ ProfileEdit } />
        <Route path="/trybetunes/loading" component={ Loading } />
        <Route path="/trybetunes/*" component={ NotFound } />
      </Switch>
    );
  }
}

export default App;
