import { createElement, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { Component } from '../base/Component';
import { currency } from '../../utils/constants';
import { ICartItemData } from '../../types';

export class ShoppingBasketComponent extends Component<ICartItemData> {
	protected _itemCatalog: HTMLElement;
	protected _totalNumber: HTMLElement;
	protected _orderButton: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._itemCatalog = ensureElement<HTMLElement>(
			'.basket__list',
			this.container
		);
		this._totalNumber = this.container.querySelector('.basket__price');
		this._orderButton = this.container.querySelector('.basket__button');

		if (this._orderButton) {
		}
		this._orderButton.addEventListener('click', () => {
			events.emit('order:open');
		});

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._itemCatalog.append(...items);
			this.setDisabled(this._orderButton, false);
		} else {
			this._itemCatalog.append(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			this.setDisabled(this._orderButton, true);
		}
	}

	set total(total: number) {
		this._totalNumber.textContent = total.toLocaleString() + currency;
	}
}
