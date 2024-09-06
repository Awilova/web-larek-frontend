import {
	ICartElementData as BasketItemType,
	IProductCartHandlers as CardActionsInterface,
} from '../../types';
import { Component as BaseComponent } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import {
	VALUE_CATALOG as CatalogValue,
	numberWithSpaces as formatNumberWithSpaces,
} from '../cards/ProductCardComponent';

// Класс ShoppingBasketCardComponent представляет отдельный товар в корзине

export class BasketCardComponent extends BaseComponent<BasketItemType> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _price: HTMLElement;

	constructor(
		idx: number,
		container: HTMLElement,
		events: CardActionsInterface
	) {
		if (
			typeof idx !== 'number' ||
			!(container instanceof HTMLElement) ||
			!events
		) {
			throw new Error(
				'Необходимы передать корректные значения для инициализации BasketCardComponent'
			);
		}

		super(container);

		// Инициализация элементов товара

		this._index = this._findElementSafe<HTMLElement>(
			'.basket__item-index',
			container
		);
		this._title = this._findElementSafe<HTMLElement>('.card__title', container);
		this._button = this._findElementSafe<HTMLButtonElement>(
			'.card__button',
			container
		);
		this._price = this._findElementSafe<HTMLElement>('.card__price', container);

		// Установка порядкового номера товара

		this.index = (idx + 1).toString();

		// Добавление обработчика клика на кнопку удаления товара
		this._button.addEventListener('click', (event) => events.onClick(event));
	}
	// Устанавливаем название товара

	set title(value: string) {
		if (!value || typeof value !== 'string') {
			throw new Error('Необходимо передать название продукта');
		}
		this._setText(this._title, value);
	}
	//  Устанавливаем цену товара
	set price(value: number) {
		if (isNaN(value) || value < 0) {
			throw new Error('Цена товара должна быть положительным числом');
		}
		this._setText(
			this._price,
			formatNumberWithSpaces(value) + ' ' + CatalogValue
		);
	}

	// Устанавливаем порядковый номер товара в корзине

    set index(value: string) {
        if (!value || typeof value !== 'string' || isNaN(Number(value)) || Number(value) <= 0) {
            throw new Error('Индекс должен быть строковым представлением положительного числа');
        }
        this._setText(this._index, value);
    }

	// Приватный метод для безопасного поиска элемента с проверкой на существование
	private _findElementSafe<T extends HTMLElement>(
		selector: string,
		context: HTMLElement
	): T {
		const element = ensureElement<T>(selector, context);
		if (!element) {
			throw new Error(
				`Элемент с селектором ${selector} не найден в заданном контексте.`
			);
		}
		return element;
	}

	// Приватный метод для установки текста элемента

	private _setText(element: HTMLElement, text: string): void {
		if (element && typeof text === 'string') {
			element.textContent = text;
		} else {
			throw new Error('Переданы некорректные данные для установки текста');
		}
	}
}
