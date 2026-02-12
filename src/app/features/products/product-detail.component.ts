import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Product } from '../../core/models/product.model';
import { ProductsService } from '../../core/services/products.service';
import { ErrorComponent } from '../../shared/components/error.component';
import { LoadingComponent } from '../../shared/components/loading.component';

@Component({
  standalone: true,
  imports: [CommonModule, LoadingComponent, ErrorComponent],
  template: `
    <button (click)="back()">Back</button>
    <button *ngIf="product()" (click)="edit()">Edit</button>

    <app-loading *ngIf="loading()"></app-loading>
    <app-error *ngIf="error()" [message]="error()"></app-error>

    <div *ngIf="product()">
      <h2>{{ product()?.title }}</h2>
      <p>{{ product()?.description }}</p>
      <h3>\${{ product()?.price }}</h3>

      <img *ngFor="let img of product()?.images" [src]="img" width="120">
    </div>
  `
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private service = inject(ProductsService);
  private router = inject(Router);

  product = signal<Product | null>(null);
  loading = signal(false);
  error = signal('');

  constructor() {
    // Subscribe to paramMap observable
    this.route.paramMap
      .pipe(
        switchMap(params => {
          const idParam = params.get('id');
          console.log('idParam', idParam)
          const id = idParam ? Number(idParam) : null;
          console.log('id', id)

          if (!id) {
            this.error.set('Invalid product id');
            this.product.set(null);
            this.loading.set(false);
            throw new Error('Invalid product id');
          }

          this.loading.set(true);
          this.error.set('');
          this.product.set(null);

          return this.service.getProduct(id);
        })
      )
      .subscribe({
        next: (p) => {
          console.log('p', p)
          this.product.set(p);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err?.message || 'Product not found');
          this.loading.set(false);
        }
      });
  }

  edit() {
    const prod = this.product();
    if (prod) this.router.navigate(['/products', prod.id, 'edit']);
  }

  back() {
    this.router.navigate(['/']);
  }
}
