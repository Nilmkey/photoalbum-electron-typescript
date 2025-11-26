import { model, Schema, Document } from "mongoose";

export interface IAlbum extends Document {
  id: string;
  userId: string;
  title: string;
  description: string;
  photos: [string];
}

const albumSchema = new Schema<IAlbum>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, ref: "User" },
    title: { type: String, required: true },
    description: { type: String },
    photos: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export default model<IAlbum>("Album", albumSchema);
