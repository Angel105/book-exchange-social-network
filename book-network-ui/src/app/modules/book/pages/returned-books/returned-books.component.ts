import {Component, OnInit} from '@angular/core';
import {PageResponseBorrowedBookResponse} from "../../../../services/models/page-response-borrowed-book-response";
import {BookService} from "../../../../services/services/book.service";
import {BorrowedBookResponse} from "../../../../services/models/borrowed-book-response";

@Component({
  selector: 'app-returned-books',
  templateUrl: './returned-books.component.html',
  styleUrl: './returned-books.component.scss'
})
export class ReturnedBooksComponent implements OnInit {

  returnedBooks: PageResponseBorrowedBookResponse = {};
  page = 0;
  size = 5;
  message = '';
  level = 'success';

  constructor(
    private bookService: BookService,
  ) {
  }

  ngOnInit(): void {
    this.findAllReturnedBooks();
  }

  private findAllReturnedBooks() {
    this.bookService.findAllReturnedBooks({
      page: this.page,
      size: this.size
    }).subscribe({
      next: (resp) => {
        this.returnedBooks = resp;
      }
    });
  }

  gotoFirstPage() {
    this.page = 0;
    this.findAllReturnedBooks();
  }

  gotoPreviousPage() {
    this.page--;
    this.findAllReturnedBooks();
  }

  gotoPage(page: number) {
    this.page = page;
    this.findAllReturnedBooks();
  }

  gotoNextPage() {
    this.page++;
    this.findAllReturnedBooks();
  }

  gotoLastPage() {
    this.page = this.returnedBooks.totalPages as number - 1;
    this.findAllReturnedBooks();
  }

  get isLastPage(): boolean {
    return this.page == this.returnedBooks.totalPages as number - 1;
  }

  approveBookReturn(book: BorrowedBookResponse) {
    if (!book.returned) {
      this.level = 'error';
      this.message = 'The book is not yet returned.';
      return;
    }
    this.bookService.approveReturnBorrowedBook({
      'book-id': book.id as number
    }).subscribe({
      next: () => {
        this.level = 'success';
        this.message = 'Book return approved successfully!';
        this.findAllReturnedBooks();
      }
    });
  }
}
