import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./providers/UserProvider";
import { AxiosProvider } from "./providers/AxiosProvider";
import { ToastProvider } from "./providers/ToastProvider";
import { PrivateRoute } from "./components/PrivateRoute";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { MapPage } from "./pages/MapPage";

const AppRoutes = () => {
  const { auth } = useUser();

  return (
    <Routes>
      <Route
        path="/login"
        element={auth ? <Navigate to="/map" /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={auth ? <Navigate to="/map" /> : <RegisterPage />}
      />
      <Route
        path="/map"
        element={
          <PrivateRoute isAuth={Boolean(auth)} redirectTo="/login">
            <MapPage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to={auth ? "/map" : "/login"} />} />
    </Routes>
  );
};

export const App = () => {
  return (
    <BrowserRouter>
      <AxiosProvider>
        <ToastProvider>
          <UserProvider>
            <AppRoutes />
          </UserProvider>
        </ToastProvider>
      </AxiosProvider>
    </BrowserRouter>
  );
};

export default App;
