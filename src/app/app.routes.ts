import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/products/product-list.component')
        .then(m => m.ProductListComponent)
  },
  {
    path: 'products/new',
    loadComponent: () =>
      import('./features/products/product-form.component')
        .then(m => m.ProductFormComponent)
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./features/products/product-detail.component')
        .then(m => m.ProductDetailComponent)
  },
  {
    path: 'products/:id/edit',
    loadComponent: () =>
      import('./features/products/product-form.component')
        .then(m => m.ProductFormComponent)
  }
];
