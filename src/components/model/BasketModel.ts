import { IProduct } from '../../types';
import { Model } from '../base/Model';

interface IBasketModel {
	basket: IProduct[];
	addToBasket(value: IProduct): void;
	deleteFromBasket(id: string): void;
	clearBasket(): void;
	getBasketAmount(): number;
	getTotalBasketPrice(): number;
}

export class BasketModel extends Model<IBasketModel> {
	basket: IProduct[] = [];

	addToBasket(value: IProduct) {
		this.basket.push(value);
	}

	deleteFromBasket(id: string) {
		this.basket = this.basket.filter((item) => item.id !== id);
	}

	clearBasket() {
		this.basket = [];
	}

	getBasketAmount() {
		return this.basket.length;
	}

	getTotalBasketPrice() {
		return this.basket.reduce((sum, next) => sum + next.price, 0);
	}
}
