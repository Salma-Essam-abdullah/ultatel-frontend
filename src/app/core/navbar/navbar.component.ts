// navbar.component.ts
import { Component, inject } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterLink } from '@angular/router';
import { NgbdOffcanvasContent } from '../navbarcanvas/navbarcanvas.component';
import { AccountService } from '../../Services/core/account.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  private offcanvasService = inject(NgbOffcanvas);
  UserName: string | undefined;

  constructor(public accountService: AccountService, private router: Router) {
    this.UserName = this.accountService.getClaims().Name;
  }
  open() {
    const offcanvasRef = this.offcanvasService.open(NgbdOffcanvasContent);
    offcanvasRef.componentInstance.name = 'World';
  }
  logout() {
    this.accountService.logout();
    this.router.navigate(['/login']);
  }
}
