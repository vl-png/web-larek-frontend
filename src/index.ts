import { Api, ApiListResponse } from './components/base/api';
import { EventEmitter } from './components/base/events';

import { BasketModel } from './components/model/BasketModel';
import { DataModel } from './components/model/DataModel';
import { FormModel } from './components/model/FormModel';

import { Page } from './components/view/Page';
import { Modal } from './components/view/Modal';
import { StoreItem, StoreItemPreview } from './components/view/Card';
import { Basket, StoreItemBasket } from './components/view/Basket';
import { Order } from './components/view/Order';
import { Contacts } from './components/view/Contacts';
import { Success } from './components/view/Succes';

import { IOrderForm, IProduct } from './types';
import { ensureElement, cloneTemplate } from './utils/utils';
import { API_URL } from './utils/constants';
import './scss/styles.scss';

const api = new Api(API_URL);
const events = new EventEmitter();

const storeProductTemplate =
	ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const basketModel = new BasketModel({}, events);
const dataModel = new DataModel({}, events);
const formModel = new FormModel({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket('basket', cloneTemplate(basketTemplate), events);
const order = new Order('order', cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

const success = new Success('order-success', cloneTemplate(successTemplate), {
	onClick: () => {
		events.emit('modal:close');
		modal.ModalState(false);
	},
});

api
	.get('/product')
	.then((data: { total: number; items: IProduct[] }) => {
		dataModel.setStore(data);
	})
	.catch((err) => {
		console.error(err);
	});

events.on('items:changed', () => {
	page.store = dataModel.store.map((item) => {
		const product = new StoreItem(cloneTemplate(storeProductTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return product.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

events.on('card:select', (item: IProduct) => {
	page.locked = true;
	const product = new StoreItemPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('card:toBasket', item);
		},
	});
	modal.render({
		content: product.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			description: item.description,
			price: item.price,
			selected: item.selected,
		}),
	});
});

events.on('card:toBasket', (item: IProduct) => {
	item.selected = true;
	basketModel.addToBasket(item);
	page.counter = basketModel.getBasketAmount();
	modal.ModalState(false);
});

events.on('basket:open', () => {
	page.locked = true;
	const basketItems = basketModel.basket.map((item, index) => {
		const storeItem = new StoreItemBasket(
			'card',
			cloneTemplate(cardBasketTemplate),
			{
				onClick: () => events.emit('basket:delete', item),
			}
		);
		return storeItem.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});
	modal.render({
		content: basket.render({
			list: basketItems,
			price: basketModel.getTotalBasketPrice(),
		}),
	});
});

events.on('basket:delete', (item: IProduct) => {
	basketModel.deleteFromBasket(item.id);
	item.selected = false;

	const basketItems = basketModel.basket.map((item, index) => {
		const storeItem = new StoreItemBasket(
			'card',
			cloneTemplate(cardBasketTemplate),
			{
				onClick: () => events.emit('basket:delete', item),
			}
		);
		return storeItem.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});

	basket.list = basketItems;
	basket.price = basketModel.getTotalBasketPrice();
	page.counter = basketModel.getBasketAmount();

	if (!basketModel.basket.length) {
		basket.disableButton();
	}
});

events.on('basket:order', () => {
	modal.render({
		content: order.render({
			address: formModel.order.address || '',
			payment: formModel.order.payment || '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join(', ');
});

events.on('contactsFormErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = [phone, email].filter(Boolean).join(', ');
});

events.on(
	'orderInput:change',
	(data: { field: keyof IOrderForm; value: string }) => {
		formModel.setOrderField(data.field, data.value);
	}
);

events.on('order:submit', () => {
	formModel.order.total = basketModel.getTotalBasketPrice();
	formModel.setItems(basketModel.basket.map((item) => item.id));
	modal.render({
		content: contacts.render({
			phone: formModel.order.phone || '',
			email: formModel.order.email || '',
			errors: [],
			valid: false,
		}),
	});
});

events.on('contacts:submit', () => {
	api
		.post('/order', formModel.order)
		.then((res) => {
			events.emit('order:success', res);
			basketModel.clearBasket();
			formModel.clearOrder();
			order.disableButtons();
			page.counter = 0;
			dataModel.resetSelected();
		})
		.catch((err) => {
			console.log(err);
		});
});

events.on('order:success', (res: ApiListResponse<string>) => {
	modal.render({
		content: success.render({
			description: res.total,
		}),
	});
});

events.on('modal:close', () => {
	page.locked = false;
	formModel.clearOrder();
});
