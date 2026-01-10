export interface IRole {
  name: "ADMIN" | "WAREHOUSE_MANAGER" | "STAFF";
  permissions: string[]; // list of allowed permissions for this role
  description?: string; // optional human-readable description
  isSystem: boolean; // true if this is a built-in/system role
}