import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const Login = () => {
    const navigate = useNavigate();
    const [loginForm, setLoginForm] = useState({ username: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    };

    const login = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginForm),
            });
            const data = await response.json();

            console.log(data);

            if (response.status === 200) {
                localStorage.setItem("token", data.token);
                navigate("/main");
            } else {
                setErrorMessage("Ошибка входа. Проверьте логин и пароль.");
            }
        } catch (error) {
            console.error("Ошибка при входе:", error);
            setErrorMessage("Ошибка сети. Попробуйте позже.");
        }
    };

    return (
        <div className="container">
            <header className="header">
                <h1>Джохадзе Анна Бекаевна</h1>
                <h2>Группа: P3210</h2>
                <h3>Вариант: 519371</h3>
            </header>
            <div className="form-container">
                <h2 className="form-title">Вход</h2>
                <form onSubmit={login} className="form">
                    <div className="form-group">
                        <label htmlFor="username">Логин:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={loginForm.username}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Пароль:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={loginForm.password}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="button">Войти</button>
                </form>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <p className="register-link">
                    Ещё нет аккаунта? <button onClick={() => navigate("/register")} className="link-button">Зарегистрироваться</button>
                </p>
            </div>
        </div>
    );
};

export default Login;
