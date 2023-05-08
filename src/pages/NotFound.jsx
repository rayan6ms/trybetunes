import React from 'react';
import Header from '../components/Header';

class NotFound extends React.Component {
  render() {
    return (
      <div data-testid="page-not-found">
        <Header />
        <h1>Not Found</h1>
      </div>
    );
  }
}

export default NotFound;
