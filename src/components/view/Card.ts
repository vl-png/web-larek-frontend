import { Component } from '../base/Component';
import { CategoryType, IActions } from '../../types';
import { ensureElement } from '../../utils/utils';
import { CDN_URL } from '../../utils/constants';

export interface ICard {
	id: string;
	title: string;
	category: string;
	description: string;
	image: string;
	price: number | null;
	selected: boolean;
	colors: {
		[key: string]: string;
	};
}

export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _colors: ICard['colors'] = {
		дополнительное: 'card__category_additional',
		'софт-скил': 'card__category_soft',
		кнопка: 'card__category_button',
		'хард-скил': 'card__category_hard',
		другое: 'card__category_other',
	};

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: IActions
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = ensureElement<HTMLImageElement>(
			`.${blockName}__image`,
			container
		);
		this._button = container.querySelector(`.${blockName}__button`);
		this._category = container.querySelector(`.${blockName}__category`);
		this._price = container.querySelector(`.${blockName}__price`);

		const clickHandler = actions?.onClick;
		(this._button || container).addEventListener('click', clickHandler);
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}
	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}
	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, CDN_URL + value);
	}

	set selected(value: boolean) {
		if (!this._button.disabled) {
			this.setDisabled(this._button, value);
		}
	}

	set price(value: number | null) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
		if (this._button && !value) {
			this.setDisabled(this._button, true);
		}
	}

	set category(value: CategoryType) {
		this.setText(this._category, value);
		this.toggleClass(this._category, this._colors[value], true);
	}
}

export class StoreItem extends Card {
	constructor(container: HTMLElement, actions?: IActions) {
		super('card', container, actions);
	}
}

export class StoreItemPreview extends Card {
	protected _description: HTMLElement;

	constructor(container: HTMLElement, actions?: IActions) {
		super('card', container, actions);

		this._description = container.querySelector(`.${this.blockName}__text`);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}
}
