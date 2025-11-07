import {
  inject,
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  signal,
} from '@angular/core';
import { StoreService } from '../../services/store';
import { ConfirmationService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { StoreInterface, ProductInterface } from '../store.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { viewChild } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
  providers: [ConfirmationService],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
  ],
})
export class ProductsComponent implements OnInit {
  private storeService = inject(StoreService);
  private confirmationService = inject(ConfirmationService);
  form = viewChild('form', { read: NgForm });
  fileInput = viewChild('fileInput', { read: ElementRef });
  visibleError = false;
  errorMessage = '';
  products: ProductInterface[] = [];
  categories: StoreInterface[] = [];
  visibleConfirm = false;
  urlImage = '';
  visiblePhoto = false;
  photo = '';

  product = signal<ProductInterface>({
    idProduct: 0,
    productName: '',
    price: 0,
    photo: null,
    discontinued: false,
    categoryId: null,
    categoryName: '',
  });

  showCustomConfirm = false;
  customConfirmMessage = '';
  private productToDelete: ProductInterface | null = null;

  ngOnInit(): void {
    this.getCategories();
    this.getProducts();
  }

  getCategories() {
    this.storeService.getCategories().subscribe({
      next: (data: StoreInterface[]) => {
        this.visibleError = false;
        this.categories = data;
      },
      error: (err: any) => {
        this.controlError(err);
      },
    });
  }

  getProducts() {
    this.storeService.getProducts().subscribe({
      next: (data: ProductInterface[]) => {
        this.visibleError = false;
        this.products = data;
      },
      error: (err: any) => {
        this.controlError(err);
      },
    });
  }

  onChange(event: any) {
    const file = event.target.files;

    if (file && file.length > 0) {
      this.product().photo = file[0];
      this.product().photoName = file[0].name;
    }
  }

  onAceptar() {
    if (this.fileInput()) {
      this.fileInput()!.nativeElement.value = '';
    }
  }

  showImage(product: ProductInterface) {
    if (this.visiblePhoto && this.product().idProduct === product.idProduct) {
      this.visiblePhoto = false;
    } else {
      this.product.set(product);
      this.photo = product.photoUrl ? product.photoUrl : '';
      this.visiblePhoto = true;
    }
  }

  save() {
    if (this.product().idProduct === 0) {
      this.storeService.addProduct(this.product()).subscribe({
        next: (data: ProductInterface) => {
          this.visibleError = false;
          this.getProducts();
          this.form()?.resetForm();
          this.product.set({
            idProduct: 0,
            productName: '',
            price: 0,
            photo: null,
            discontinued: false,
            categoryId: null,
            categoryName: '',
          });
        },
        error: (err: any) => {
          this.controlError(err);
        },
      });
    } else {
      this.storeService.updateProduct(this.product()).subscribe({
        next: (data: ProductInterface) => {
          this.visibleError = false;
          this.getProducts();
          this.form()?.resetForm();
          this.product.set({
            idProduct: 0,
            productName: '',
            price: 0,
            photo: null,
            discontinued: false,
            categoryId: null,
            categoryName: '',
          });
        },
        error: (err: any) => {
          this.controlError(err);
        },
      });
    }
  }

  confirmDelete(product: ProductInterface) {
    this.customConfirmMessage = `Delete the product "${product.productName}"?`;
    this.productToDelete = product;
    this.showCustomConfirm = true;
  }

  onCustomConfirmAccept() {
    if (this.productToDelete) {
      this.deleteProduct(this.productToDelete.idProduct!);
      this.productToDelete = null;
    }
    this.showCustomConfirm = false;
  }

  deleteProduct(id: number) {
    this.storeService.deleteProduct(id).subscribe({
      next: (data: ProductInterface) => {
        this.visibleError = false;
        this.getProducts();
        this.showCustomConfirm = false;
      },
      error: (err: any) => {
        this.controlError(err);
      },
    });
  }

  edit(product: ProductInterface) {
    const categoryFounded = this.categories.find(
      (c) => c.categoryName === product.categoryName
    );
    this.product().idProduct = product.idProduct;
    this.product().productName = product.productName;
    this.product().price = product.price;
    this.product().photo = product.photo;
    this.product().discontinued = product.discontinued;
    this.product().categoryId = categoryFounded?.idCategory ?? null;
    this.product().categoryName = product.categoryName;
    this.product().photoName = product.photoUrl
      ? this.extractImageName(product.photoUrl)
      : '';
  }

  extractImageName(url: string): string {
    return url.split('/').pop() || '';
  }

  cancelEdition() {
    this.product().idProduct = 0;
    this.product().productName = '';
    this.product().price = 0;
    this.product().discontinued = false;
    this.product().categoryId = null;
    this.product().categoryName = '';
    this.product().photoName = '';
  }
  controlError(err: any) {
    this.visibleError = true;
    if (err.error && typeof err.error === 'object' && err.error.message) {
      this.errorMessage = err.error.message;
    } else if (typeof err.error === 'string') {
      // If `err.error` is a string, it is assumed to be the error message
      this.errorMessage = err.error;
    } else {
      // Handles the case where no useful error message is received
      this.errorMessage = 'An unexpected error has occurred';
    }
  }
}
