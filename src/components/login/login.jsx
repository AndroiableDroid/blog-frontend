import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/loginSlice";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import './login.css';

export const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const state = useSelector((state) => state.login);
    const [jwt, setjwt] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginButton, setLoginButton] = useState("Login");
    const [cookies, setCookie, removeCookie] = useCookies(['jwtInCookie']);

    useEffect(() => {
        setjwt(state.data?.token);
        if (jwt) {
            setCookie('jwtInCookie', jwt, {
                expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            });
        }
    }, [state, jwt]);

    useEffect(() => {
        setjwt(null);
        console.log("after", jwt);
    }, [jwt]);

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoginButton("wait...");
        await dispatch(login({ email, password }));
        console.log(email, password);
        setLoginButton("Login");
        setEmail("");
        setPassword("");
    };

    return (
        <div className="login-supreme-container">
            <div className="login-container">
            <form className="login-form-container" onSubmit={handleLogin}>
                <label htmlFor="email" className="email-label">Email
                    <input
                        type="text"
                        value={email}
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <label htmlFor="password" className="password-label">Password
                    <input
                        type="password"
                        value={password}
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <button type="submit" disabled={loginButton === "wait..."}>
                    {loginButton}
                </button>
            </form>
            </div>
        </div>
    );
};