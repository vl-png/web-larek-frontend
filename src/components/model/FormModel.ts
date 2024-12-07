import { IOrder, FormErrors, IOrderForm } from '../../types';
import { Model } from '../base/Model';

interface IFormModel {
	order: IOrder;
	formErrors: FormErrors;
	setItems(): void;
	setOrderField(field: keyof IOrderForm, value: string): void;
	validateContacts(): boolean;
	validateOrder(): boolean;
	clearOrder(): void;
}

const EMAIL_REGEXP = /^\S+@\S+\.\S+$/;
const TEL_REGEXP =
	/^((8|\+374|\+994|\+995|\+375|\+7|\+380|\+38|\+996|\+998|\+993)[\- ]?)?\(?\d{3,5}\)?[\- ]?\d{1}[\- ]?\d{1}[\- ]?\d{1}[\- ]?\d{1}[\- ]?\d{1}(([\- ]?\d{1})?[\- ]?\d{1})?$/;

export class FormModel extends Model<IFormModel> {
	order: IOrder = {
		items: [],
		payment: '',
		total: null,
		address: '',
		email: '',
		phone: '',
	};

	formErrors: FormErrors = {};

	setItems(items: string[]) {
		this.order.items = items;
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.validateContacts()) {
			this.events.emit('contacts:ready', this.order);
		}
		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateContacts() {
		const errors: typeof this.formErrors = {};

		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		} else if (!EMAIL_REGEXP.test(this.order.email)) {
			errors.email = 'Неправильно указан email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		} else if (!TEL_REGEXP.test(this.order.phone)) {
			errors.phone = 'Неправильно указан телефон';
		}

		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
		return Object.keys(errors).length;
	}

	validateOrder() {
		const errors: FormErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('orderFormErrors:change', this.formErrors);
		return !Object.keys(errors).length;
	}

	clearOrder() {
		this.order = {
			items: [],
			total: null,
			address: '',
			email: '',
			phone: '',
			payment: '',
		};
		this.formErrors = {};
	}
}
