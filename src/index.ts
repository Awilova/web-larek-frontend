import './scss/styles.scss';
import { ProductApiService as ApiService } from './components/api/ProductApiService';
import { API_URL as ApiUrl, CDN_URL as CdnUrl } from './utils/constants';
import { EventEmitter as EventManager } from './components/base/events';
import { AppStateModel as StateModel,
    CatalogChangeEvent as ProductCatalogChangeEvent,
    Product as ProductItem
 } from './components/state/AppStateModel';
import { Page as AppPage } from './components/pages/MainPageComponents';
import { Card as ProductCard } from './components/cards/ProductCardComponent';
import {
	cloneTemplate as duplicateTemplate,
	ensureElement as confirmElement,
} from './utils/utils';
import { Modal as PopupModal } from './components/common/ModalComponent';
import { Basket as ShoppingCart } from './components/common/ShoppingBasketComponent';
import { BasketCardComponent as ShoppingCartCard } from './components/common/ShoppingBasketCardComponent';
import {
	ICustomerDetails as OrderContactsInterface,
	PaymentOption as PaymentType,
	IOrderDeliveryDetails as OrderAddressInterface,
} from './types';
import { ContactsOrder as OrderContacts } from './components/state/ContactOrderComponent';
import { OrderForm as OrderFormComponent } from './components/form/OrderFormComponent';
import { SuccessComponent as SuccessModal } from './components/common/SuccessModalComponent';

// Создаём экземпляры событий и  API

const eventManager = new EventManager();
const apiService = new ApiService(CdnUrl, ApiUrl);

eventManager.onAll(logEventData);

function logEventData({ eventName, data }: { eventName: string; data: any }) {
	console.log(eventName, data);
}

// Загружаем шаблоны элементов интерфейса

const templates = {
    success: confirmElement<HTMLTemplateElement>('#success'),
	catalogCard: confirmElement<HTMLTemplateElement>('#card-catalog'),
	previewCard: confirmElement<HTMLTemplateElement>('#card-preview'),
	basketCard: confirmElement<HTMLTemplateElement>('#card-basket'),
	basket: confirmElement<HTMLTemplateElement>('#basket'),
	order: confirmElement<HTMLTemplateElement>('#order'),
	contacts: confirmElement<HTMLTemplateElement>('#contacts'),
};

// Инициализация состояния приложения
export const applicationState = new StateModel({}, eventManager);

// Создаем экземпляры основных компонентов
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

// Функция обработки изменений в каталоге товаров
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

// Создание карточки товара
function createProductCard(item: ProductItem) {
	const productCard = new ProductCard(
		'card',
		duplicateTemplate(templates.catalogCard),
		{
			onClick: () => eventManager.emit('card:select', item), // Исправлено, удалена двойная стрелочная функция
		}
	);
	return productCard.render({
		title: item.title,
		image: item.image,
		category: item.category,
		price: item.price,
	});
}
// Загрузка списка товаров с сервера
async function loadProductList() {
    const basketCount = document.querySelector('.header__basket-counter');
    try {
        const products = await apiService.getProductList();
        applicationState.setCatalog(products);
        basketCount.textContent = '0';
    } catch (error) {
        console.error('Ошибка при загрузке списка товаров',error);
    }
}
loadProductList();


// Обработка выбора товара
eventManager.on('card:select', (item: ProductItem) => {
	applicationState.setPreview(item);
});

// Обработка изменения превью товара
eventManager.on('preview:changed', (item: ProductItem) => {
	item ? renderProductPreview(item) : uiComponents.modal.close();
});

// Рендеринг превью товара в модальном окне
function renderProductPreview(item: ProductItem) {
	const productCard = new ProductCard(
		'card',
		duplicateTemplate(templates.previewCard),
		{
			onClick: () => handleProductAction(item), // Исправлено, удалена двойная стрелочная функция
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

// Функция для обработки добавления или удаления товара
function handleProductAction(item: ProductItem) {
	const action = applicationState.checkBasket(item)
		? 'webproduct:delete'
		: 'webproduct:added';
	eventManager.emit(action, item);
}

// Обработка добавления товара в корзину
eventManager.on('webproduct:added', (item: ProductItem) => {
	if (!applicationState.checkBasket(item)) {
		applicationState.putInBasket(item);
		uiComponents.modal.close();
	}
});

// Обработка удаления товара из корзины
eventManager.on('webproduct:delete', (item: ProductItem) => {
	applicationState.deleteFromBasket(item.id);
	uiComponents.modal.close();
});

// Обработка изменений данных в корзине
eventManager.on('itemsBasket:changed', updateBasketUI);

// Обновление интерфейса корзины
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

// Функция для удаления товара из корзины
function removeItemFromBasket(itemId: string) {
	applicationState.deleteFromBasket(itemId);
	uiComponents.basket.total = applicationState.getTotal();
}

// Обработчики для открытия модальных окон
eventManager.on('basket:open', () =>
	uiComponents.modal.render({ content: uiComponents.basket.render() })
);
eventManager.on('order:open', () => openOrderForm());

// Открытие формы заказа
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

// Обработчики для методов оплаты и отправки заказа
eventManager.on('payment:changed', (data: { target: PaymentType }) =>
	applicationState.checkPayment(data.target)
);
eventManager.on('order:submit', () => openContactsForm());

// Открытие формы контактов
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

// Обработка ошибок валидации формы
eventManager.on(
	'formAddresErrors:change',
	(errors: Partial<OrderAddressInterface>) => {
		const { payment, address } = errors;
		uiComponents.orderForm.valid = !payment && !address;
		uiComponents.orderForm.errors = Object.entries(errors)
			.filter(([, value]) => !!value)
			.map(([key]) => key)
			.join(', ');
	}
);

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
			.map(([key]) => key)
			.join(', ');
	}
);

eventManager.on('order.address:change', (data: { value: string }) =>
	applicationState.checkAddress(data.value)
);

// Обработка отправки формы заказа
eventManager.on('contacts:submit', async () => {
	try {
		applicationState.setOrder();
		await apiService.orderProduct(applicationState.order);
		showSuccessMessage(applicationState.order.total);
	} catch (err) {
		console.error('Ошибка при отправке заказа:', err);
	}
});

// Показ сообщения об успешном заказе
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

// Обработка событий модального окна
eventManager.on('modal:open', () => (uiComponents.page.locked = true));
eventManager.on('modal:close', () => {
	uiComponents.page.locked = false;
	if (applicationState.order && applicationState.order.total > 0) {
		applicationState.clearBasket();
		applicationState.defaultOrder();
		eventManager.emit('itemsBasket:changed');
	}
});
