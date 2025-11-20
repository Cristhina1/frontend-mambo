
import { Component, signal } from '@angular/core';
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('frontend');
}
