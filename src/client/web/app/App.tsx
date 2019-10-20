// Library
import React from 'react';
import FadeIn from 'react-fade-in';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import queryString from 'query-string';

// Containers & component
import Chat from '@omega-web-containers/chat';
import LoginDialog from '@omega-web-Components/login';

// Redux
import { config } from '@omega-core/config';
import { getLocale } from '../../shared/state/containers/app/selectors';
import { setLocale, setToken } from '../../shared/state/containers/app/actions';

// Config

// import './App.scss';

// Internal Components

// containers
export interface PropsT {
	setLocale: (string) => {};
	t: (string) => string;
}

class App extends React.PureComponent<any, any> {
	componentDidMount() {
		const { location } = this.props;
		if (location) {
			const idTokenObj = queryString.parse(location.search);
			if (typeof window !== 'undefined' && idTokenObj && idTokenObj.idToken) {
				const { dispatchSetToken } = this.props;
				window.sessionStorage.setItem('token', JSON.stringify(idTokenObj));
				// HttpService.setCookie('accessToken', idTokenObj.accessToken, {
				// 	// 'Secure': true,
				// 	// 'HttpOnly': true,
				// 	'max-age': 3600
				// });
				dispatchSetToken(idTokenObj.idToken);
				window.location.search = '';
			}
 			else {
				try {
					const { dispatchSetToken } = this.props;
					const idTokenStorage =
						window.sessionStorage.getItem('token') &&
						JSON.parse(window.sessionStorage.getItem('token'));
					if (idTokenStorage && idTokenStorage.idToken) {
						dispatchSetToken(idTokenStorage.idToken);
					}
				}
 				catch (error) {
					console.log('error', error);
				}
			}

			/* Only register a service worker if it's supported */
			if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
				navigator.serviceWorker.register('/service-worker.js');
			}
		}
	}

	setLanguage = (e: any) => {
		const { dispatchSetLocale } = this.props;
		dispatchSetLocale(e.target.value);
	};

	handleLoginClick = () => {
		if (typeof window !== 'undefined') {
			window.location.href = config.API_URL + config.LOGIN_URL;
		}
	};

	renderChat = () => {
		const { t, app } = this.props;
		const { idToken } = app;
		return idToken === '' ? (
			<LoginDialog
				show={idToken === ''}
				handleLoginClick={this.handleLoginClick}
			/>
		) : (
			<div
				style={{
					filter: idToken === '' ? 'blur(10px)' : 'none'
				}}
			>
				<div
					style={{
						position: 'absolute',
						zIndex: 1,
						right: '14%',
						top: 26
					}}
				>
					<button value='fr-FR' onClick={this.setLanguage}>
						French
					</button>
					<button value='de-DE' onClick={this.setLanguage}>
						Deutsch
					</button>
					<button value='en-US' onClick={this.setLanguage}>
						English
					</button>
				</div>
				<Chat title={t('i18n-example')} idToken={idToken} />
				<div
					id={'footer'}
					style={{
						textAlign: 'center',
						fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
						marginTop: 15
					}}
				>
					{`Version - ${process.env.APP_VERSION || '0.0.1'}`}
				</div>
			</div>
		);
	}

	renderAppScreen = () => {
		const TypedHelmet: any = Helmet;
		return (
			<FadeIn>
				<TypedHelmet
					defaultTitle='React Redux SSR Advanced Seed'
					titleTemplate='%s – React Redux SSR Advanced Seed'
				/>
				{this.renderChat()}
			</FadeIn>
		);
	};

	render() {
		const { tReady } = this.props;
		return tReady ? this.renderAppScreen() : [];
	}
}

const mapDispatchToProps = {
	dispatchSetLocale: (locale: any) => setLocale(locale),
	dispatchSetToken: (token: any) => setToken(token)
};

const mapStateToProps = (state: { app: any }) => ({
	app: getLocale(state)
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withTranslation()(App));
