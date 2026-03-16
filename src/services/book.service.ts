import BookModel,{BookInput, BookDocument} from "../models/book";
import UserModel, {UserDocument} from '../models/user'

/**
   * 
   * Description: Service to handle operations related to books.
   * Provides methods to create, read, update, and delete books,
   * as well as to search for books by author, mark books as sold, and search only for available books.
   * 
   * Methods:
   * - getBooks: Retrieves all books.
   * - addBook: Adds a new book.
   * - findBookById: Finds a book by its ID.
   * - findBooks: Finds all available books (not sold).
   * - findBookByAuthor: Finds books by author (case-insensitive).
   * - removeBook: Deletes a book by its ID.
   * - markBookAsSold: Marks a book as sold and assigns a buyer.
   * - getAvailableBooks: Retrieves all available books (not sold).
   * - getSoldBooks: Retrieves all sold books.
   * - updateBook: Updates a book by its ID.
   * - buyBook: Allows a user to buy a book if it is available.
   * 
   * Error handling: Each method handles errors and throws exceptions with descriptive messages.
*/

class BookService {

  async getBooks(): Promise<BookDocument[]> {
    try {
      return await BookModel.find();
    } catch (error) {
      throw new Error("Error retrieving books");
    }
  }

  async addBook(input: BookInput): Promise<BookDocument> {
    try {
      return await BookModel.create(input);
    } catch (error) {
      throw new Error("Error creating book");
    }
  }

  async findBookById(id: string): Promise<BookDocument | null> {
    try {
      return await BookModel.findById(id);
    } catch (error) {
      throw new Error("Error finding book by ID");
    }
  }

  async findBooks(): Promise<BookDocument[]> {
    return this.getAvailableBooks();
  }

  async findBookByAuthor(author: string): Promise<BookDocument[]> {
    try {
      return await BookModel.find({ author: { $regex: new RegExp(author, "i") } });
    } catch (error) {
      throw new Error("Error finding books by author");
    }
  }

  async removeBook(id: string): Promise<boolean> {
    try {
      const result = await BookModel.findOneAndDelete({ _id: id });
      return result !== null;
    } catch (error) {
      throw new Error("Error removing book");
    }
  }

  async markBookAsSold(bookId: string, userId: string): Promise<BookDocument | null> {
    try {
      return await BookModel.findOneAndUpdate(
        { _id: bookId },
        { isSold: true, buyerId: userId },
        { new: true }
      );
    } catch (error) {
      throw new Error("Error marking book as sold");
    }
  }

  async getAvailableBooks(): Promise<BookDocument[]> {
    try {
      return await BookModel.find({ isSold: false });
    } catch (error) {
      throw new Error("Error retrieving available books");
    }
  }

  async getSoldBooks(): Promise<BookDocument[]> {
    try {
      return await BookModel.find({ isSold: true });
    } catch (error) {
      throw new Error("Error retrieving sold books");
    }
  }

  async updateBook(id: string, input: Partial<BookInput>): Promise<BookDocument | null> {
    try {
      return await BookModel.findOneAndUpdate(
        { _id: id },
        input,
        { new: true }
      );
    } catch (error) {
      throw new Error("Error updating book");
    }
  }

  async buyBook(userId: string, bookId: string): Promise<string | null> {
    try {
      const book = await this.findBookById(bookId);
      if (!book || book.isSold) {
        return null;
      }
      await this.markBookAsSold(bookId, userId);
      return `El libro ${book.title} ha sido comprado por el usuario con ID ${userId}.`;
    } catch (error) {
      throw new Error("Error buying book");
    }
  }
}

export default new BookService();