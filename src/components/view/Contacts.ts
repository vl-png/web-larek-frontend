import { IEvents } from '../base/events';
import { Form, IFormState } from './Form';

export interface IContacts {
	phone: string;
	email: string;
}

export class Contacts extends Form<IContacts> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	render(data: Partial<IContacts> & IFormState) {
		const { phone, email, valid } = data;

		(this.container.querySelector('[name="phone"]') as HTMLInputElement).value =
			phone || '';
		(this.container.querySelector('[name="email"]') as HTMLInputElement).value =
			email || '';
		this.valid = valid;

		return this.container;
	}
}
