import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

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
    const user = this.props.auth;
    const { profile, loading } = this.props.profile;


    if (profile === null || loading === true) {
      // profile will be null in the begining because getCurrentProfile() is called rigth away
      // and has default value null in reducer
      dashboardContent = <Spinner />;

    } else {
      // Checked if logged user has profile data
    }
    return (
      <div className="dashboard">
        <div className="contaner">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Dashboard
                {dashboardContent}
              </h1>
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