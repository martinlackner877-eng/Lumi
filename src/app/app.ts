import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { AuthComponent } from './features/auth/auth.component';

type NavItem = {
  label: string;
  route: string;
  icon: 'observatory' | 'study-tree' | 'atlas' | 'archive';
};

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AuthComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly authService = inject(AuthService);
  protected readonly sidebarCollapsed = signal(false);
  protected readonly currentUser = this.authService.user;
  protected readonly navItems: NavItem[] = [
    { label: 'Dashboard', route: '/', icon: 'observatory' },
    { label: 'Study Map', route: '/study-tree', icon: 'study-tree' },
    { label: 'Atlas', route: '/atlas', icon: 'atlas' },
    { label: 'Archive', route: '/archive', icon: 'archive' },
  ];

  protected toggleSidebar(): void {
    this.sidebarCollapsed.update((collapsed) => !collapsed);
  }

  protected logout(): void {
    this.authService.logout();
    this.sidebarCollapsed.set(false);
  }
}
