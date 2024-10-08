import { Model as BaseModel } from '../base/Model';
import {
	PaymentOption as PaymentType,
	IFormValidationMessages as FormErrorsType,
	ICustomerDetails as ContactsOrderType,
	IApplicationStateConfig as AppStateType,
	IItemProductStructure as ProductType,
	IFormOrderStructure as OrderFormType,
} from '../../types';
import { IEvents } from '../base/events';

export class Product extends BaseModel<ProductType> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;

	constructor(data: Partial<ProductType>, events: IEvents) {
		super(data, events);
		this.id = data.id || '';
		this.description = data.description || '';
		this.image = data.image || '';
		this.title = data.title || '';
		this.category = data.category || '';
		this.price = data.price ?? null;
	}
}

export type CatalogChangeEvent = {
	catalog: Product[];
};

export class AppStateModel extends BaseModel<AppStateType> {
	catalog: ProductType[] = [];
	basket: ProductType[] = [];
	order: OrderFormType = {
		email: '',
		phone: '',
		items: [],
		payment: null,
		address: '',
		total: 0,
	};
	preview: string | null = null;
	formErrors: FormErrorsType = {};

	constructor(data: Partial<AppStateType>, events: IEvents) {
		super(data, events);
	}

	deleteFromBasket(id: string): void {
		if (id) {
			this.basket = this.basket.filter((item) => item.id !== id);
			this.emitChanges('itemsBasket:changed');
		}
	}

	putInBasket(item: ProductType): void {
		if (item && item.id) {
			this.basket.push(item);
			this.emitChanges('itemsBasket:changed');
		}
	}

	defaultOrder(): void {
		this.order = {
			email: '',
			phone: '',
			items: [],
			payment: null,
			address: '',
			total: 0,
		};
	}

	fullBasket(): ProductType[] {
		return [...this.basket];
	}

	getTotal(): number {
		return this.basket.reduce((sum, item) => sum + (item.price ?? 0), 0);
	}

	clearBasket(): void {
		this.basket = [];
		this.emitChanges('itemBasket:changed');
		this.defaultOrder();
	}

	checkBasket(item: ProductType): boolean {
		return item
			? this.basket.some((basketItem) => basketItem.id === item.id)
			: false;
	}

	setCatalog(items: ProductType[]): void {
		if (Array.isArray(items)) {
			const uniqueItems = Array.from(new Set(items.map((item) => item.id))).map(
				(id) => items.find((item) => item.id === id)
			);
			this.catalog = uniqueItems.map((item) => new Product(item, this.events));
			this.emitChanges('items:changed', { catalog: this.catalog });
		}
	}

	setPreview(item: Product): void {
		if (item && item.id) {
			this.preview = item.id;
			this.emitChanges('preview:changed', item);
		}
	}

	setOrder(): void {
		this.order.total = this.getTotal();
		this.order.items = this.fullBasket().map((item) => item.id);
	}

	checkAddress(orderAddress: string): void {
		this.order.address = orderAddress;
		this.validateOrderPayment();
	}

	checkPayment(orderPayment: PaymentType): void {
		this.order.payment = orderPayment;
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

	setContactField(field: keyof ContactsOrderType, value: string): void {
		this.order[field] = value;
		this.validateOrderForm();
	}

	validateOrderForm(): boolean {
		const errors: FormErrorsType = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;

		if (Object.keys(errors).length > 0) {
			console.log('Ошибки валидации контактных данных:', errors);
		}

		this.events.emit('formContactErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateOrderPayment(): boolean {
		const errors: FormErrorsType = {};
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrors = errors;

		if (Object.keys(errors).length > 0) {
			console.log('Ошибки валидации оплаты или адреса:', errors);
		}

		this.events.emit('formAddressErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
