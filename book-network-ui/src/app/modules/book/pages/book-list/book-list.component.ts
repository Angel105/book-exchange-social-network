import {Component, OnInit} from '@angular/core';
import {BookService} from "../../../../services/services/book.service";
import {Router} from "@angular/router";
import {PageResponseBookResponse} from "../../../../services/models/page-response-book-response";
import {BookResponse} from "../../../../services/models/book-response";

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss'
})
export class BookListComponent implements OnInit {
  bookResponse: PageResponseBookResponse = {};
  page: number = 0;
  size: number = 5;
  message = '';
  level = 'success';

  constructor(
    private bookService: BookService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.findAllBooks();
  }

  private findAllBooks() {
    this.bookService.findAllBooks({
      page: this.page,
      size: this.size
    }).subscribe({
      next: (books) => {
        this.bookResponse = books;
        console.log('Book response:', this.bookResponse);
      }
    });
  }

  gotoFirstPage() {
    this.page = 0;
    this.findAllBooks();
  }

  gotoPreviousPage() {
    this.page--;
    this.findAllBooks();
  }

  gotoPage(page: number) {
    this.page = page;
    this.findAllBooks();
  }

  gotoNextPage() {
    this.page++;
    this.findAllBooks();
  }

  gotoLastPage() {
    this.page = this.bookResponse.totalPages as number - 1;
    this.findAllBooks();
  }

  get isLastPage(): boolean {
    return this.page == this.bookResponse.totalPages as number - 1;
  }

  borrowBook(book: BookResponse) {
    this.message = '';
    this.bookService.borrowBook({
      'book-id': book.id as number
    }).subscribe({
      next: () => {
        this.level = 'success';
        this.message = `Book "${book.title}" successfully added to your list`;
      },
      error: (err) => {
        console.log(err);
        this.level = 'error';
        this.message = `Cannot borrow the book: ${err.error.error}`;
      }
    });
  }
}
