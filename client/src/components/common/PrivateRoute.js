import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'

const PrivateRoute = ({ component: Component, auth, ...otherProps }) => {
  return (
    <Route
      {...otherProps}
      render={(props) => auth.isAuthenticated === true ? (
        // if is authenticated load the component
        <Component {...props} />
      ) :
        (
          // if not authenticated, redirect to login
          <Redirect to="/login" />
        )}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  }
}

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
}

PrivateRoute.defaultProps = {

}

export default connect(mapStateToProps)(PrivateRoute);