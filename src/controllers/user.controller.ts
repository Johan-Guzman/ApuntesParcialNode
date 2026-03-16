import { Request, Response } from "express";
import userService from "../services/user.service";
import { UserDocument, UserInput } from "../models/user";
import bcrypt from "bcrypt";
import { TokenExpiredError } from "jsonwebtoken";

export class UserController {
    
    public async createUser(req: Request, res: Response) {
        try {
            // CORRECCIÓN: primero verificar si el usuario existe, luego hashear
            const userExists: UserDocument | null = await userService.findUsersByEmail(req.body.email);

            if(userExists){
                return res.status(400).json({message: "User already exists"});
            }

            req.body.password = await bcrypt.hash(req.body.password, 10);

            const user: UserDocument = await userService.addUser(req.body as UserInput);
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ message: "Error creating user" });
        }
    }
    public async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await userService.getUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: "Error fetching users" });
        }
    }

    public async getOneUser(req: Request, res: Response): Promise<void> {
        try {
            const user: UserDocument | null = await userService.findUserById(req.params.id ?? "");
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error fetching user" });
        }
    }

    public async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id ?? "";
            const success = await userService.removeUser(id);
            if (success) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error deleting user" });
        }
    }

    public async updateUser(req: Request, res: Response) {
        try {
            const userExists: UserDocument | null = await userService.findUserById(req.params.id || "");

            if(!userExists){
                return res.status(404).json({message: "User not found"});
            }

            if(req.body.password)
                req.body.password = await bcrypt.hash(req.body.password, 10);

            const updateUser = await userService.updateUser(req.params.id || "", req.body)
            return res.status(200).json(updateUser);

        } catch (error) {
            res.status(500).json({ message: "Error updating user" });
        }
    }

    public async login(req: Request, res: Response) {
        try {
            const userExist = await userService.findUsersByEmail(req.body.email);
            if(!userExist) {
                return res.status(404).json({ message: "User not found" });
            }
            const isMatch = await bcrypt.compare(req.body.password, userExist?.password || "");
            if(!isMatch) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            return res.status(200).json(await userService.login(userExist.email));
        } catch (error) {
            res.status(500).json({ message: "Error logging in" });
        }
    
    }
        
}

export default new UserController();