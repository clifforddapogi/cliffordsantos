import axios from "axios";

const BASE = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Auth uses httpOnly cookies (set by /api/auth/login response).
// We keep withCredentials so cookies flow with every request — no localStorage tokens.
const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
});

export default api;
