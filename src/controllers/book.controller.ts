import { Request, Response } from "express";
import bookService from "../services/book.service";
import { BookDocument, BookInput } from "../models/book";

class BookController {

    public async createBook(req: Request, res: Response): Promise<void> {
        try {
            const book: BookDocument = await bookService.addBook(req.body as BookInput);
            res.status(201).json(book);
        } catch (error) {
            res.status(500).json({ message: "Error creating book" });
        }
    }
    
    public async getBooks(req: Request, res: Response): Promise<void> {
        try {
            const books = await bookService.getBooks();
            res.status(200).json(books);
        } catch (error) {
            res.status(500).json({ message: "Error fetching books" });
        }   
    }

    public async getOneBook(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id ?? "";
            const book = await bookService.findBookById(id);
            if (book) {
                res.status(200).json(book);
            } else {
                res.status(404).json({ message: "Book not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error fetching book" });
        }
    }

    public async deleteBook(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id ?? "";
            const success = await bookService.removeBook(id);
            if (success) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: "Book not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error deleting book" });
        }
    }

    public async updateBook(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id ?? "";
            const bookExists = await bookService.findBookById(id);
            if (!bookExists) {
                res.status(404).json({ message: "Book not found" });
                return;
            }
            const updatedBook = await bookService.updateBook(id, req.body);
            res.status(200).json(updatedBook);
        } catch (error) {
            res.status(500).json({ message: "Error updating book" });
        }
    }

    public async getBooksByAuthor(req: Request, res: Response): Promise<void> {
        try {
            const author = req.params.id ?? "";
            const books = await bookService.findBookByAuthor(author);
            res.status(200).json(books);
        } catch (error) {
            res.status(500).json({ message: "Error fetching books by author" });
        }
    }

    public async buyBook(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId ?? "";
            const bookId = req.params.bookId ?? "";
            const message = await bookService.buyBook(userId, bookId);
            if (message) {
                res.status(200).json({ message });
            } else {
                res.status(404).json({ message: "Book not found or already sold" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error buying book" });
        }
    }
    
}

export default new BookController();