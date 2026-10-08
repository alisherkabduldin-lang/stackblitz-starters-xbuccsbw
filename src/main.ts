import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { CartRxjsService } from './cart-rxjs.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="border: 2px dashed #4caf50; padding: 20px; margin-top: 30px; border-radius: 12px; background: #f9f9f9;">
      <h3 style="margin-top: 0; color: #2e7d32;">🛒 Компонент корзины (CartViewComponent)</h3>
      
      <!-- Проверяем длину массива через async пайп -->
      <div *ngIf="((cartService.cartItems$ | async) || []).length === 0" style="color: #757575; font-style: italic;">
        Корзина пуста. Добавьте товары из каталога выше!
      </div>

      <ul *ngIf="((cartService.cartItems$ | async) || []).length > 0" style="padding-left: 20px;">
        <!-- ПКП 9: Подписка на поток cartItems$ в шаблоне с помощью пайпа async -->
        <li *ngFor="let item of (cartService.cartItems$ | async)" style="margin-bottom: 10px; font-size: 16px;">
          <strong>{{ item.name }}</strong> — {{ item.price }} ₸ 
          <span style="color: #666; margin-left: 10px;">(кол-во: {{ item.quantity }})</span>
          <button (click)="onRemove(item.id)" style="margin-left: 15px; color: #d32f2f; background: none; border: 1px solid #d32f2f; padding: 2px 8px; border-radius: 4px; cursor: pointer;">
            Удалить
          </button>
        </li>
      </ul>

      <div *ngIf="((cartService.cartItems$ | async) || []).length > 0" style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center;">
        <!-- Считаем сумму динамически через async пайп и кастомный поток totalPrice$ -->
        <span style="font-size: 18px; font-weight: bold;">
          Итоговая сумма: {{ (totalPrice$ | async) }} ₸
        </span>
        <button (click)="onClear()" style="background: #d32f2f; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold;">
          Очистить корзину
        </button>
      </div>
    </div>
  `,
})
export class CartViewComponent {
  // Вычисляем итоговую сумму через RxJS
  totalPrice$ = this.cartService.cartItems$.pipe(
    map((items) =>
      items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
    )
  );

  // ОБЯЗАТЕЛЬНО должен быть этот конструктор с ключевым словом public
  constructor(public cartService: CartRxjsService) {}

  onRemove(id: number) {
    this.cartService.removeFromCart(id);
  }

  onClear() {
    this.cartService.clearCart();
  }
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CartViewComponent],
  template: `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <!-- ПКП 8: Интеграция CartRxjsService в HeaderComponent (сумма считается через поток) -->
      <header style="display: flex; justify-content: space-between; background: #3f51b5; color: white; padding: 15px; border-radius: 8px;">
        <h2>🏪 Мой Магазин (Чистый RxJS)</h2>
        <div style="align-self: center; font-weight: bold;">
          В корзине на сумму: {{ (totalPrice$ | async) }} ₸
        </div>
      </header>

      <!-- ПКП 8: Интеграция CartRxjsService в ProductListComponent (Каталог) -->
      <section style="margin-top: 20px;">
        <h3>📦 Каталог товаров</h3>
        <div style="display: flex; gap: 10px;">
          <div *ngFor="let prod of demoProducts" style="border: 1px solid #ccc; padding: 10px; border-radius: 4px; flex: 1; text-align: center;">
            <h4>{{ prod.name }}</h4>
            <p>{{ prod.price }} ₸</p>
            <button (click)="addToCart(prod)" style="cursor: pointer; padding: 5px 10px;">В корзину</button>
          </div>
        </div>
      </section>

      <app-cart-view></app-cart-view>

    </div>
  `,
})
export class App {
  demoProducts = [
    { id: 1, name: 'Книга по Angular', price: 5000 },
    { id: 2, name: 'Мышка RGB', price: 8500 },
    { id: 3, name: 'Клавиатура', price: 15000 },
  ];

  // Итоговая сумма для шапки (Header) через RxJS поток
  totalPrice$ = this.cartService.cartItems$.pipe(
    map((items) =>
      items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
    )
  );

  constructor(public cartService: CartRxjsService) {}

  addToCart(product: any) {
    this.cartService.addToCart(product);
  }
}

bootstrapApplication(App);
