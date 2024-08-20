import './scss/styles.scss';
import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import {
	AppStateModel,
	CatalogChangeEvent,
	Product,
} from './components/AppState';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { BasketCard } from './components/common/BasketCard';
import { IContactsOrder, PaymentMethod, IOrderAddress } from './types';
import { ContactsOrder } from './components/ContactsOrder';
import { OrderForm } from './components/OrderForm';
import { Success } from './components/common/Success';

const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);
export const CATALOG_VALUE = ' синапсов';
export const settings = {};
export const numberWithSpaces = (value: number): string =>
	value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

export const appState = new AppStateModel({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new OrderForm(cloneTemplate(orderTemplate), events);
const contacts = new ContactsOrder(cloneTemplate(contactsTemplate), events);

events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appState.catalog.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});

	page.counter = appState.fullBasket().length;
});

api
	.getProductList()
	.then(appState.setCatalog.bind(appState))
	.catch((err) => {
		console.error(err);
	});

events.on('card:select', (item: Product) => {
	appState.setPreview(item);
});

events.on('preview:changed', (item: Product) => {
	if (item) {
		const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
			onClick: () => {
				if (appState.checkBasket(item)) {
					events.emit('webproduct:delete', item);
				} else {
					events.emit('webproduct:added', item);
				}
			},
		});
		modal.render({
			content: card.render({
				title: item.title,
				image: item.image,
				category: item.category,
				description: item.description,
				price: item.price,
				button: appState.checkBasket(item) ? 'Убрать' : 'Купить',
			}),
		});
	} else {
		modal.close();
	}
});

events.on('webproduct:added', (item: Product) => {
	appState.putInBasket(item);
	modal.close();
});

events.on('webproduct:delete', (item: Product) => {
	appState.deleteFromBasket(item.id);
	modal.close();
});

events.on('itemsBasket:changed', () => {
	const fullBasket = appState.fullBasket();
	page.counter = fullBasket.length;
	let total = 0;
	basket.items = fullBasket.map((item, index) => {
		const card = new BasketCard(index, cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				appState.deleteFromBasket(item.id);
				basket.total = appState.getTotal();
			},
		});
		total = total + item.price;
		return card.render({
			title: item.title,
			price: item.price,
		});
	});
	basket.total = total;
});

events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

events.on('order:open', () => {
	order.setButtonClass('');
	modal.render({
		content: order.render({
			payment: null,
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('payment:changed', (data: { target: PaymentMethod }) => {
	appState.checkPayment(data.target);
});

events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('formAddresErrors:change', (errors: Partial<IOrderAddress>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join(', ');
});

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContactsOrder; value: string }) => {
		appState.setContactField(data.field, data.value);
	}
);

events.on('formContactErrors:change', (errors: Partial<IContactsOrder>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join(', ');
});

events.on('order.address:change', (data: { value: string }) => {
	appState.checkAddress(data.value);
});

events.on('contacts:submit', () => {
	appState.setOrder();
	api
		.orderProduct(appState.order)
		.then(() => {
			const success = new Success(
				cloneTemplate(successTemplate),
				{
					onClick: () => {
						modal.close();
						appState.clearBasket();
						order.setButtonClass('');
						events.emit('itemsBasket:changed');
					},
				},
				appState.order.total
			);
			modal.render({ content: success.render({}) });
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
	if (appState.order && appState.order.total > 0) {
		appState.clearBasket();
		appState.defaultOrder();
		events.emit('itemsBasket:changed');
	}
});
