import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASEURL, LOGIN } from '../Api/Api';
import Cookie from 'cookie-universal';
import Placeholder from '../Component/Placeholder/Placeholder';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password) => {
        const hasFourLetters = (password.match(/[a-zA-Z]/g) || []).length >= 3;
        const hasFourNumbers = (password.match(/\d/g) || []).length >= 3;
        return hasFourLetters && hasFourNumbers;
    };

    const validate = () => {
        const newErrors = {};
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Invalid email address';
        }
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (!validatePassword(password)) {
            newErrors.password = 'Invalid Password';
        }
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const cookie = Cookie();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const body = { email, password };
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {
            setLoading(true);
            const res = await axios.post(`${BASEURL}/${LOGIN}`, body);
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 30);
            cookie.set("token", res.data.token, { path: '/', expires: expirationDate });
            cookie.set("reftoken", res.data.refreshToken, { path: '/', expires: expirationDate });
            cookie.set("currentUser", res.data.user, { path: '/', expires: expirationDate });
            navigate("/home");
        } catch (err) {
            if (err.response?.status === 401) {
                setErrors({ responseErr: "Wrong Email/Password" });
            }
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xs mx-auto mt-8 mb-32 p-6 shadow-lg rounded-lg bg-white">
            <Placeholder loading={loading} />
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
                <h5 className="text-2xl font-bold text-primary">Login To</h5>
                <h4 className="text-3xl font-bold text-primary">E-Com</h4>

                <div className="w-full">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-lg ${errors.email ? 'border-primary' : 'border-gray-300'}`}
                    />
                    {errors.email && <p className="text-secondray text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="w-full">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-lg ${errors.password ? 'border-primary' : 'border-gray-300'}`}
                    />
                    {errors.password && <p className="text-secondray text-sm mt-1">{errors.password}</p>}
                </div>

                {errors.responseErr && <p className="text-secondray text-sm">{errors.responseErr}</p>}

                <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg mt-2">Log In</button>

                <a href="#" className="text-primary text-sm mt-2">Forgot password?</a>

                <p className="text-primary text-sm mt-2">or</p>

                <a
                    href="http://localhost:5212/api/Auth/login-google"
                    className="w-full flex items-center justify-center border border-primary text-sm text-primary py-2 rounded-lg hover:bg-primary/10"
                >
                    <img
                        src={('./assets/GoogleIcon.ico')}
                        alt="Google logo"
                        className="w-5 h-5 mr-2 "
                    />
                    Log in with Google
                </a>

                <button
                    onClick={() => navigate("/register")}
                    className="w-full mt-4 border border-primary text-primary py-2 rounded-lg hover:bg-primary/10"
                >
                    Create New Account
                </button>
            </form>
        </div>
    );
};

export default Login;
