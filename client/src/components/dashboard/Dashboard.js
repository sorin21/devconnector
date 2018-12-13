import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames'

import { getCurrentProfile } from '../../actions/profileActions'
import Spinner from '../common/Spinner';

class Dashboard extends Component {


  // we want getCurrentProfile to be called right away
  componentDidMount() {
    this.props.getCurrentProfile();
  }

  render() {
    // Check if profile state is not null, before we render anything
    let dashboardContent;
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;
    const className = classNames('alert', {
      'alert-danger': typeof profile === 'object' && profile !== null
    });

    if (profile === null || loading === true) {
      // profile will be null in the begining because getCurrentProfile() is called rigth away
      // and has default value null in reducer
      dashboardContent = <Spinner />;

    } else {
      // Checked if logged user has profile data
      if (Object.keys(profile).length > 0) {
        // if true means something is in profile object
        // so we display the profile
        dashboardContent = <h4>Display Profile</h4>
      } else {
        // User is logged in but has no profile
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome {user.name}</p>
            <p className={className}>You have not yet setup a profile, please add some info</p>
            <Link to="/create-profile" className="btn btn-lg btn-info">Create Profile</Link>
          </div>
        )
      }
    }
    return (
      <div className="dashboard">
        <div className="contaner">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Dashboard
              </h1>
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    profile: state.profile,
    auth: state.auth
  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
}

Dashboard.defaultProps = {

}

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);