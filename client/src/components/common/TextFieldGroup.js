import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types'

const TextFieldGroup = ({
  // all the properties that this func will accept
  name,
  placeholder,
  value,
  label,
  error,
  info,
  type,
  onChange,
  disabled
}) => {
  return (
    <div className="form-group">
      <input
        // type="email"
        type={type}
        // className={classnames("form-control form-control-lg", {
        //   "is-invalid": errors.email
        // })}
        className={classnames("form-control form-control-lg", {
          "is-invalid": error
        })}
        // placeholder="Email Address"
        placeholder={placeholder}
        // name="email"
        name={name}
        // value={this.state.email}
        value={value}
        // onChange={this.onChange} 
        onChange={onChange}
        disabled={disabled}
      />
      {info && <small className="form-text text-muted">{info}</small>}
      {/* {errors.email && (<div className="invalid-feedback">{errors.email}</div>)} */}
      {error && (<div className="invalid-feedback">{error}</div>)}
    </div>
  );
};

TextFieldGroup.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  info: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.string,
}

TextFieldGroup.defaultProps = {
  type: 'text'
}

export default TextFieldGroup;