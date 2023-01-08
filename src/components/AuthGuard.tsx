import { useSelector } from "react-redux";
import { Redirect, Route, RouterProps } from "react-router-dom";

interface propInterface {
  path: string;
  component: any;
}

const AuthGuard = ({
  path,
  component: Component,
  ...rest
}: propInterface): JSX.Element => {
  const isAdmin = useSelector(
    (state: { authReducer: { userData: { admin: boolean } } }) =>
      state.authReducer.userData.admin
  );

  return (
    <Route
      {...rest}
      render={(props) =>
        isAdmin ? <Component path={path} {...props} /> : <Redirect to={"/"} />
      }
    ></Route>
  );
};

export default AuthGuard;
