"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = __importDefault(require("../../src/controllers/user.controller"));
const user_service_1 = __importDefault(require("../../src/services/user.service"));
const bcrypt_1 = __importDefault(require("bcrypt"));
jest.mock("../../src/services/user.service");
jest.mock("bcrypt");
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};
describe("UserController", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("createUser", () => {
        it("debe crear un usuario nuevo", async () => {
            const req = {
                body: { email: "test@example.com", password: "123456" },
            };
            user_service_1.default.findUsersByEmail.mockResolvedValue(null);
            bcrypt_1.default.hash.mockResolvedValue("hashedPassword");
            user_service_1.default.addUser.mockResolvedValue({
                id: "1",
                email: "test@example.com",
            });
            const res = mockResponse();
            await user_controller_1.default.createUser(req, res);
            expect(user_service_1.default.findUsersByEmail).toHaveBeenCalledWith("test@example.com");
            expect(user_service_1.default.addUser).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ id: "1", email: "test@example.com" });
        });
        it("debe devolver 400 si el usuario ya existe", async () => {
            const req = {
                body: { email: "test@example.com", password: "123456" },
            };
            user_service_1.default.findUsersByEmail.mockResolvedValue({ id: "1" });
            const res = mockResponse();
            await user_controller_1.default.createUser(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "User already exists" });
        });
    });
    describe("getUsers", () => {
        it("debe devolver lista de usuarios", async () => {
            const req = {};
            const res = mockResponse();
            user_service_1.default.getUsers.mockResolvedValue([
                { id: "1", email: "test@example.com" },
            ]);
            await user_controller_1.default.getUsers(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([{ id: "1", email: "test@example.com" }]);
        });
    });
    describe("getOneUser", () => {
        it("debe devolver un usuario por id", async () => {
            const req = { params: { id: "1" } };
            const res = mockResponse();
            user_service_1.default.findUserById.mockResolvedValue({
                id: "1",
                email: "test@example.com",
            });
            await user_controller_1.default.getOneUser(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ id: "1", email: "test@example.com" });
        });
        it("debe devolver 404 si no encuentra el usuario", async () => {
            const req = { params: { id: "1" } };
            const res = mockResponse();
            user_service_1.default.findUserById.mockResolvedValue(null);
            await user_controller_1.default.getOneUser(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
        });
    });
    describe("deleteUser", () => {
        it("debe eliminar un usuario", async () => {
            const req = { params: { id: "1" } };
            const res = mockResponse();
            user_service_1.default.removeUser.mockResolvedValue(true);
            await user_controller_1.default.deleteUser(req, res);
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });
        it("debe devolver 404 si no encuentra el usuario", async () => {
            const req = { params: { id: "1" } };
            const res = mockResponse();
            user_service_1.default.removeUser.mockResolvedValue(false);
            await user_controller_1.default.deleteUser(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
        });
    });
    describe("updateUser", () => {
        it("debe actualizar un usuario", async () => {
            const req = {
                params: { id: "1" },
                body: { email: "new@test.com", password: "newpass" },
            };
            const res = mockResponse();
            user_service_1.default.findUserById.mockResolvedValue({ id: "1" });
            bcrypt_1.default.hash.mockResolvedValue("hashedPassword");
            user_service_1.default.updateUser.mockResolvedValue({
                id: "1",
                email: "new@test.com",
            });
            await user_controller_1.default.updateUser(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ id: "1", email: "new@test.com" });
        });
        it("debe devolver 404 si el usuario no existe", async () => {
            const req = { params: { id: "1" }, body: {} };
            const res = mockResponse();
            user_service_1.default.findUserById.mockResolvedValue(null);
            await user_controller_1.default.updateUser(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
        });
    });
    describe("login", () => {
        it("debe loguear un usuario con credenciales válidas", async () => {
            const req = {
                body: { email: "test@example.com", password: "123456" },
            };
            const res = mockResponse();
            user_service_1.default.findUsersByEmail.mockResolvedValue({
                email: "test@example.com",
                password: "hashedPassword",
            });
            bcrypt_1.default.compare.mockResolvedValue(true);
            user_service_1.default.login.mockResolvedValue({ token: "jwt-token" });
            await user_controller_1.default.login(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ token: "jwt-token" });
        });
        it("debe devolver 404 si el usuario no existe", async () => {
            const req = {
                body: { email: "test@example.com", password: "123456" },
            };
            const res = mockResponse();
            user_service_1.default.findUsersByEmail.mockResolvedValue(null);
            await user_controller_1.default.login(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
        });
        it("debe devolver 401 si la contraseña es incorrecta", async () => {
            const req = {
                body: { email: "test@example.com", password: "wrong" },
            };
            const res = mockResponse();
            user_service_1.default.findUsersByEmail.mockResolvedValue({
                email: "test@example.com",
                password: "hashedPassword",
            });
            bcrypt_1.default.compare.mockResolvedValue(false);
            await user_controller_1.default.login(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
        });
    });
});
//# sourceMappingURL=user.controller.test.js.map