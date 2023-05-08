import React from 'react';
import { Redirect } from 'react-router-dom';
import {
  GoMute,
  GoUnmute,
} from 'react-icons/go';
import { AiOutlineExclamationCircle, AiFillCheckCircle } from 'react-icons/ai';
import Header from '../components/Header';
import Loading from '../components/Loading';
import { getUser, updateUser } from '../services/userAPI';
import profileVideo from '../video/profile-video.mp4';
import '../styles/Profile.css';

class ProfileEdit extends React.Component {
  state = {
    isDisabled: true,
    isMuted: true,
    isLoading: true,
    image: '',
    redirectTo: '',
    user: {},
    inputValid: {
      image: true,
      name: true,
      email: true,
      description: true,
    },
  };

  componentDidMount() {
    getUser().then((user) => {
      this.setState({ user, image: user.image, isLoading: false });
    });
  }

  handleMuteClick = () => {
    this.setState((prevState) => ({
      isMuted: !prevState.isMuted,
    }));
  };

  handleInputChange = (field, value) => {
    const { user, inputValid } = this.state;
    const newUser = { ...user, [field]: value };
    this.setState(
      {
        user: newUser,
        inputValid: { ...inputValid, [field]: this.validateField(field, value) },
      },
      this.validateAllFields,
    );
  };

  validateField = (field, value) => {
    const imageRegex = /^http(s)?:\/\/.*\.(?:png|jpg|gif|webp)$/i;
    const nameRegex = /^[a-zA-Z ]{3,12}$/;
    const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;
    const descriptionRegex = /^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s.,;'"\-()!?]{30,400}$/;

    switch (field) {
    case 'image':
      return imageRegex.test(value);
    case 'name':
      return nameRegex.test(value);
    case 'email':
      return emailRegex.test(value);
    case 'description':
      return descriptionRegex.test(value);
    default:
      return false;
    }
  };

  validateAllFields = () => {
    const { inputValid } = this.state;
    const allValid = Object.values(inputValid).every((valid) => valid);

    this.setState({ isDisabled: !allValid });
  };

  handleSaveClick = () => {
    const { user } = this.state;
    updateUser(user);
    this.setState({ redirectTo: '/profile' });
  };

  render() {
    const {
      isDisabled,
      isMuted,
      isLoading,
      user,
      image,
      redirectTo,
      inputValid,
    } = this.state;

    if (redirectTo) return <Redirect to={ redirectTo } />;

    return (
      <div data-testid="page-profile-edit">
        <Header />
        <h1 className="profile-title">ProfileEdit 🐸</h1>
        <div className="profile-content">
          <div className="profile-info-container profile-edit-container">
            {isLoading ? <Loading className="loading" /> : (
              <div className="profile-info">
                <div className="image-plus-button image-plus-input">
                  <img
                    className="profile-image profile-edit-image"
                    data-testid="profile-image"
                    src={ image }
                    alt={ `${user.name}` }
                  />
                  <div className="profile-input-container">
                    <input
                      data-testid="edit-input-image"
                      className="profile-value profile-input profile-edit-input-image"
                      value={ user.image }
                      type="text"
                      onChange={ (e) => this.handleInputChange('image', e.target.value) }
                    />
                    {!inputValid.image && (
                      <AiOutlineExclamationCircle size="24" color="grey" />
                    )}
                    {inputValid.image && <AiFillCheckCircle size="24" />}
                  </div>
                </div>
                <h2 className="profile-key">Nome</h2>
                <div className="profile-input-container">
                  <input
                    data-testid="edit-input-name"
                    className="profile-value profile-input"
                    value={ user.name }
                    type="text"
                    onChange={ (e) => this.handleInputChange('name', e.target.value) }
                  />
                  {!inputValid.name && (
                    <AiOutlineExclamationCircle size="24" color="grey" />
                  )}
                  {inputValid.name && <AiFillCheckCircle size="24" />}
                </div>
                <h2 className="profile-key">E-mail</h2>
                <div className="profile-input-container">
                  <input
                    data-testid="edit-input-email"
                    className="profile-value profile-input"
                    value={ user.email }
                    type="text"
                    onChange={ (e) => this.handleInputChange('email', e.target.value) }
                  />
                  {!inputValid.email && (
                    <AiOutlineExclamationCircle size="24" color="grey" />
                  )}
                  {inputValid.email && <AiFillCheckCircle size="24" />}
                </div>
                <h2 className="profile-key">Descrição</h2>
                <div className="profile-input-container">
                  <textarea
                    data-testid="edit-input-description"
                    className="profile-value
                    profile-input profile-description
                    profile-edit-description"
                    value={ user.description }
                    type="text"
                    onChange={ (e) => this.handleInputChange(
                      'description',
                      e.target.value,
                    ) }
                  />
                  {!inputValid.description && (
                    <AiOutlineExclamationCircle size="24" color="grey" />
                  )}
                  {inputValid.description && <AiFillCheckCircle size="24" />}
                </div>
                <button
                  data-testid="edit-button-save"
                  className="save-profile-button"
                  disabled={ isDisabled }
                  onClick={ this.handleSaveClick }
                >
                  Salvar
                </button>
              </div>)}
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
    );
  }
}

export default ProfileEdit;
