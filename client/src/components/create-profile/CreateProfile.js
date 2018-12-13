import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class CreateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // toggle this
      displaySocialInputs: false,
    };
  }
  render() {
    return (
      <div>
        
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

CreateProfile.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
}

CreateProfile.defaultProps = {

}

export default connect(mapStateToProps)(CreateProfile);