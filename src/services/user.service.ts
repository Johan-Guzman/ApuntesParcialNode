import UserModel, {UserInput, UserDocument} from "../models/user"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


/**
 *
 * Description: Service to handle operations related to users.
 * Provides methods to create, read, update, and delete users,
 * as well as to find users by ID or email, and to handle user login.
 *
 * Methods:
 * - getUsers: Retrieves all users.
 * - addUser: Adds a new user.
 * - findUserById: Finds a user by their ID.
 * - findUsersByEmail: Finds a user by their email address.
 * - removeUser: Removes a user by their ID.
 * - updateUser: Updates a user's information by their ID.
 * - login: Generates a JWT token for user login using their email.
 *
 * Error handling: Each method handles errors and throws exceptions with descriptive messages.
 */
class UserService {

  async getUsers(): Promise<UserDocument[]> {
    try {
      return await UserModel.find();
    } catch (error) {
      throw new Error("Error retrieving users");
    }
  }

  async addUser(input: UserInput): Promise<UserDocument> {
    try {
      return await UserModel.create(input);
    } catch (error) {
      throw new Error("Error creating user");
    }
  }

  async findUserById(id: string): Promise<UserDocument | null> {
    try {
      return await UserModel.findById(id);
    } catch (error) {
      throw new Error("Error finding user by ID");
    }
  }

  async findUsersByEmail(email: string): Promise<UserDocument | null> {
    try {
      return await UserModel.findOne({ email });
    } catch (error) {
      throw new Error("Error finding user by email");
    }
  }

  async removeUser(id: string): Promise<UserDocument | null> {
    try {
      return await UserModel.findOneAndDelete({ _id: id });
    } catch (error) {
      throw new Error("Error removing user");
    }
  }

  async updateUser(id: string, input: UserInput): Promise<UserDocument | null> {
    try {
      return await UserModel.findOneAndUpdate(
        { _id: id },
        input,
        { returnOriginal: false }
      );
    } catch (error) {
      throw new Error("Error updating user");
    }
  }

  login(email: string): string {
    const secret = process.env.JWT_SECRET || "secret";
    const token = jwt.sign({ email }, secret, { expiresIn: "1d" });
    return token;
  }
}

export default new UserService();