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
}

export default new AuthService();
