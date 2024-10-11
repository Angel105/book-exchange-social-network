import {Component, OnInit} from '@angular/core';
import {BookRequest} from "../../../../services/models/book-request";
import {BookService} from "../../../../services/services/book.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-book-management',
    templateUrl: './book-management.component.html',
    styleUrl: './book-management.component.scss'
})
export class BookManagementComponent implements OnInit {

    errorMessages: Array<string> = [];
    selectedBookCover: any;
    selectedPicture: string | undefined;
    bookRequest: BookRequest = {authorName: "", isbn: "", synopsis: "", title: ""};


    constructor(
        private bookService: BookService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
        const bookId = this.activatedRoute.snapshot.params['bookId'];
        if (bookId) {
            this.bookService.findBookById({
                'book-id': bookId
            }).subscribe({
                next: (book) => {
                    this.bookRequest = {
                        id: book.id,
                        title: book.title as string,
                        authorName: book.authorName as string,
                        isbn: book.isbn as string,
                        synopsis: book.synopsis as string,
                        sharable: book.shareable
                    }
                    if (book.cover) {
                        this.selectedPicture = 'data:image/jpeg;base64,' + book.cover;
                    }
                }
            })
        }
    }

    onFileSelected(event: any) {
        this.selectedBookCover = event.target.files[0];
        console.log(this.selectedBookCover);
        if (this.selectedBookCover) {
            const reader = new FileReader();
            reader.onload = () => {
                this.selectedPicture = reader.result as string;
            }
            reader.readAsDataURL(this.selectedBookCover);
        }
    }

    saveBook() {
        this.bookService.saveBook({
            body: this.bookRequest,
        }).subscribe({
            next: (bookId) => {
                this.bookService.uploadBookCoverPicture({
                    'book-id': bookId,
                    body: {
                        file: this.selectedBookCover
                    }
                }).subscribe({
                    next: () => {
                        this.router.navigate(['/books/my-books']);
                    }
                })
            },
            error: (err) => {
                this.errorMessages = err.error.validationErrors;
            }
        });
    }
}
