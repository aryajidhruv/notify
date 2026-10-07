import axios from "axios";

//It holds the accesstoken to the RAM memory
//  it provide the access token
let accessToken = null;
export const setAccessToken = (token) => {
  accessToken = token;
};
export const getAccessToken = () => accessToken;



// --- The shared axios instance ---
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // "/api/v1" from .env
  withCredentials: true, // lets the browser send the refresh-token cookie
});

// --- Request interceptor: runs before every request ---

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }// add bearer token to header so we dont have to send token every time
  return config;
});

// --- Response interceptor: runs after every response ---
// If several requests fail at once, they all wait for one shared refresh call

let refreshPromise = null;

api.interceptors.response.use(
  (res) => res, // success: pass it through untouched
  async (error) => {
    const original = error.config; // the request that failed
    const isAuthCall = original?.url?.includes("/auth/"); // don't retry signin/refresh themselves

    // 401 = token expired. Retry only once (_retry flag stops infinite loops)
    if (error.response?.status === 401 && !original._retry && !isAuthCall) {
      original._retry = true;
      try {
        // Start a refresh, or reuse the one already running
        refreshPromise =
          refreshPromise ||
          axios
            .post(`${import.meta.env.VITE_API_URL}/auth/refresh`, null, {
              withCredentials: true,
            })
            .finally(() => {
              refreshPromise = null;
            });

        const { data } = await refreshPromise;
        setAccessToken(data.access_token); // save the new token
        original.headers.Authorization = `Bearer ${data.access_token}`;
        return api(original); // repeat the original request
      } catch (refreshError) {
        // Refresh failed: clear the token and tell the app to log out
        setAccessToken(null);
        window.dispatchEvent(new Event("auth:logout"));
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error); // any other error: pass it on
  }
);

export default api;