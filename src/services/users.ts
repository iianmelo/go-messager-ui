import api from "./api";

const listUsers = async () => {
  const response = await api.get("/users/all");
  return response.data;
};

export { listUsers };
