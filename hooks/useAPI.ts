import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "./useToast"

/**
 * Generic hook for fetching data
 */
export function useFetch<T>(
  key: string | (string | object)[],
  url: string,
  options?: {
    enabled?: boolean
    refetchInterval?: number
  }
) {
  return useQuery<T>({
    queryKey: typeof key === "string" ? [key] : key,
    queryFn: async () => {
      const res = await fetch(url)
      if (!res.ok) throw new Error("Failed to fetch")
      return res.json()
    },
    enabled: options?.enabled ?? true,
    refetchInterval: options?.refetchInterval,
  })
}

/**
 * Generic hook for POST/PUT/DELETE mutations
 */
export function useMutate<T = void, E = Error>(
  mutationFn: (data: any) => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void
    onError?: (error: E) => void
  }
) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation<T, E, any>({
    mutationFn,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Operation completed successfully",
      })
      options?.onSuccess?.(data)
      queryClient.invalidateQueries()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
      options?.onError?.(error)
    },
  })
}

/**
 * Hook for user login
 */
export function useLogin() {
  return useMutate(
    async (credentials: { email: string; password: string }) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })
      if (!res.ok) throw new Error("Login failed")
      return res.json()
    }
  )
}

/**
 * Hook for user registration
 */
export function useRegister() {
  return useMutate(
    async (data: { email: string; password: string; name: string }) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Registration failed")
      return res.json()
    }
  )
}
