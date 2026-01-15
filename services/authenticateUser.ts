
import api from "@/lib/api";
import { LoginFormData } from "@/schemas/loginSchema";
import { RegisterBackendData } from "@/schemas/registerUserSchema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";


interface SafeUser {
    _id: string;
    name: string;
    email: string;
    role: any;
    isActive: boolean;
    lastLogin?: Date;
}

interface LoginResponse {
    message: string;
    user: SafeUser;
    csrfToken: string;
}


//login user
const LoginUser = async (data: LoginFormData): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", data);
    return response.data;
};

export const useLogin = () => {
    return useMutation({
        mutationFn: LoginUser,
        onSuccess: (data) => {
            toast.success(data.message);
            if (typeof window !== "undefined") {
                window.localStorage.setItem("csrfToken", data.csrfToken);
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        },
    });
};

// Register user
const RegisterUser = async (data: RegisterBackendData): Promise<LoginResponse> => {
    const response = await api.post("/auth/register", data);
    return response.data;
};

export const useRegister = () => {
    return useMutation({
        mutationFn: RegisterUser,
        onSuccess: (data) => {
            toast.success(data.message);
            if (typeof window !== "undefined") {
                window.localStorage.setItem("csrfToken", data.csrfToken);
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        },
    });
};
