import { IProduct } from '../../types';
import { Model } from '../base/Model';

interface IDataModel {
	store: IProduct[];
	setStore(items: IProduct[]): void;
	resetSelected(): void;
}

export class DataModel extends Model<IDataModel> {
	store: IProduct[];

	setStore(data: { total: number; items: IProduct[] }) {
		this.store = data.items;
		this.emitChanges('items:changed', { store: this.store });
	}

	resetSelected() {
		this.store.forEach((item) => (item.selected = false));
	}
}
