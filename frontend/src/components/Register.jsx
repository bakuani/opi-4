import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const Register = () => {
    const navigate = useNavigate();
    const [registerForm, setRegisterForm] = useState({ username: "", password: "" });

    const handleChange = (e) => {
        setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
    };

    const register = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registerForm),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Ошибка при регистрации:", error);
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
                <h2 className="form-title">Регистрация</h2>
                <form onSubmit={register} className="form">
                    <div className="form-group">
                        <label htmlFor="newUsername">Логин:</label>
                        <input
                            type="text"
                            id="newUsername"
                            name="username"
                            value={registerForm.username}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPassword">Пароль:</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="password"
                            value={registerForm.password}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="button">Зарегистрироваться</button>
                </form>
                <button onClick={() => navigate("/")} className="button">Назад к входу</button>
            </div>
        </div>
    );
};

export default Register;
