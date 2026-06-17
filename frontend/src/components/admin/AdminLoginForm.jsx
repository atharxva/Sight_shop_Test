import React from 'react';
import PropTypes from 'prop-types';
import './AdminStyles.css';

const AdminLoginForm = ({ username, password, onUsernameChange, onPasswordChange, onSubmit }) => {
    return (
        <form onSubmit={onSubmit} className="admin-login-form">
            <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => onUsernameChange(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="login-button">Login</button>
        </form>
    );
};

AdminLoginForm.propTypes = {
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    onUsernameChange: PropTypes.func.isRequired,
    onPasswordChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default AdminLoginForm;
