import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header/>
    <router-outlet/>
  `,
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent {
  title = 'angular-hello-world';
}
