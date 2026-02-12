import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product, ProductsResponse } from '../models/product.model';


@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);
  private baseUrl = 'https://dummyjson.com/products';

  private localProducts: Product[] = [];

  getProducts(limit = 10, skip = 0): Observable<ProductsResponse> {
    return this.http
      .get<ProductsResponse>(`${this.baseUrl}?limit=${limit}&skip=${skip}`)
      .pipe(
        map(res => {
          // remove API products that were updated locally
          const apiProducts = res.products.filter(
            p => !this.localProducts.some(lp => lp.id === p.id)
          );

          return {
            ...res,
            products: [...this.localProducts, ...apiProducts]
          };
        })
      );
  }

  getProduct(id: number): Observable<Product> {
    // check local first
    const local = this.localProducts.find(p => p.id === id);
    if (local) return new Observable(sub => sub.next(local));
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  addProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/add`, product).pipe(
      map(product => {
        // store locally
        this.localProducts.unshift(product);
        return product;
      })
    )
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product).pipe(
      map(updated => {
        const index = this.localProducts.findIndex(p => p.id === id);

        if (index !== -1) {
          this.localProducts[index] = updated;
        } else {
          // if product came from API, now override it
          this.localProducts.unshift(updated);
        }

        return updated;
      })
    )
  }
}
