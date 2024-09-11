import './scss/styles.scss';
import { ProductApiService as ApiService } from './components/api/ProductApiService';
import { API_URL as ApiUrl, CDN_URL as CdnUrl } from './utils/constants';
import { EventEmitter as EventManager } from './components/base/events';
import {
	AppStateModel as StateModel,
	CatalogChangeEvent as ProductCatalogChangeEvent,
	Product as ProductItem,
} from './components/state/AppStateModel';
import { MainPageComponents as AppPage } from './components/pages/MainPageComponents';
import { ProductCardComponent as ProductCard } from './components/cards/ProductCardComponent';
import {
	cloneTemplate as duplicateTemplate,
	ensureElement as confirmElement,
} from './utils/utils';
import { ModalComponents as PopupModal } from './components/common/ModalComponent';
import { ShoppingBasketComponent as ShoppingCart } from './components/common/ShoppingBasketComponent';
import { ShoppingBasketCardComponent as ShoppingCartCard } from './components/common/ShoppingBasketCardComponent';
import {
	ICustomerDetails as OrderContactsInterface,
	PaymentOption as PaymentType,
	IOrderDeliveryDetails as OrderAddressInterface,
} from './types';
import { ContactsOrder as OrderContacts } from './components/state/ContactOrderComponent';
import { OrderForm as OrderFormComponent } from './components/form/OrderFormComponent';
import { SuccessComponent as SuccessModal } from './components/common/SuccessModalComponent';

const eventManager = new EventManager();
const apiService = new ApiService(CdnUrl, ApiUrl);

const templates = {
	success: confirmElement<HTMLTemplateElement>('#success'),
	catalogCard: confirmElement<HTMLTemplateElement>('#card-catalog'),
	previewCard: confirmElement<HTMLTemplateElement>('#card-preview'),
	basketCard: confirmElement<HTMLTemplateElement>('#card-basket'),
	basket: confirmElement<HTMLTemplateElement>('#basket'),
	order: confirmElement<HTMLTemplateElement>('#order'),
	contacts: confirmElement<HTMLTemplateElement>('#contacts'),
};

export const applicationState = new StateModel({}, eventManager);

const uiComponents = {
	page: new AppPage(document.body, eventManager),
	modal: new PopupModal(
		confirmElement<HTMLElement>('#modal-container'),
		eventManager
	),
	basket: new ShoppingCart(duplicateTemplate(templates.basket), eventManager),
	orderForm: new OrderFormComponent(
		duplicateTemplate(templates.order),
		eventManager
	),
	contactForm: new OrderContacts(
		duplicateTemplate(templates.contacts),
		eventManager
	),
};

function handleCatalogChange() {
	const catalog = applicationState.catalog.map(
		(item) => new ProductItem(item, eventManager)
	);
	uiComponents.page.catalog = catalog.map((item) => createProductCard(item));
	uiComponents.page.counter = catalog.length;
}
eventManager.on<ProductCatalogChangeEvent>(
	'items:changed',
	handleCatalogChange
);

function createProductCard(item: ProductItem) {
	const productCard = new ProductCard(
		'card',
		duplicateTemplate(templates.catalogCard),
		{
			onClick: () => eventManager.emit('card:select', item),
		}
	);
	return productCard.render({
		title: item.title,
		image: item.image,
		category: item.category,
		price: item.price,
	});
}

async function loadProductList() {
	const basketCount = document.querySelector('.header__basket-counter');
	try {
		const products = await apiService.getProductList();
		applicationState.setCatalog(products);
		basketCount.textContent = '0';
	} catch (err) {
		console.error('Ошибка при загрузке списка товаров:', err);
	}
}
loadProductList();

eventManager.on('card:select', (item: ProductItem) => {
	applicationState.setPreview(item);
});

eventManager.on('preview:changed', (item: ProductItem) => {
	item ? renderProductPreview(item) : uiComponents.modal.close();
});

function renderProductPreview(item: ProductItem) {
	const productCard = new ProductCard(
		'card',
		duplicateTemplate(templates.previewCard),
		{
			onClick: () => handleProductAction(item),
		}
	);
	uiComponents.modal.render({
		content: productCard.render({
			title: item.title,
			image: item.image,
			category: item.category,
			description: item.description,
			price: item.price,
			button: applicationState.checkBasket(item) ? 'Убрать' : 'Купить',
		}),
	});
}

function handleProductAction(item: ProductItem) {
	const action = applicationState.checkBasket(item)
		? 'webproduct:delete'
		: 'webproduct:added';
	eventManager.emit(action, item);
}

eventManager.on('webproduct:added', (item: ProductItem) => {
	if (!applicationState.checkBasket(item)) {
		applicationState.putInBasket(item);
		uiComponents.modal.close();
	}
});

eventManager.on('webproduct:delete', (item: ProductItem) => {
	applicationState.deleteFromBasket(item.id);
	uiComponents.modal.close();
});

eventManager.on('itemsBasket:changed', updateBasketUI);

function updateBasketUI() {
	const fullBasketItems = applicationState
		.fullBasket()
		.map((item) => new ProductItem(item, eventManager));
	uiComponents.page.counter = fullBasketItems.length;
	uiComponents.basket.items = fullBasketItems.map((item, index) => {
		const basketCardItem = new ShoppingCartCard(
			index,
			duplicateTemplate(templates.basketCard),
			{
				onClick: () => removeItemFromBasket(item.id),
			}
		);
		return basketCardItem.render({
			title: item.title,
			price: item.price,
		});
	});
	uiComponents.basket.total = fullBasketItems.reduce(
		(total, item) => total + item.price,
		0
	);
}

function removeItemFromBasket(itemId: string) {
	applicationState.deleteFromBasket(itemId);
	uiComponents.basket.total = applicationState.getTotal();
}

eventManager.on('basket:open', () =>
	uiComponents.modal.render({ content: uiComponents.basket.render() })
);
eventManager.on('order:open', () => openOrderForm());

function openOrderForm() {
	uiComponents.orderForm.setButtonClass('');
	uiComponents.modal.render({
		content: uiComponents.orderForm.render({
			payment: null,
			address: '',
			valid: false,
			errors: [],
		}),
	});
}

eventManager.on('payment:changed', (data: { target: PaymentType }) =>
	applicationState.checkPayment(data.target)
);
eventManager.on('order:submit', () => openContactsForm());

function openContactsForm() {
	uiComponents.modal.render({
		content: uiComponents.contactForm.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
}

eventManager.on(
	'formAddresErrors:change',
	(errors: Partial<OrderAddressInterface>) => {
		const { payment, address } = errors;
		uiComponents.orderForm.valid =
			!payment &&
			!address &&
			validatePaymentOption(applicationState.order.payment);

		uiComponents.orderForm.errors = Object.entries(errors)
			.filter(([, value]) => !!value)
			.map(([key]) => {
				switch (key) {
					case 'payment':
						return 'Ошибка: способ оплаты не выбран. Пожалуйста, выберите допустимый способ оплаты';
					case 'address':
						return 'Ошибка: адрес доставки не указан. Пожалуйста, укажите корректный адрес доставки.';
					default:
						return 'Неизвестная ошибка. Проверьте введенные данные и попробуйте снова.';
				}
			})
			.join(', ');
	}
);

function validatePaymentOption(payment: PaymentType | null): boolean {
	if (!payment) {
		return false; // Оплата не выбрана
	}
	if (payment !== 'card' && payment !== 'cash') {
		console.error('Недопустимый способ оплаты: ' + payment);
		return false; // Недопустимый способ оплаты
	}
	return true;
}

eventManager.on(
	/^contacts\..*:change/,
	(data: { field: keyof OrderContactsInterface; value: string }) => {
		applicationState.setContactField(data.field, data.value);
	}
);

eventManager.on(
	'formContactErrors:change',
	(errors: Partial<OrderContactsInterface>) => {
		const { email, phone } = errors;
		uiComponents.contactForm.valid = !email && !phone;

		uiComponents.contactForm.errors = Object.entries(errors)
			.filter(([, value]) => !!value)
			.map(([key]) => {
				switch (key) {
					case 'email':
						return 'Ошибка: некорректный адрес электронной почты. Пожалуйста, введите действующий email.';
					case 'phone':
						return 'Ошибка: номер телефона не указан или неверен. Пожалуйста, введите правильный номер телефона.';
					default:
						return 'Неизвестная ошибка. Проверьте введенные данные и попробуйте снова.';
				}
			})
			.join('; ');
	}
);

eventManager.on('order.address:change', (data: { value: string }) =>
	applicationState.checkAddress(data.value)
);

eventManager.on('contacts:submit', async () => {
	try {
		applicationState.setOrder();
		await apiService.orderProduct(applicationState.order);
		showSuccessMessage(applicationState.order.total);
	} catch (err) {
		console.error('Ошибка при отправке заказа:', err);
	}
});

function showSuccessMessage(total: number) {
	const successMessage = new SuccessModal(
		duplicateTemplate(templates.success),
		{
			onClick: () => {
				uiComponents.modal.close();
				applicationState.clearBasket();
				uiComponents.orderForm.setButtonClass('');
				eventManager.emit('itemsBasket:changed');
			},
		},
		total
	);
	uiComponents.modal.render({ content: successMessage.render({}) });
}

eventManager.on('modal:open', () => (uiComponents.page.locked = true));
eventManager.on('modal:close', () => {
	uiComponents.page.locked = false;
	if (applicationState.order && applicationState.order.total > 0) {
		applicationState.clearBasket();
		applicationState.defaultOrder();
		eventManager.emit('itemsBasket:changed');
	}
});
