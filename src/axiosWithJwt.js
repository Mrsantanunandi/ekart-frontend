import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import store from "@/redux/store";
import { setUser } from "@/redux/userSlice";
import { clearCart } from "@/redux/productSlice";
import { persistor } from "@/redux/store";

const axiosWithJwt = axios.create({
  baseURL: import.meta.env.VITE_URL,
});

// ================= REQUEST INTERCEPTOR =================
axiosWithJwt.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);

      // ⛔ Token expired
      if (decoded.exp * 1000 < Date.now()) {
        toast.error("Session expired. Please login again");

        localStorage.removeItem("token");
        store.dispatch(setUser(null));
        store.dispatch(clearCart());
        persistor.purge();

        window.location.href = "/";
        return Promise.reject("Token expired");
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    // 🔥 VERY IMPORTANT FIX
    // ❌ DO NOT set Content-Type for FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
axiosWithJwt.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      toast.error("Session expired. Please login again");

      localStorage.removeItem("token");
      store.dispatch(setUser(null));
      store.dispatch(clearCart());
      persistor.purge();

      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosWithJwt;
