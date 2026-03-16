"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("../../src/services/user.service"));
const user_1 = __importDefault(require("../../src/models/user"));
jest.mock("../../src/models/user");
describe("UserService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("debe obtener todos los usuarios", async () => {
        const mockUsers = [{ _id: "1", email: "test@test.com" }];
        user_1.default.find.mockResolvedValue(mockUsers);
        const result = await user_service_1.default.getUsers();
        expect(user_1.default.find).toHaveBeenCalled();
        expect(result).toEqual(mockUsers);
    });
    it("debe crear un usuario", async () => {
        const mockUser = { _id: "1", email: "new@test.com", password: "hashed" };
        user_1.default.create.mockResolvedValue(mockUser);
        const result = await user_service_1.default.addUser({ email: "new@test.com", password: "1234", name: "Mateo" });
        expect(user_1.default.create).toHaveBeenCalledWith({ email: "new@test.com", password: "1234", name: "Mateo" });
        expect(result).toEqual(mockUser);
    });
    it("debe encontrar usuario por id", async () => {
        const mockUser = { _id: "1", email: "id@test.com" };
        user_1.default.findById.mockResolvedValue(mockUser);
        const result = await user_service_1.default.findUserById("1");
        expect(user_1.default.findById).toHaveBeenCalledWith("1");
        expect(result).toEqual(mockUser);
    });
    it("debe encontrar usuario por email", async () => {
        const mockUser = { _id: "1", email: "find@test.com" };
        user_1.default.findOne.mockResolvedValue(mockUser);
        const result = await user_service_1.default.findUsersByEmail("find@test.com");
        expect(user_1.default.findOne).toHaveBeenCalledWith({ email: "find@test.com" });
        expect(result).toEqual(mockUser);
    });
    it("debe eliminar usuario", async () => {
        const mockUser = { _id: "1", email: "delete@test.com" };
        user_1.default.findOneAndDelete.mockResolvedValue(mockUser);
        const result = await user_service_1.default.removeUser("1");
        expect(user_1.default.findOneAndDelete).toHaveBeenCalledWith({ _id: "1" });
        expect(result).toEqual(mockUser);
    });
    it("debe actualizar usuario", async () => {
        const mockUser = { _id: "1", email: "update@test.com" };
        user_1.default.findOneAndUpdate.mockResolvedValue(mockUser);
        const result = await user_service_1.default.updateUser("1", { email: "update@test.com", name: "Mateo", password: "123" });
        expect(user_1.default.findOneAndUpdate).toHaveBeenCalledWith({ _id: "1" }, { email: "update@test.com", name: "Mateo", password: "123" }, { returnOriginal: false });
        expect(result).toEqual(mockUser);
    });
    it("debe devolver un token al hacer login", () => {
        const token = user_service_1.default.login("login@test.com");
        expect(typeof token).toBe("string");
    });
});
//# sourceMappingURL=user.service.test.js.map