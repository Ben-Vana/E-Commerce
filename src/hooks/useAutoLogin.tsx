import axios from "axios";
import jwt_decode from "jwt-decode";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";

const checkUser = (token: string | null): Promise<info> | info => {
  if (token) return axios.get("/users/userinfo");
  else return { data: "" };
};

interface info {
  data: object | string;
}

const useAutoLogin = (): Function => {
  const dispatch = useDispatch();
  const handleAutoLogin = async (): Promise<boolean> => {
    try {
      let token: string | null = localStorage.getItem("token");
      let data: info = await checkUser(token);
      if (data.data && token) {
        let tokenData = jwt_decode(token);
        dispatch(authActions.login(tokenData));
        return true;
      } else return false;
    } catch (error) {
      return false;
    }
  };
  return handleAutoLogin;
};

export default useAutoLogin;
