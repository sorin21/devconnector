import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getCurrentProfile } from '../../actions/profileActions'

class Dashboard extends Component {

  // we want getCurrentProfile to be called right away
  componentDidMount() {
    this.props.getCurrentProfile();
  }

  render() {
    return (
      <div>
        <h1>Dashboard</h1>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    profile: state.profile,
    errors: state.errors
  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
}

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);