import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';

interface IModalData {
	content: HTMLElement;
}

export class Modal extends Component<IModalData> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._closeButton.addEventListener('click', () => this.ModalState(false));
		this.container.addEventListener('click', () => this.ModalState(false));

		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	ModalState(isOpen: boolean) {
		this.toggleClass(this.container, 'modal_active', isOpen);
		this.events.emit(isOpen ? 'modal:open' : 'modal:close');
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.ModalState(true);
		return this.container;
	}
}
