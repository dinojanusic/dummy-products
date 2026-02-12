import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  template: `<p class="error">{{ message }}</p>`,
  styles: [`.error { color: red; }`]
})
export class ErrorComponent {
  @Input() message = 'Something went wrong';
}
