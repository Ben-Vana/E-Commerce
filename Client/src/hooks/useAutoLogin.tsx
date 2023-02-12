import axios from "axios";
import jwt_decode from "jwt-decode";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";

const checkUser = (token: string | null): Promise<info> | info => {
  if (token) return axios.get("/users/userinfo");
  else return { data: {} };
};

interface token {
  admin: boolean;
}

interface info {
  data: { admin?: boolean };
}

const useAutoLogin = (): Function => {
  const dispatch = useDispatch();
  const handleAutoLogin = async (): Promise<boolean> => {
    try {
      let token: string | null = localStorage.getItem("token");
      let data: info = await checkUser(token);
      if (token) {
        let tokenData: token = jwt_decode(token);
        if (data.data && tokenData.admin === data.data.admin) {
          dispatch(authActions.login(tokenData));
          return true;
        } else return false;
      } else return false;
    } catch (error) {
      return false;
    }
  };
  return handleAutoLogin;
};

export default useAutoLogin;
