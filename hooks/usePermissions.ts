import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export type UserRole = "admin" | "manager" | "user" | "viewer"

export interface Permission {
  id: string
  name: string
  description: string
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  permissions: Permission[]
}

/**
 * Hook to fetch current user and check permissions
 */
export function usePermissions() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data } = await axios.get("/api/auth/me")
      return data
    },
    retry: false,
  })

  /**
   * Check if user has a specific permission
   */
  const hasPermission = (permissionName: string): boolean => {
    if (!user) return false
    return user.permissions.some((p) => p.name === permissionName)
  }

  /**
   * Check if user has a specific role
   */
  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false
    const roles = Array.isArray(role) ? role : [role]
    return roles.includes(user.role)
  }

  /**
   * Check if user has any of the given permissions
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user) return false
    return permissions.some((p) => hasPermission(p))
  }

  /**
   * Check if user has all of the given permissions
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user) return false
    return permissions.every((p) => hasPermission(p))
  }

  /**
   * Check if user is admin
   */
  const isAdmin = (): boolean => {
    return hasRole("admin")
  }

  /**
   * Check if user is manager
   */
  const isManager = (): boolean => {
    return hasRole(["admin", "manager"])
  }

  return {
    user,
    isLoading,
    error,
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    isManager,
  }
}

/**
 * Hook to check if user can perform a specific action
 */
export function useCanAccess(requiredPermissions: string | string[]) {
  const { hasAllPermissions, user, isLoading } = usePermissions()

  const permissions = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [requiredPermissions]

  const canAccess = user ? hasAllPermissions(permissions) : false

  return { canAccess, isLoading, isAuthorized: canAccess && !isLoading }
}

/**
 * Hook to require admin access
 */
export function useRequireAdmin() {
  const { isAdmin, user, isLoading } = usePermissions()

  return {
    isAdminUser: user ? isAdmin() : false,
    isLoading,
    isAuthorized: user && isAdmin(),
  }
}

/**
 * Hook to require manager or admin access
 */
export function useRequireManager() {
  const { isManager, user, isLoading } = usePermissions()

  return {
    isManagerUser: user ? isManager() : false,
    isLoading,
    isAuthorized: user && isManager(),
  }
}
