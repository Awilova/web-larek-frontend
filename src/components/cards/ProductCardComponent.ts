import { Component as BaseComponent } from '../base/Component';
import { IItemProductStructure as ProductType } from '../../types/index';
import { ensureElement as findElement } from '../../utils/utils';
import { IProductCartHandlers as CardActionType } from '../../types/index';

// Постоянные значения
export const VALUE_CATALOG = ' синапсов';
export const numberWithSpaces = (value: number) =>
	value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
export const settings = {};

// Расширение IProduct для включения дополнительных свойств для отображения карточки
export type CardData = ProductType & {
	id?: string;
	description?: string;
	button?: string;
};

// Словарь категорий продуктов
const categoryClasses: Record<string, string> = {
	другое: '_other',
	'софт-скил': '_soft',
	'хард-скил': '_hard',
	дополнительное: '_additional',
	кнопка: '_button',
};

// Класс Card отображает детали продукта в формате карточки.

export class Card extends BaseComponent<CardData> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _price: HTMLElement;
	protected _category: HTMLElement;

	constructor(
		blockName: string,
		container: HTMLElement,
		actions: CardActionType
	) {
		if (!blockName || !container) {
			throw new Error('Необходимы blockName и container для инициализации Card.');
		}
		super(container);

		// Инициализация свойств
		this._title = this._findElementSafe<HTMLElement>(`.${blockName}__title`, container);
		this._image = this._findElementSafe<HTMLImageElement>(`.${blockName}__image`, container);
		this._description = container.querySelector(`.${blockName}__text`) as HTMLElement || null;
		this._button = container.querySelector(`.${blockName}__button`) as HTMLButtonElement || null;
		this._price = this._findElementSafe<HTMLElement>(`.${blockName}__price`, container);
		this._category = this._findElementSafe<HTMLElement>(`.${blockName}__category`, container);

		// Добавляем обработчик событий
		if (this._button) {
			this._button.addEventListener('click', actions.onClick);
		} else {
			if (container) {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	// Методы установки значений
	set title(value: string) {
		if (value) {
			this._setText(this._title, value);
		}
	}

	set image(value: string) {
		if (value && this._title.textContent) {
			this._setImage(this._image, value, this._title.textContent);
		}
	}

	set description(value: string) {
		if (value && this._description) {
			this._setText(this._description, value);
		}
	}

	set price(value: number) {
		if (value == null || isNaN(value)) {
			this._setText(this._price, 'Бесценно');
			this._disableButton();
		} else {
			this._setText(this._price, `${numberWithSpaces(value)} ${VALUE_CATALOG}`);
		}
	}

	get price(): number {
		return Number(this._price.textContent?.replace(/\D/g, '') || 0);
	}

	set category(value: string) {
		if (value) {
			this._setText(this._category, value);
			const categoryClass = categoryClasses[value] || '';
			if (categoryClass) {
				this._category.classList.add('card__category' + categoryClass);
			}
		}
	}

	set button(value: string) {
		if (this._button && value) {
			this._setText(this._button, value);
		}
	}

	// Вспомогательные методы
	private _setText(element: HTMLElement, text: string): void {
		if (element && text !== undefined) {
			element.textContent = text;
		}
	}

	private _setImage(imageElement: HTMLImageElement, src: string, alt: string): void {
		if (imageElement && src && alt) {
			imageElement.src = src;
			imageElement.alt = alt;
		}
	}

	private _disableButton(): void {
		if (this._button) {
			this._button.setAttribute('disabled', 'disabled');
		}
	}

	private _findElementSafe<T extends HTMLElement>(selector: string, context: HTMLElement): T {
		const element = findElement<T>(selector, context);
		if (!element) {
			throw new Error(`Элемент с селектором ${selector} не найден в заданном контексте.`);
		}
		return element;
	}
}
