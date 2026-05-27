
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./app.route.jsx";
import { useAuth } from "../features/auth/hooks/useAuth.js";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function App() {

  const { handleGetMe } = useAuth();

  const user = useSelector((state) => state.auth.user);

  console.log(user);

  useEffect(() => {

    handleGetMe();

  }, []);

  return <RouterProvider router={routes} />;
}

export default App;