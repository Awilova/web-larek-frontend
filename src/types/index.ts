export type PaymentMethod = 'card' | 'cash';

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export interface IProduct {
	id: string;
	description: string;
	index?: number;
	image?: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IOrderForm {
	payment: PaymentMethod;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export interface IBasketCard {
	title: string;
	price: number;
}

export interface IPageData {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export interface IBasketData {
	items: HTMLElement[];
	total: number;
}

export interface IAppStateModel {
	catalog: IProduct[];
	basket: string[];
	order: IOrderForm | null;
}

export interface IModal {
	content: HTMLElement;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ITotalItems<T> {
	total: number;
	items: T[];
}

export interface IOrderResult {
	id: string;
	total: number;
}

export interface ISuccess {
	total: number;
}

export interface ISuccessActions {
	onClick: () => void;
}

export interface IContactsOrder {
	email: string;
	phone: string;
}

export interface IOrderAddress {
	payment: PaymentMethod;
	address: string;
}

export interface ILarekApi {
	getProductList: () => Promise<IProduct[]>;
	getProductItem: (id: string) => Promise<IProduct>;
	orderProduct: (order: IOrderForm) => Promise<IOrderResult>;
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}
