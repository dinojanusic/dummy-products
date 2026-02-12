import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { ProductsService } from '../../core/services/products.service';
import { ErrorComponent } from '../../shared/components/error.component';
import { LoadingComponent } from '../../shared/components/loading.component';

@Component({
  standalone: true,
  imports: [CommonModule, LoadingComponent, ErrorComponent],
  template: `
    <h1>Products</h1>
    <button (click)="create()">Add Product</button>

    <app-loading *ngIf="loading()"></app-loading>
    <app-error *ngIf="error()" [message]="error()"></app-error>

    <div *ngFor="let p of products()" (click)="open(p.id)" class="item">
      <img [src]="p.thumbnail" width="50">
      <div>
        <h3>{{ p.title }}</h3>
        <p>\${{ p.price }}</p>
      </div>
    </div>

    <button (click)="prev()" [disabled]="skip() === 0">Prev</button>
    <button (click)="next()" [disabled]="products().length < limit">Next</button>
  `,
  styles: [`
    .item {
      cursor: pointer;
      display: flex;
      gap: 10px;
      align-items: center;
      padding: 8px;
      border-bottom: 1px solid #ccc;
    }
    .item:hover { background-color: #f9f9f9; }
  `]
})
export class ProductListComponent {
  private service = inject(ProductsService);
  private router = inject(Router);

  products = signal<Product[]>([]);
  loading = signal(false);
  error = signal('');
  limit = 10;
  skip = signal(0);

  constructor() {
    effect(() => {
      this.load(this.skip());
    });
  }

  load(skip: number) {
    this.loading.set(true);
    this.error.set('');

    this.service.getProducts(this.limit, skip).subscribe({
      next: res => {
        this.products.set(res.products);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load products');
        this.loading.set(false);
      }
    });
  }

  next() {
    this.skip.update(s => s + this.limit);
  }

  prev() {
    this.skip.update(s => Math.max(0, s - this.limit));
  }

  open(id: number) {
    this.router.navigate(['/products', id]);
  }

  create() {
    this.router.navigate(['/products/new']);
  }
}
