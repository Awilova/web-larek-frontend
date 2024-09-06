import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';
import { VALUE_CATALOG } from '../cards/ProductCardComponent';
import { ICartItemData } from '../../types';
import { ensureElement } from '../../utils/utils';

// Класс Basket представляет компонент корзины на странице

export class Basket extends Component<ICartItemData> {
	protected _itemList: HTMLElement;
	protected _totalPrice: HTMLElement;
	protected _orderButton: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);
		this._itemList = ensureElement<HTMLElement>(
			'.basket__list',
			this.container
		);
		this._totalPrice = ensureElement<HTMLElement>('.basket__price', container);
		this._orderButton = this.container.querySelector('.basket__button');

		this._orderButton.addEventListener('click', () => {
			events.emit('order:open');
		});

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._itemList.replaceChildren(...items);
		}
	}

	set total(total: number) {
		this.setText(
			this._totalPrice,
			total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + VALUE_CATALOG
		);
	}
}
