import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartRxjsService } from './cart-rxjs.service';

@Component({
  selector: 'app-cart-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="border: 2px dashed #e0e0e0; padding: 15px; margin-top: 20px; border-radius: 8px;">
      <h3>🛒 Корзина покупок (CartViewComponent)</h3>
      
      <div *ngIf="cartService.cartItems().length === 0" style="color: gray;">
        Корзина пуста. Добавьте товары из каталога выше!
      </div>

      <ul *ngIf="cartService.cartItems().length > 0">
        <li *ngFor="let item of cartService.cartItems()" style="margin-bottom: 8px;">
          {{ item.name }} — {{ item.price }} ₸ × {{ item.quantity }}
          <button (click)="onRemove(item.id)" style="margin-left: 10px; color: red;">Удалить</button>
        </li>
      </ul>

      <div *ngIf="cartService.cartItems().length > 0" style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #eee;">
        <strong>Итоговая сумма: {{ cartService.totalPrice() }} ₸</strong>
        <br><br>
        <button (click)="onClear()">Очистить всю корзину</button>
      </div>
    </div>
  `,
})
export class CartViewComponent {
  constructor(public cartService: CartRxjsService) {}

  onRemove(id: number) {
    this.cartService.removeFromCart(id);
  }

  onClear() {
    this.cartService.clearCart();
  }
}
