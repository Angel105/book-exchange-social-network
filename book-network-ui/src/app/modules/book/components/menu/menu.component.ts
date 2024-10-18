import {Component, OnInit} from '@angular/core';
import {TokenService} from "../../../../services/token/token.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {

  username = '<USER>';

  constructor(
    private tokenService: TokenService
  ) {
  }

  ngOnInit(): void {
    const linkColor = document.querySelectorAll('.nav-link');
    linkColor.forEach(link => {
      if (window.location.href.endsWith(link.getAttribute('href') || '')) {
        link.classList.add('active');
      }
      link.addEventListener('click', () => {
        linkColor.forEach(link => link.classList.remove('active'));
        link.classList.add('active');
      });
    });
    this.username = this.tokenService.getUsernameFromToken() as string;
  }

  logout() {
    localStorage.removeItem('token');
    window.location.reload();
  }
}
