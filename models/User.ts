import { Schema, model, models, Document } from "mongoose";
import { IUser, RefreshToken } from "@/types/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// custom Methods
export interface IUserDocument extends IUser, Document {
  comparePassword(password: string): Promise<boolean>;
  addRefreshToken(token: string): Promise<void>;
  removeRefreshToken(token: string): Promise<void>;
  hasRefreshToken(token: string): boolean;
  generateAccessToken(): string;
  generateRefreshToken(): Promise<string>;
}

const RefreshTokenSchema = new Schema<RefreshToken>(
  {
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: { type: String, required: true },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    refreshTokens: {
      type: [RefreshTokenSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre<IUserDocument>("save", async function () {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

// custom Methods
UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.addRefreshToken = async function (token: string) {
  this.refreshTokens.push({ token, createdAt: new Date() });
  await this.save();
};

UserSchema.methods.removeRefreshToken = async function (token: string) {
  const tokens = this.refreshTokens as unknown as RefreshToken[];
  this.refreshTokens = tokens.filter(
    (t: RefreshToken) => t.token !== token
  ) as any;
  await this.save();
};

//jwt.sign is synchronous(no need to be async function)
UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { id: this._id.toString() },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );
};

UserSchema.methods.generateRefreshToken = async function () {
  const refreshToken = jwt.sign(
    { id: this._id.toString(), role: this.role },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" }
  );
  await this.addRefreshToken(refreshToken);
  return refreshToken;
};

export default models.User || model<IUserDocument>("User", UserSchema);
