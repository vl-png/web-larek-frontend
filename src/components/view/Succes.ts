import { Component } from '../base/Component';
import { IActions } from '../../types';

export interface ISuccess {
	description: number;
}

export class Success extends Component<ISuccess> {
	protected _button: HTMLButtonElement;
	protected _description: HTMLElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: IActions
	) {
		super(container);

		this._button = container.querySelector(`.${blockName}__close`);
		this._description = container.querySelector(`.${blockName}__description`);

		this._button?.addEventListener('click', actions?.onClick);
	}

	set description(value: number) {
		this._description.textContent = 'Списано ' + `${value}` + ' синапсов';
	}
}
