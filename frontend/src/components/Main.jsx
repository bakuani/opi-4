import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const Main = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const [point, setPoint] = useState({ x: null, y: "", r: null });
    const [errorMessage, setErrorMessage] = useState("");
    const [results, setResults] = useState([]);
    const xOptions = [-5, -4, -3, -2, -1, 0, 1, 2, 3];
    const rOptions = [0, 1, 2, 3];
    const canvasSize = 400;

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        fetch("/api/get-points", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then((data) => {
                if (data.points.length > 0) {
                    setResults(data.points);
                }
            })
            .catch((error) => console.error("Ошибка загрузки данных:", error));
    }, [navigate]);

    const validatePoint = (p) => {
        if (p.x === null || p.y === "" || p.r === null) {
            setErrorMessage("Все поля должны быть заполнены!");
            return false;
        }
        if (p.y < -5 || p.y > 5) {
            setErrorMessage("Y должен быть в диапазоне от -5 до 5");
            return false;
        }
        return true;
    };

    const submitPointData = async (newPoint) => {
        if (!validatePoint(newPoint)) return;
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/check-point", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newPoint),
            });

            console.log(response);
            const data = await response.json();

            if (response.status === 200) {
                setResults([...results, data.point]);
                setErrorMessage("");
            } else {
                setErrorMessage("Ошибка проверки точки");
            }
        } catch (error) {
            console.error("Ошибка отправки данных:", error);
        }
    };

    const handleCanvasClick = (event) => {
        if (!point.r) {
            setErrorMessage("Укажите радиус R перед кликом по графику");
            return;
        }

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const canvasX = event.clientX - rect.left;
        const canvasY = event.clientY - rect.top;
        const xVal = ((canvasX / rect.width) - 0.5) * point.r * 2;
        const yVal = (((rect.height - canvasY) / rect.height) - 0.5) * point.r * 2;
        const newPoint = {
            ...point,
            x: Math.round(xVal * 10) / 10,
            y: Math.round(yVal * 10) / 10,
        };

        setPoint(newPoint);
        submitPointData(newPoint);
    };

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const currentR = point.r || (results.length > 0 ? results[0].r : 1);
        const scale = (canvas.width / 2) / currentR;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);

        const axisLimit = currentR * scale * 1.2;

        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-axisLimit, 0);
        ctx.lineTo(axisLimit, 0);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(axisLimit, 0);
        ctx.lineTo(axisLimit - 10, 5);
        ctx.lineTo(axisLimit - 10, -5);
        ctx.fillStyle = "black";
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, axisLimit);
        ctx.lineTo(0, -axisLimit);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, -axisLimit);
        ctx.lineTo(-5, -axisLimit + 10);
        ctx.lineTo(5, -axisLimit + 10);
        ctx.fill();

        ctx.font = "14px sans-serif";
        ctx.fillStyle = "black";
        ctx.fillText("X", axisLimit - 15, -8);
        ctx.fillText("Y", -12, -axisLimit + 15);

        const labels = [-currentR, -currentR / 2, 0, currentR / 2, currentR];
        const getLabel = (val) => {
            if (val === 0) return "0";
            if (val === currentR) return "R";
            if (val === currentR / 2) return "R/2";
            if (val === -currentR / 2) return "-R/2";
            if (val === -currentR) return "-R";
            return val.toString();
        };

        ctx.lineWidth = 1;
        labels.forEach((val) => {
            const pos = val * scale;

            ctx.beginPath();
            ctx.moveTo(pos, -5);
            ctx.lineTo(pos, 5);
            ctx.stroke();

            if (val !== 0) {
                ctx.fillText(getLabel(val), pos - 10, 20);
            } else {
                ctx.fillText("0", pos + 5, 15);
            }

            ctx.beginPath();
            ctx.moveTo(-5, -pos);
            ctx.lineTo(5, -pos);
            ctx.stroke();

            if (val !== 0) {
                ctx.fillText(getLabel(val), 10, -pos + 5);
            }
        });

        ctx.globalAlpha = 0.7;
        ctx.fillStyle = "blue";

        ctx.fillRect(0, -currentR * scale, currentR * scale, currentR * scale);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-currentR * scale, 0);
        ctx.lineTo(0, -(currentR / 2) * scale);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, currentR * scale, 0, Math.PI / 2, false);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();

        results.forEach(pt => {
            const cx = pt.x * scale;
            const cy = -pt.y * scale;
            ctx.beginPath();
            ctx.arc(cx, cy, 3, 0, 2 * Math.PI);
            ctx.fillStyle = pt.hit ? "green" : "red";
            ctx.fill();
        });

        ctx.restore();
    };

    useEffect(() => {
        drawCanvas();
    }, [results, point]);

    const submitPoint = async (e) => {
        e.preventDefault();
        submitPointData(point);
    };

    const logout = () => {
        const token = localStorage.getItem("token");
        localStorage.removeItem("token");
        fetch("/api/logout", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.status === 200) {
                    navigate("/");
                }
            })
            .catch((error) => console.error("Ошибка при выходе", error));
    };

    return (
        <div className="container">
            <header className="header">
                <h1>Джохадзе Анна Бекаевна</h1>
                <h2>Группа: P3210</h2>
                <h3>Вариант: 519371</h3>
                <button onClick={logout} className="logout-button">
                    Выйти
                </button>
            </header>
            <div className="content">
                <div className="form-container">
                    <h2>Проверка точки</h2>
                    <form onSubmit={submitPoint} className="form">
                        <div className="form-group">
                            <label htmlFor="x">Координата X:</label>
                            <select
                                id="x"
                                value={point.x || ""}
                                onChange={(e) => setPoint({ ...point, x: Number(e.target.value) })}
                                className="form-select"
                                required
                            >
                                {xOptions.map((value) => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="y">Координата Y (-5 до 5):</label>
                            <input
                                type="number"
                                id="y"
                                value={point.y}
                                onChange={(e) => setPoint({ ...point, y: e.target.value })}
                                className="form-input"
                                min="-5"
                                max="5"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="r">Радиус R:</label>
                            <select
                                id="r"
                                value={point.r || ""}
                                onChange={(e) => setPoint({ ...point, r: Number(e.target.value) })}
                                className="form-select"
                                required
                            >
                                {rOptions.map((value) => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="button">
                            Проверить
                        </button>
                    </form>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </div>
                <div className="canvas-container">
                    <canvas
                        ref={canvasRef}
                        width={canvasSize}
                        height={canvasSize}
                        onClick={handleCanvasClick}
                        className="canvas"
                    ></canvas>
                </div>
                <table className="results-table">
                    <thead>
                    <tr>
                        <th>X</th>
                        <th>Y</th>
                        <th>R</th>
                        <th>Попадание</th>
                    </tr>
                    </thead>
                    <tbody>
                    {results.map((result, index) => (
                        <tr key={index}>
                            <td>{result.x}</td>
                            <td>{result.y}</td>
                            <td>{result.r}</td>
                            <td>{result.hit ? "Да" : "Нет"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Main;
