import { Model } from './base/Model';
import {
	PaymentMethod,
	FormErrors,
	IContactsOrder,
	IAppStateModel,
	IProduct,
	IOrderForm,
} from '../types';

export class Product extends Model<IProduct> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export type CatalogChangeEvent = {
	catalog: Product[];
};

export class AppStateModel extends Model<IAppStateModel> {
	catalog: IProduct[] = [];
	basket: IProduct[] = [];
	order: IOrderForm = {
		email: '',
		phone: '',
		items: [],
		payment: null,
		address: '',
		total: 0,
	};
	preview: string | null;
	formErrors: FormErrors = {};

	putInBasket(item: IProduct): void {
		this.basket.push(item);
		this.emitChanges('itemsBasket:changed');
	}

	deleteFromBasket(id: string): void {
		this.basket = this.basket.filter((item) => item.id !== id);
		this.emitChanges('itemsBasket:changed');
	}

	defaultOrder() {
		this.order = {
			email: '',
			phone: '',
			items: [],
			payment: null,
			address: '',
			total: 0,
		};
	}

	clearBasket(): void {
		this.basket = [];
		this.emitChanges('itemBasket:changed');
		this.defaultOrder();
		this.basket.reduce((summ, IProduct) => summ + IProduct.price, 0);
	}

	getTotal() {
		return this.basket.reduce((summ, IProduct) => summ + IProduct.price, 0);
	}

	setCatalog(items: IProduct[]) {
		this.catalog = items.map((item) => new Product(item, this.events));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	fullBasket(): IProduct[] {
		return this.basket;
	}

	checkBasket(item: IProduct) {
		return this.basket.includes(item);
	}

	setPreview(item: Product) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setOrder(): void {
		this.order.total = this.getTotal();
		this.order.items = this.fullBasket().map((item) => item.id);
	}

	checkPayment(orderPayment: PaymentMethod): void {
		this.order.payment = orderPayment;
		this.validateOrderPayment();
	}

	checkAddress(orderAddress: string): void {
		this.order.address = orderAddress;
		this.validateOrderPayment();
	}

	checkEmail(orderEmail: string): void {
		this.order.email = orderEmail;
		this.validateOrderForm();
	}

	checkPhone(orderPhone: string): void {
		this.order.phone = orderPhone;
		this.validateOrderForm();
	}

	validateOrderPayment() {
		const errors: FormErrors = {};
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrors = errors;
		this.events.emit('formAddresErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateOrderForm() {
		const errors: FormErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('formContactErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	setContactField(field: keyof IContactsOrder, value: string): void {
		this.order[field] = value;
		this.validateOrderForm();
	}
}
