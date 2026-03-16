"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const book_controller_1 = __importDefault(require("../../src/controllers/book.controller"));
const book_service_1 = __importDefault(require("../../src/services/book.service"));
jest.mock("../../src/services/book.service");
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};
describe("BookController", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("createBook", () => {
        it("should create a new book", async () => {
            const req = {
                body: { title: "Test Book", author: "Test Author" }
            };
            book_service_1.default.create.mockResolvedValue({ id: "1", title: "Test Book", author: "Test Author" });
            const res = mockResponse();
            await book_controller_1.default.createBook(req, res);
            expect(book_service_1.default.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ id: "1", title: "Test Book", author: "Test Author" });
        });
        it("should return 500 if an error occurs", async () => {
            const req = { body: {} };
            book_service_1.default.create.mockRejectedValue(new Error("Error"));
            const res = mockResponse();
            await book_controller_1.default.createBook(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Error creating book" });
        });
    });
    describe("getBooks", () => {
        it("should return a list of books", async () => {
            const req = {};
            const res = mockResponse();
            book_service_1.default.getBooks.mockResolvedValue([{ id: "1", title: "Test Book", author: "Test Author" }]);
            await book_controller_1.default.getBooks(req, res);
            expect(book_service_1.default.getBooks).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([{ id: "1", title: "Test Book", author: "Test Author" }]);
        });
        it("should return 500 if an error occurs", async () => {
            const req = {};
            const res = mockResponse();
            book_service_1.default.getBooks.mockRejectedValue(new Error("Error"));
            await book_controller_1.default.getBooks(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Error fetching books" });
        });
    });
    describe("getOneBook", () => {
        it("should return a book by id", async () => {
            const req = { params: { id: "1" } };
            const res = mockResponse();
            book_service_1.default.findBookById.mockResolvedValue({ id: "1", title: "Test Book", author: "Test Author" });
            await book_controller_1.default.getOneBook(req, res);
            expect(book_service_1.default.findBookById).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ id: "1", title: "Test Book", author: "Test Author" });
        });
        it("should return 404 if the book is not found", async () => {
            const req = { params: { id: "1" } };
            const res = mockResponse();
            book_service_1.default.findBookById.mockResolvedValue(null);
            await book_controller_1.default.getOneBook(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Book not found" });
        });
    });
    describe("deleteBook", () => {
        it("should delete a book", async () => {
            const req = { params: { id: "1" } };
            const res = mockResponse();
            book_service_1.default.removeBook.mockResolvedValue(true);
            await book_controller_1.default.deleteBook(req, res);
            expect(book_service_1.default.removeBook).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });
        it("should return 404 if the book is not found", async () => {
            const req = { params: { id: "1" } };
            const res = mockResponse();
            book_service_1.default.removeBook.mockResolvedValue(false);
            await book_controller_1.default.deleteBook(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Book not found" });
        });
    });
    describe("updateBook", () => {
        it("should update a book", async () => {
            const req = {
                params: { id: "1" },
                body: { title: "Updated Book", author: "Updated Author" }
            };
            const res = mockResponse();
            book_service_1.default.findBookById.mockResolvedValue({ id: "1" });
            book_service_1.default.updateBook.mockResolvedValue({ id: "1", title: "Updated Book", author: "Updated Author" });
            await book_controller_1.default.updateBook(req, res);
            expect(book_service_1.default.findBookById).toHaveBeenCalledWith("1");
            expect(book_service_1.default.updateBook).toHaveBeenCalledWith("1", req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ id: "1", title: "Updated Book", author: "Updated Author" });
        });
        it("should return 404 if the book is not found", async () => {
            const req = { params: { id: "1" }, body: {} };
            const res = mockResponse();
            book_service_1.default.findBookById.mockResolvedValue(null);
            await book_controller_1.default.updateBook(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Book not found" });
        });
    });
    describe("getBooksByAuthor", () => {
        it("should return books by a specific author", async () => {
            const req = { params: { id: "Test Author" } };
            const res = mockResponse();
            book_service_1.default.getBooksByAuthor.mockResolvedValue([
                { id: "1", title: "Book 1", author: "Test Author" },
                { id: "2", title: "Book 2", author: "Test Author" },
            ]);
            await book_controller_1.default.getBooksByAuthor(req, res);
            expect(book_service_1.default.getBooksByAuthor).toHaveBeenCalledWith("Test Author");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([
                { id: "1", title: "Book 1", author: "Test Author" },
                { id: "2", title: "Book 2", author: "Test Author" },
            ]);
        });
        it("should return 500 if an error occurs", async () => {
            const req = { params: { id: "Test Author" } };
            const res = mockResponse();
            book_service_1.default.getBooksByAuthor.mockRejectedValue(new Error("Error"));
            await book_controller_1.default.getBooksByAuthor(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Error fetching books by author" });
        });
    });
});
//# sourceMappingURL=book.controller.test.js.map