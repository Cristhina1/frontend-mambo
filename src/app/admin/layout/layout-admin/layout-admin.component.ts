
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterModule, AdminNavbarComponent],
  templateUrl: './layout-admin.html',
  styleUrl: './layout-admin.scss',
})
export class AdminLayoutComponent {

}
