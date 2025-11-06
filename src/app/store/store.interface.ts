export interface StoreInterface {
  idCategory?: number;
  categoryName: string;
  totalProducts?: number;
}
export interface ProductInterface {
  idProduct: number;
  productName: string;
  price: number;
  discontinued: boolean;
  photo?: File | null;
  photoUrl?: string;
  photoName?: string | null;
  categoryId: number | null;
  categoryName: string;
}
