import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/Environmet';
import { AuthGuardService } from '../guards/auth-guard';
import { StoreInterface, ProductInterface } from './store.interface';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  urlAPI = environment.urlAPI;
  constructor(private http: HttpClient, private authGuard: AuthGuardService) {}

  getCategories(): Observable<StoreInterface[]> {
    const headers = this.getHeaders();
    return this.http.get<StoreInterface[]>(`${this.urlAPI}categories`, {
      headers,
    });
  }

  addCategory(category: StoreInterface): Observable<StoreInterface> {
    const headers = this.getHeaders();
    return this.http.post<StoreInterface>(
      `${this.urlAPI}categories`,
      category,
      {
        headers,
      }
    );
  }

  updateCategory(category: StoreInterface): Observable<StoreInterface> {
    const headers = this.getHeaders();
    return this.http.put<StoreInterface>(
      `${this.urlAPI}categories/${category.idCategory}`,
      category,
      {
        headers,
      }
    );
  }

  deleteCategory(id: number): Observable<StoreInterface> {
    const headers = this.getHeaders();
    return this.http.delete<StoreInterface>(`${this.urlAPI}categories/${id}`, {
      headers,
    });
  }

  getHeaders(): HttpHeaders {
    const token = this.authGuard.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return headers;
  }

  getProducts(): Observable<ProductInterface[]> {
    const headers = this.getHeaders();
    return this.http.get<ProductInterface[]>(`${this.urlAPI}Products`, {
      headers,
    });
  }

  addProduct(product: ProductInterface): Observable<ProductInterface> {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('productName', product.productName);
    formData.append('price', product.price.toString());
    formData.append('categoryId', product.categoryId?.toString() || '');
    formData.append('discontinued', product.discontinued ? 'true' : 'false');
    if (product.photo) {
      formData.append('photo', product.photo);
    }
    return this.http.post<ProductInterface>(
      `${this.urlAPI}Products`,
      formData,
      {
        headers,
      }
    );
  }

  updateProduct(product: ProductInterface): Observable<ProductInterface> {
    const formData = new FormData();
    formData.append('idProduct', product.idProduct.toString());
    formData.append('productName', product.productName);
    formData.append('price', product.price.toString());
    formData.append('categoryId', product.categoryId?.toString() || '');
    formData.append('discontinued', product.discontinued ? 'true' : 'false');
    if (product.photo) {
      formData.append('photo', product.photo);
    }
    return this.http.put<ProductInterface>(
      `${this.urlAPI}products/${product.idProduct}`,
      formData,
      { headers: this.getHeaders() }
    );
  }

  deleteProduct(id: number): Observable<ProductInterface> {
    const headers = this.getHeaders();
    return this.http.delete<ProductInterface>(`${this.urlAPI}Products/${id}`, {
      headers,
    });
  }
}
