import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity?: number; // Делаем опциональным для совместимости
}

@Injectable({
  providedIn: 'root',
})
export class CartRxjsService {
  // ПКП 3: Приватное состояние на базе BehaviorSubject
  private cartItemsSubject = new BehaviorSubject<Product[]>([]);

  // ПКП 4: Публичный поток Observable
  cartItems$ = this.cartItemsSubject.asObservable();

  // ПКП 6-7: Метод добавления товара через getValue() и .next()
  addToCart(product: Product) {
    // Получение текущего значения через .getValue()
    const currentItems = this.cartItemsSubject.getValue();

    // Ищем, есть ли уже такой товар в корзине
    const existingItem = currentItems.find((item) => item.id === product.id);

    if (existingItem) {
      // Если есть, увеличиваем количество
      const updatedItems = currentItems.map((item) =>
        item.id === product.id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
      // Отправка в поток через .next()
      this.cartItemsSubject.next(updatedItems);
    } else {
      // Если нет, добавляем новый элемент с количеством 1
      const newItem = { ...product, quantity: 1 };
      // Отправка в поток через .next()
      this.cartItemsSubject.next([...currentItems, newItem]);
    }
  }

  // Метод удаления для работоспособности компонента корзины
  removeFromCart(productId: number) {
    const currentItems = this.cartItemsSubject.getValue();
    const updatedItems = currentItems.filter((item) => item.id !== productId);
    this.cartItemsSubject.next(updatedItems);
  }

  // Метод очистки для работоспособности компонента корзины
  clearCart() {
    this.cartItemsSubject.next([]);
  }
}
