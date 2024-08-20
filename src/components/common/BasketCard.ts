import { IBasketCard, ICardActions } from '../../types';
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { CATALOG_VALUE, numberWithSpaces } from '../../index';

export class BasketCard extends Component<IBasketCard> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _button: HTMLElement;
	protected _price: HTMLElement;

	constructor(idx: number, container: HTMLElement, events: ICardActions) {
		super(container);

		this._index = ensureElement<HTMLElement>('.basket__item-index', container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._button = ensureElement<HTMLButtonElement>('.card__button', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);

		this.setText(this._index, idx + 1);

		this._button.addEventListener('click', events.onClick);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		this.setText(this._price, numberWithSpaces(value) + ' ' + CATALOG_VALUE);
	}

	set index(value: number) {
		this.setText(this._title, value);
	}
}
