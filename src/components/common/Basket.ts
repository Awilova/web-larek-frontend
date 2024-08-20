import { Component } from '../base/Component';
import { createElement, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { CATALOG_VALUE } from '../../index';
import { IBasketData } from '../../types';

export class Basket extends Component<IBasketData> {
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
			this.setDisabled(this._orderButton, false);
		} else {
			this._itemList.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			this.setDisabled(this._orderButton, true);
		}
	}

	set total(total: number) {
		this.setText(
			this._totalPrice,
			total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + CATALOG_VALUE
		);
	}
}
