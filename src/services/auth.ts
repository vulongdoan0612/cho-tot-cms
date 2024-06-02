import { ILogin } from "@/interfaces/Authentication";
import { setAuthenticate } from "@/redux/reducers/auth";
import { axios } from "@/utils/axios";
import Cookies from "js-cookie";

export const requestLogin = async (data: ILogin) => {
  const config = {
    method: "POST",
    url: `/login-cms`,
    data: data,
  };

  return axios(config);
};
export const getProfileCMS = async (accessToken: string) => {
  const config = {
    method: "GET",
    url: `/get-profile-cms`,
    headers: {
      Authorization: accessToken,
    },
  };
  return axios(config);
};
export const logout = (dispatch: any) => {
  localStorage.removeItem("access_token_cms");
  Cookies.remove("access_token_cms", { path: "/" });
  dispatch(setAuthenticate({ isAuthenticated: false, account: {} }));
};
