export interface IFormValidationState {
	valid: boolean;
	errors: string[];
}

export interface IPageDisplayData {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export interface IApplicationStateConfig {
	catalog: IItemProductStructure[];
	basket: string;
	order: IFormOrderStructure | null;
}

export interface IModalPopup {
	content: HTMLElement;
}

export type PaymentOption = 'card' | 'cash';
export interface IFormOrderStructure {
	payment: PaymentOption;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export interface ICartItemData {
	items: HTMLElement[];
	total: number;
}

export interface IProductCartHandlers {
	onClick: (event: MouseEvent) => void;
}

export interface ITotalElementList<T> {
	total: number;
	items: T[];
}

export interface ICartElementData {
	title: string;
	price: number;
}

export interface IItemProductStructure {
	id: string;
	description: string;
	image: string;
	index?: number;
	title: string;
	category: string;
	price: number | null;
}

export interface IPageContentConfig {
	counter: number | null;
	catalog: HTMLElement[];
	locked: boolean;
}

export interface IOrderTransactionResult {
	id: string;
	total: number;
}

export interface IOperationHandlers {
	onClick: () => void;
}

export interface IOperationResultSummary {
	total: number;
}

export interface ICustomerDetails {
	email: string;
	phone: string;
}

export interface IOrderDeliveryDetails {
	payment: PaymentOption;
	address: string;
}

export type IFormValidationMessages = Partial<
	Record<keyof IFormOrderStructure, string>
>;

export interface IVendorAPIInterface {
	getProductList: () => Promise<IItemProductStructure[]>;
	getProductItem: (id: string) => Promise<IItemProductStructure>;
	orderProduct: (
		order: IFormOrderStructure
	) => Promise<IOrderTransactionResult>;
}
