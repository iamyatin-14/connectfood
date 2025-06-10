import axios from "axios";

export const loginWithGoogle = ({ idToken, role }) => {
  return axios.post("http://localhost:8080/api/auth/google", {
    idToken,
    role,
  });
};

export const logout = () => {
  localStorage.removeItem("jwt");
  localStorage.removeItem("role");
};
