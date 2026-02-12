import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { ProductsService } from '../../core/services/products.service';
import { ErrorComponent } from '../../shared/components/error.component';
import { LoadingComponent } from '../../shared/components/loading.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, LoadingComponent, ErrorComponent, CommonModule],
  template: `
    <h2>{{ isEdit() ? 'Edit' : 'Create' }} Product</h2>

    <app-loading *ngIf="loading()"></app-loading>
    <app-error *ngIf="error()" [message]="error()"></app-error>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <div>
        <label>Title</label>
        <input formControlName="title">
        <small *ngIf="f.title.touched && f.title.invalid">
          Title is required
        </small>
      </div>

      <div>
        <label>Price</label>
        <input type="number" formControlName="price">
        <small *ngIf="f.price.touched && f.price.invalid">
          Must be positive
        </small>
      </div>

      <div>
        <label>Description</label>
        <textarea formControlName="description"></textarea>
      </div>

      <button [disabled]="form.invalid || loading()">Save</button>
    </form>
  `
})
export class ProductFormComponent {
  private fb = inject(FormBuilder);
  private service = inject(ProductsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(false);
  error = signal('');
  isEdit = signal(false);
  productId = signal<number | null>(null);

  form = this.fb.group({
    title: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(1)]],
    description: ['']
  });

  get f() {
    return this.form.controls;
  }

  constructor() {
    // load product if editing
    effect(() => {
      const idParam = this.route.snapshot.paramMap.get('id');
      const id = idParam ? Number(idParam) : null;

      if (id) {
        this.isEdit.set(true);
        this.productId.set(id);
        this.load(id);
      } else {
        this.isEdit.set(false);
        this.productId.set(null);
      }
    });
  }

  private load(id: number) {
    this.loading.set(true);
    this.error.set('');

    this.service.getProduct(id).subscribe({
      next: (p) => {
        this.form.patchValue(p);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load product');
        this.loading.set(false);
      }
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set('');

    const payload: Partial<Product> = {
      title: this.form.value.title ?? undefined,
      price: this.form.value.price ?? undefined,
      description: this.form.value.description ?? undefined
    };

    const request = this.isEdit()
      ? this.service.updateProduct(this.productId()!, payload)
      : this.service.addProduct(payload);

    request.subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {
        this.error.set('Save failed');
        this.loading.set(false);
      }
    });
  }
}
