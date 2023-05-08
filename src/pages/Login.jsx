import React from 'react';
import PropTypes from 'prop-types';
import { createUser } from '../services/userAPI';
import Loading from '../components/Loading';
import Header from '../components/Header';
import '../styles/Login.css';

class Login extends React.Component {
  state = {
    loginName: JSON.parse(localStorage.getItem('user'))
      ? JSON.parse(localStorage.getItem('user')).name : '',
    email: 'trybe@example.com',
    image: '',
    description: 'Mussum Ipsum, cacilds vidis litro abertis. '
    + 'Per aumento de cachacis, eu reclamis. '
    + 'Todo mundo vê os porris que eu tomo, mas ninguém vê os tombis que eu levis! '
    + 'Suco de cevadis deixa as pessoas mais interessantis. '
    + 'Mé faiz elementum girarzis, nisi eros vermeio. '
    + 'Si u mundo tá muito paradis? Toma um mé que o mundo vai girarzis! '
    + 'Paisis, filhis, espiritis santis. Cevadis im ampola pa arma uma pindureta.',
    isLoginButtonDisabled: true,
    isLoading: false,
  };

  componentDidMount() {
    this.getRandomImage();
  }

  getRandomImage = () => {
    const images = ['http://www.goodmorningimagesdownload.com/wp-content/uploads/2021/12/Insta-Profile-Photo-Download-Free.jpg', 'http://www.goodmorningimagesdownload.com/wp-content/uploads/2021/05/Best-Insta-Profile-Images-pics-free-hd-296x300.gif', 'https://unkleaboki.com/wp-content/uploads/2022/06/Funny-PFP-8.webp', 'https://online.hitpaw.com/images/topics/background-remover/meme-pfp.jpg', 'https://pbs.twimg.com/media/EJJaFdCUwAAKas9.jpg', 'https://i.kym-cdn.com/photos/images/original/001/802/083/eef.jpg', 'https://i.redd.it/l3qpdkacqlv41.jpg'];

    const randomIndex = Math.floor(Math.random() * images.length);
    this.setState({ image: images[randomIndex] });
  };

  validationFields = () => {
    const { loginName, email } = this.state;
    const MIN_LENGTH = 3;
    const isValid = loginName.length >= MIN_LENGTH && email.length >= MIN_LENGTH;
    this.setState({ isLoginButtonDisabled: !isValid });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value }, () => {
      this.validationFields();
    });
  };

  handleEnterKey = ({ key }) => {
    const { isLoginButtonDisabled } = this.state;
    if (key === 'Enter' && !isLoginButtonDisabled) {
      this.handleLoginButton();
    }
  };

  handleLoginButton = () => {
    this.setState({ isLoading: true }, async () => {
      this.getRandomImage();
      const { loginName, email, image, description } = this.state;
      await createUser({ name: loginName, email, image, description });
      const { history } = this.props;
      history.push('/search');
    });
  };

  render() {
    const { isLoginButtonDisabled, isLoading } = this.state;
    return (
      <div data-testid="page-login">
        <Header />
        <div className="login-container">
          {isLoading ? <Loading /> : (
            <form className="login-form" onSubmit={ (event) => event.preventDefault() }>
              <h1>Login</h1>
              <label htmlFor="login-name-input">Name:</label>
              <input
                type="text"
                name="loginName"
                id="login-name-input"
                placeholder="Nome"
                data-testid="login-name-input"
                onChange={ this.handleChange }
                onKeyDown={ this.handleEnterKey }
              />
              <button
                className="login-button"
                data-testid="login-submit-button"
                onClick={ this.handleLoginButton }
                disabled={ isLoginButtonDisabled }
              >
                Entrar
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Login;
