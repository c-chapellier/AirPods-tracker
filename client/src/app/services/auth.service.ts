import { Injectable, signal } from '@angular/core';

export interface User {
  username: string;
  password: string;
  isAdmin: boolean;
}

const USERS: User[] = [
  { username: 'admin', password: 'admin123', isAdmin: true },
  { username: 'user', password: 'user123', isAdmin: false }
];

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);

  login(username: string, password: string): boolean {
    const user = USERS.find(u => u.username === username && u.password === password);
    if (user) {
      this.currentUser.set(user);
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser.set(null);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  isAdmin(): boolean {
    return this.currentUser()?.isAdmin ?? false;
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }
}
