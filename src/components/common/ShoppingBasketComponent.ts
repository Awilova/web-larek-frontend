import { createElement, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { Component } from '../base/Component';
import { currency } from '../../utils/constants';
import { ICartItemData } from '../../types';

export class ShoppingBasketComponent extends Component<ICartItemData> {
	protected itemListElement: HTMLElement;
	protected totalPriceElement: HTMLElement;
	protected orderButtonElement: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		if (!(container instanceof HTMLElement) || !events) {
			throw new Error('Передан некорректный контейнер или события для Basket.');
		}

		super(container);

		this.itemListElement = ensureElement<HTMLElement>(
			'.basket__list',
			this.container
		);
		this.totalPriceElement = this.container.querySelector('.basket__price');
		this.orderButtonElement = this.container.querySelector('.basket__button');

		if (this.orderButtonElement) {
		}
		this.orderButtonElement.addEventListener('click', () => {
			events.emit('order:open');
		});

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this.itemListElement.append(...items);
			this.setDisabled(this.orderButtonElement, false);
		} else {
			this.itemListElement.append(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			this.setDisabled(this.orderButtonElement, true);
		}
	}

	set total(total: number) {
		if (isNaN(total) || total < 0) {
			throw new Error('Стоимость корзины должна быть положительным числом.');
		}
		
		this.totalPriceElement.textContent = total.toLocaleString() + currency;
	}
}
