import { inject, Component, OnInit, viewChild, signal } from '@angular/core';
import { StoreService } from '../../services/store';
import { NgForm } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { StoreInterface } from '../store.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.html',
  styleUrls: ['./categories.css'],
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
export class CategoriesComponent implements OnInit {
  private storeService = inject(StoreService);
  private confirmationService = inject(ConfirmationService);
  form = viewChild('form', { read: NgForm });
  visibleError = false;
  errorMessage = '';
  categories: StoreInterface[] = [];
  visibleConfirm = false;

  showCustomConfirm = false;
  customConfirmMessage = '';
  private categoryToDelete: StoreInterface | null = null;

  category = signal<StoreInterface>({
    idCategory: 0,
    categoryName: '',
  });

  ngOnInit(): void {
    this.getCategories();
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

  save() {
    if (this.category().idCategory === 0) {
      this.storeService.addCategory(this.category()).subscribe({
        next: (data: any) => {
          this.visibleError = false;
          this.getCategories();
          this.form()?.resetForm();
          this.category.set({
            idCategory: 0,
            categoryName: '',
          });
        },
        error: (err: any) => {
          this.controlError(err);
        },
      });
    } else {
      this.storeService.updateCategory(this.category()).subscribe({
        next: (data: any) => {
          this.visibleError = false;
          this.getCategories();
          this.form()?.resetForm();
          this.category.set({
            idCategory: 0,
            categoryName: '',
          });
        },
        error: (err: any) => {
          this.controlError(err);
        },
      });
    }
  }

  edit(category: StoreInterface) {
    this.category.set({ ...category });
  }

  cancelEdition() {
    this.category.set({
      idCategory: 0,
      categoryName: '',
    });
  }

  confirmDelete(category: StoreInterface) {
    this.customConfirmMessage = `Delete the category "${category.categoryName}"?`;
    this.categoryToDelete = category;
    this.showCustomConfirm = true;
  }

  onCustomConfirmAccept() {
    if (this.categoryToDelete) {
      this.deleteCategory(this.categoryToDelete.idCategory!);
      this.categoryToDelete = null;
    }
    this.showCustomConfirm = false;
  }

  deleteCategory(id: number) {
    this.storeService.deleteCategory(id).subscribe({
      next: (data: any) => {
        this.visibleError = false;
        this.getCategories();
        this.showCustomConfirm = false;
      },
      error: (err: any) => {
        this.controlError(err);
      },
    });
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
