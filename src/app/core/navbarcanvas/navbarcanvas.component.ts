// ngbd-offcanvas-content.component.ts
import { Component, Input, inject } from '@angular/core';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ngbd-navbarcanvas',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">Menu</h5>
      <button
        type="button"
        class="btn-close text-reset"
        aria-label="Close"
        (click)="activeOffcanvas.dismiss('Cross click')"
      ></button>
    </div>
    <div class="offcanvas-body">
      <ul class="nav flex-column">
        <li class="nav-item">
          <a
            routerLink="/students"
            class="nav-link text-black"
            (click)="activeOffcanvas.close('Students')"
            >Students</a
          >
        </li>
        <li class="nav-item">
          <a
            routerLink="/login"
            class="nav-link text-black"
            (click)="activeOffcanvas.close('Login')"
            >Login</a
          >
        </li>
        <li class="nav-item">
          <a
            routerLink="/register"
            class="nav-link text-black"
            (click)="activeOffcanvas.close('Register')"
            >Register</a
          >
        </li>
      </ul>
    </div>
  `,
  styles: [
    `
      :host {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
    `,
  ],
})
export class NgbdOffcanvasContent {
  activeOffcanvas = inject(NgbActiveOffcanvas);
  @Input() name: string | undefined;
}
