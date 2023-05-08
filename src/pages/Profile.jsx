import React from 'react';
import { GoMute, GoUnmute } from 'react-icons/go';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Loading from '../components/Loading';
import { getUser } from '../services/userAPI';
import profileVideo from '../video/profile-video.mp4';
import '../styles/Profile.css';

class Profile extends React.Component {
  state = {
    isMuted: true,
    isLoading: true,
    user: {},
  };

  componentDidMount() {
    getUser().then((user) => {
      this.setState({ user, isLoading: false });
    });
  }

  handleMuteClick = () => {
    this.setState((prevState) => ({
      isMuted: !prevState.isMuted,
    }));
  };

  render() {
    const { isMuted, isLoading, user } = this.state;

    return (
      <div data-testid="page-profile">
        <Header />
        {isLoading ? <Loading /> : (
          <div>
            <h1 className="profile-title">Profile 🤠</h1>
            <div className="profile-content">
              <div className="profile-info-container">
                {isLoading ? <Loading className="loading" /> : (
                  <div className="profile-info">
                    <div className="image-plus-button">
                      <img
                        className="profile-image"
                        data-testid="profile-image"
                        src={ user.image }
                        alt={ `${user.name}` }
                      />
                      <Link className="edit-profile-button" to="/profile/edit">
                        Editar perfil
                      </Link>
                    </div>
                    <h2 className="profile-key">Nome</h2>
                    <p className="profile-value">{user.name}</p>
                    <h2 className="profile-key">E-mail</h2>
                    <p className="profile-value">{user.email}</p>
                    <h2 className="profile-key">Descrição</h2>
                    <p className="profile-value profile-description">
                      {user.description}
                    </p>
                  </div>
                )}
              </div>
              <div className="profile-video-container">
                <video
                  className="profile-video"
                  id="profileVideo"
                  autoPlay
                  loop
                  muted={ !!isMuted }
                >
                  <track kind="captions" />
                  <source src={ profileVideo } type="video/mp4" />
                </video>
                <button className="mute-button" onClick={ this.handleMuteClick }>
                  {isMuted
                    ? <GoMute size="28" color="#19e319" />
                    : <GoUnmute size="28" color="#19e319" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Profile;
