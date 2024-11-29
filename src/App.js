import React, { useState } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { useAuth0 } from '@auth0/auth0-react';
import './App.css'

// Configuration (Move to .env file in real-world scenario)
const AUTH0_DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.REACT_APP_AUTH0_CLIENT_ID;
const AUTH0_CALLBACK_URL = "http://localhost:3000";

// Login Component
const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  if (isAuthenticated) return null;

  return (
    <button 
      onClick={() => loginWithRedirect()}
      className="btn btn-primary"
    >
      Log In
    </button>
  );
};

// Logout Component
const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth0();

  if (!isAuthenticated) return null;

  return (
    <button 
      onClick={() => logout({ 
        logoutParams: { 
          returnTo: window.location.origin 
        } 
      })}
      className="btn btn-danger"
    >
      Log Out
    </button>
  );
};

// User Profile Component
const UserProfile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading user information...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="user-profile">
      {user?.picture && (
        <img 
          src={user.picture} 
          alt={user.name || 'User Profile'} 
          className="profile-image"
        />
      )}
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};

// Main Application Component
const App = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="container">
      <header className="app-header">
        <h1>Secure Authentication App</h1>
        <div className="auth-buttons">
          <LoginButton />
          <LogoutButton />
        </div>
      </header>

      <main>
        {isAuthenticated ? (
          <div className="authenticated-content">
            <UserProfile />
            <section>
              <h2>Welcome to Your Secure Dashboard</h2>
              <p>You are now logged in and can access protected features.</p>
            </section>
          </div>
        ) : (
          <section className="login-prompt">
            <h2>Please Log In</h2>
            <p>Click the Log In button to access your personalized dashboard.</p>
          </section>
        )}
      </main>
    </div>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h1>Something went wrong</h1>
          <p>Please try logging in again or contact support.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Auth Provider Wrapper
const AuthenticatedApp = () => {
  const [authConfig] = useState({
    domain: AUTH0_DOMAIN,
    clientId: AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: AUTH0_CALLBACK_URL
    }
  });

  return (
    <ErrorBoundary>
      <Auth0Provider
        domain={authConfig.domain}
        clientId={authConfig.clientId}
        authorizationParams={authConfig.authorizationParams}
      >
        <App />
      </Auth0Provider>
    </ErrorBoundary>
  );
};

export default AuthenticatedApp;