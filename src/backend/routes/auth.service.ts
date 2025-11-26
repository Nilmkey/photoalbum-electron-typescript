import authModel, { type IUser } from "./models/user.model.ts";

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
}

export default new AuthService();
