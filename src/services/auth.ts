import api from "./api";

interface SignupProps {
  name: string;
  email: string;
  password: string;
  photo_url: string;
}

interface LoginProps {
  email: string;
  password: string;
}

const signup = async (data: SignupProps) => {
  const response = await api.post("/auth/sign-up", data);
  return response.data;
};

const login = async (data: LoginProps) => {
  const response = await api.post("/auth", data);
  const token = response.data.token;
  if (typeof window !== "undefined") {
    window.localStorage.setItem("authToken", token);
    if (response.data.user) {
      window.localStorage.setItem("authUser", JSON.stringify(response.data.user));
    }
  }
  return response.data;
};

const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  const token = window.localStorage.getItem("authToken");
  return !!token;
};

export { signup, login, isAuthenticated };
