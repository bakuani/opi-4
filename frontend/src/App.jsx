import Login from "./components/Login";
import Register from "./components/Register";
import Main from "./components/Main";
import {createBrowserRouter, RouterProvider} from "react-router-dom";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Login />,
        },
        {
            path: "/register",
            element: <Register />,
        },
        {
            path: "/main",
            element: <Main />,
        },
    ]);
  return (
      <div className="App">
        <RouterProvider router={router} />
      </div>
  );
}

export default App;
