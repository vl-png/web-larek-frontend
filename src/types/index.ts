export interface IItem {
  id: string;
	title: string;
	description: string;
	price: number | null;
	category: string;
	image: string;
}

export interface IItemData {
	items: IItem[];
	preview: string | null;
	getItem(itemId: string): IItem;
}

export interface IUserData {
	payment?: string;
	email?: string;
	phone?: string;
	address?: string;
	total?: number;
	items?: string[];
}

export interface IBasketData {
	items: [IItem];
	total: number;
	getTotal(items: [IItem]): number;
	add(id: string): void;
	remove(id: string): void;
	checkItem(id: string): boolean;
}