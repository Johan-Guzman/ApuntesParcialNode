"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const book_service_1 = __importDefault(require("../../src/services/book.service"));
const book_1 = __importDefault(require("../../src/models/book"));
jest.mock("../../src/models/book");
describe("BookService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("debería obtener todos los libros", async () => {
        book_1.default.find.mockResolvedValue([{ title: "Libro 1" }]);
        const books = await book_service_1.default.getBooks();
        expect(books).toHaveLength(1);
        expect(books[0].title).toBe("Libro 1");
    });
    it("debería crear un libro", async () => {
        const input = { title: "Nuevo", author: "Autor", price: 100, isSold: false };
        book_1.default.create.mockResolvedValue(input);
        const newBook = await book_service_1.default.addBook(input);
        expect(newBook.title).toBe("Nuevo");
    });
    it("debería encontrar un libro por ID", async () => {
        book_1.default.findById.mockResolvedValue({ id: "1", title: "Libro 1" });
        const book = await book_service_1.default.findBookById("1");
        expect(book?.title).toBe("Libro 1");
    });
    it("debería devolver libros disponibles (findBooks llama a getAvailableBooks)", async () => {
        book_1.default.find.mockResolvedValue([{ title: "Disponible", isSold: false }]);
        const books = await book_service_1.default.findBooks();
        expect(books[0].isSold).toBe(false);
    });
    it("debería buscar libros por autor (insensible a mayúsculas)", async () => {
        book_1.default.find.mockResolvedValue([{ title: "Autor X", author: "Autor" }]);
        const books = await book_service_1.default.findBookByAuthor("autor");
        expect(books[0].author).toBe("Autor");
    });
    it("debería eliminar un libro y devolver true", async () => {
        book_1.default.findOneAndDelete.mockResolvedValue({ id: "1" });
        const result = await book_service_1.default.removeBook("1");
        expect(result).toBe(true);
    });
    it("debería devolver false si no encuentra libro para eliminar", async () => {
        book_1.default.findOneAndDelete.mockResolvedValue(null);
        const result = await book_service_1.default.removeBook("2");
        expect(result).toBe(false);
    });
    it("debería marcar un libro como vendido", async () => {
        const updatedBook = { title: "Libro vendido", isSold: true };
        book_1.default.findOneAndUpdate.mockResolvedValue(updatedBook);
        const result = await book_service_1.default.markBookAsSold("id123", "user123");
        expect(result?.isSold).toBe(true);
    });
    it("debería obtener libros disponibles", async () => {
        book_1.default.find.mockResolvedValue([{ title: "Disponible", isSold: false }]);
        const books = await book_service_1.default.getAvailableBooks();
        expect(books[0].isSold).toBe(false);
    });
    it("debería obtener libros vendidos", async () => {
        book_1.default.find.mockResolvedValue([{ title: "Vendido", isSold: true }]);
        const books = await book_service_1.default.getSoldBooks();
        expect(books[0].isSold).toBe(true);
    });
    it("debería actualizar un libro", async () => {
        const updatedBook = { title: "Actualizado", author: "Autor" };
        book_1.default.findOneAndUpdate.mockResolvedValue(updatedBook);
        const result = await book_service_1.default.updateBook("id123", { title: "Actualizado" });
        expect(result?.title).toBe("Actualizado");
    });
    describe("buyBook", () => {
        it("debería comprar un libro si está disponible", async () => {
            const book = { id: "id123", title: "Comprable", isSold: false };
            jest.spyOn(book_service_1.default, "findBookById").mockResolvedValue(book);
            jest.spyOn(book_service_1.default, "markBookAsSold").mockResolvedValue({ ...book, isSold: true });
            const result = await book_service_1.default.buyBook("user123", "id123");
            expect(result).toBe("El libro Comprable ha sido comprado por el usuario con ID user123.");
            expect(book_service_1.default.markBookAsSold).toHaveBeenCalledWith("id123", "user123");
        });
        it("debería devolver null si el libro no existe", async () => {
            jest.spyOn(book_service_1.default, "findBookById").mockResolvedValue(null);
            const result = await book_service_1.default.buyBook("user123", "id123");
            expect(result).toBeNull();
        });
        it("debería devolver null si el libro ya está vendido", async () => {
            const book = { id: "id123", title: "Ya vendido", isSold: true };
            jest.spyOn(book_service_1.default, "findBookById").mockResolvedValue(book);
            const result = await book_service_1.default.buyBook("user123", "id123");
            expect(result).toBeNull();
        });
    });
});
//# sourceMappingURL=book.service.test.js.map