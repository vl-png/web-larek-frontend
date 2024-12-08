import { IProduct, IActions } from '../../types';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export interface IBasket {
	list: HTMLElement[];
	price: number;
}

export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		protected events: IEvents
	) {
		super(container);

		this._button = container.querySelector(`.${blockName}__button`);
		this._price = container.querySelector(`.${blockName}__price`);
		this._list = container.querySelector(`.${blockName}__list`);

		if (this._button) {
			this._button.addEventListener('click', () =>
				this.events.emit('basket:order')
			);
		}
	}

	set price(price: number) {
		this.setText(this._price, `${price} синапсов`);
	}

	set list(items: HTMLElement[]) {
		this._list.replaceChildren(...items);
		this.setDisabled(this._button, !items.length);
	}

	disableButton() {
		this.setDisabled(this._button, true);
	}
}

export interface IProductBasket extends IProduct {
	id: string;
	index: number;
}

export class StoreItemBasket extends Component<IProductBasket> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: IActions
	) {
		super(container);

		this._title = container.querySelector(`.${blockName}__title`);
		this._index = container.querySelector(`.basket__item-index`);
		this._price = container.querySelector(`.${blockName}__price`);
		this._button = container.querySelector(`.${blockName}__button`);

		if (this._button) {
			this._button.addEventListener('click', (evt) => {
				this.container.remove();
				actions?.onClick(evt);
			});
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set index(value: number) {
		this.setText(this._index, value.toString());
	}

	set price(value: number) {
		this.setText(this._price, `${value} синапсов`);
	}
}
