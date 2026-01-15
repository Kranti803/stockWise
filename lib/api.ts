import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false,

});

//added the csrf token to the request headers
api.interceptors.request.use(
    (config) => {
        const csrfToken = window.localStorage.getItem("csrfToken");
        if (csrfToken) {
            config.headers["X-CSRF-Token"] = csrfToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//automatic refresh the access token
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && error.response?.data?.message === "Token expired" && !originalRequest._retry) {
            if (isRefreshing) {
                //queue request while refreshing
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    return api(originalRequest);
                })
            }
            originalRequest._retry = true;
            isRefreshing = true;
            try {
                const token = await api.post("/auth/refresh_access_token");
                processQueue(null, token.data.accessToken);
                return api(originalRequest);
            } catch (error) {
                processQueue(error, null);
            } finally {
                isRefreshing = false;
            }

        }
        console.log("Error from interceptors", error);
        return Promise.reject(error);
    }
);


export default api;
