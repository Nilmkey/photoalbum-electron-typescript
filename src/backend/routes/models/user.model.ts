import { model, Schema, Document } from "mongoose";

export interface IUser extends Document {
  id: string;
  username: string;
  password: string;
  ownerAlbum?: [string];
  admin?: boolean;
}

const userSchema = new Schema<IUser>({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  ownerAlbum: [String],
  admin: Boolean,
});

export default model<IUser>("User", userSchema);
