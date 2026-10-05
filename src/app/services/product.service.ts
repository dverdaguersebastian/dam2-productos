import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product, ProductsResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'https://dummyjson.com/products';

  // ===== PAGINACIÓN =====
  // Traduce la página actual (gestionada en ProductosPage) a los parámetros
  // de query "limit" y "skip" que espera la API de dummyjson, p. ej.
  // ?limit=10&skip=20 devuelve los productos 21-30.
  getProducts(limit: number, skip: number): Observable<ProductsResponse> {
    const params = new HttpParams().set('limit', limit).set('skip', skip);
    return this.http.get<ProductsResponse>(this.apiUrl, { params });
  }
  // ===== FIN PAGINACIÓN =====

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
}
