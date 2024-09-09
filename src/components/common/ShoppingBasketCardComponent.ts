import { ICartElementData as BasketItemType } from '../../types';
import { Component as BaseComponent } from '../base/Component';
import { IProductCardHandlers as CardActionsInterface } from '../../types';
import { ensureElement as findElement } from '../../utils/utils';
import { currency } from '../../utils/constants';

export class ShoppingBasketCardComponent extends BaseComponent<BasketItemType> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _index: HTMLElement;

	constructor(idx: number, container: HTMLElement, events: CardActionsInterface) {
		if (typeof idx !== 'number' || !(container instanceof HTMLElement) || !events) {
			throw new Error('Необходимо передать корректные значения для инициализации BasketCardComponent.');
		}
		super(container);

		this._title = this._findElementSafe<HTMLElement>('.card__title', container);
		this._price = this._findElementSafe<HTMLElement>('.card__price', container);
		this._button = this._findElementSafe<HTMLButtonElement>('.card__button', container);
		this._index = this._findElementSafe<HTMLElement>('.basket__item-index', container);

		
		this.index = (idx + 1).toString();
		this._button.addEventListener('click', (event) => events.onClick(event));
	}

	set title(value: string) {
		if (!value || typeof value !== 'string') {
			throw new Error('Передано некорректное название товара.');
		}
		this._setText(this._title, value);
	}

	set price(value: number) {
		if (isNaN(value) || value < 0) {
			throw new Error('Цена товара должна быть положительным числом.');
		}
		this._setText(this._price, value + ' ' + currency);
	}

	set index(value: string) { 
		if (!value || typeof value !== 'string' || isNaN(Number(value)) || Number(value) <= 0) {
			throw new Error('Индекс должен быть строковым представлением положительного числа.');
		}
		this._setText(this._index, value);
	}

// Приватные методы для поиска товара и установки значения
	private _findElementSafe<T extends HTMLElement>(selector: string, context: HTMLElement): T {
		const element = findElement<T>(selector, context);
		if (!element) {
			throw new Error(`Элемент с селектором ${selector} не найден в заданном контексте.`);
		}
		return element;
	}

	
	private _setText(element: HTMLElement, text: string): void {
		if (element && typeof text === 'string') {
			element.textContent = text;
		} else {
			throw new Error('Переданы некорректные данные для установки текста.');
		}
	}
}

