import api from "./api";

interface UserProps {
  name: string;
  photo: string;
}

export interface UserProfile {
  avatar: string;
  name: string;
  email?: string;
}

const getUserInfo = async (): Promise<UserProfile> => {
  const response = await api.get("/users");
  const { avatar, name, email } = response.data;
  return { avatar: avatar || "", name, email };
};

const editUserInfo = async (data: UserProps) => {
  const response = await api.patch("/users", data);
  return response.data;
};

export { getUserInfo, editUserInfo };
