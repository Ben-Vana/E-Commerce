import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }: { children: JSX.Element }): JSX.Element => {
  const isAdmin = useSelector(
    (state: { authReducer: { userData: { admin: boolean } } }) =>
      state.authReducer.userData.admin
  );

  return isAdmin === true ? children : <Navigate to="/" replace />;
};

export default AuthGuard;
