import React from 'react';
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  isAuth: boolean;
  redirectTo: string;
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  isAuth,
  redirectTo,
  children,
}) => {
  return isAuth ? <>{children}</> : <Navigate to={redirectTo} />;
};

export default PrivateRoute;
