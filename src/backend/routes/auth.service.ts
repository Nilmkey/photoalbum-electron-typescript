import authModel, { type IUser } from "./models/user.model.ts";
import albumModel, { type IAlbum } from "./models/album.model.ts";

class AuthService {
  async registerUser(userData: IUser) {
    if (!userData) throw new Error("not received info for registration");
    try {
      const createdUser = authModel.create(userData);
      return createdUser;
    } catch (e) {
      throw new Error("db reg error: " + e);
    }
  }

  async loginUser_db(userData: IUser) {
    if (!userData) throw new Error("not received info for login");
    const authorizatedUser = authModel.findOne({ username: userData.username });
    return authorizatedUser;
  }

  async newAlbum(albumData: IAlbum) {
    if (!albumData) throw new Error("not received info for album");
    try {
      const createdAlbum = albumModel.create(albumData);
      return createdAlbum;
    } catch (e) {
      throw new Error("db create album error: " + e);
    }
  }

  async oneAlbum(albumId: string) {
    if (!albumId) throw new Error("not received id");
    try {
      const album = albumModel.findOne({ id: albumId });
      return album;
    } catch (e) {
      throw new Error("db get album error: " + e);
    }
  }

  async addPhoto(albumId: string, pathsArray: string[]) {
    if (!albumId) throw new Error("not received id");
    if (!pathsArray) throw new Error("not received photos");
    try {
      const album = await albumModel.findById(albumId);
      if (!album) throw new Error("album not found");
      album.photos.push(...pathsArray);
      await album.save();
      return pathsArray;
    } catch (e) {
      throw new Error("db add photos error: " + e);
    }
  }

  async getAllAlbum() {
    try {
      const album = await albumModel.find();
      if (!album) throw new Error("альбомов несуществует");
      return album;
    } catch (e) {
      throw new Error("db get all albums error:" + e);
    }
  }

  async removeAlbum(albumId: string) {
    try {
      if (!albumId) throw new Error("album not found");
      const delAlbum = await albumModel.deleteOne({ id: albumId });
      return delAlbum;
    } catch (e) {
      throw new Error("db remove album error:" + e);
    }
  }

  async getRoomAlbum(albumRoom: string) {
    try {
      if (!albumRoom) throw new Error("room not found");
      const roomAlbums = await albumModel.find({ room: albumRoom });
      if (!roomAlbums) throw new Error("albums with at room not exists");
      return roomAlbums;
    } catch (e) {
      throw new Error("db get room error: " + e);
    }
  }
}

export default new AuthService();
