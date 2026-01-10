import { IRole } from "@/types/roles";
import { Schema, model, models, Document } from "mongoose";

export interface IRoleDocument extends IRole, Document { }

const RoleSchema = new Schema<IRoleDocument>(
  {
    name: {
      type: String,
      enum: ["ADMIN", "WAREHOUSE_MANAGER", "STAFF"],
      unique: true,
      required: true,
    },
    permissions: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    isSystem: {
      type: Boolean,
      default: true, // system roles are true by default
    },
  },
  { timestamps: true }
);

export default models.Role || model<IRoleDocument>("Role", RoleSchema);
