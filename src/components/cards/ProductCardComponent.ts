import { IProductCardHandlers as CardActionsType, IItemProductStructure as ProductType } from '../../types/index';
import { Component as BaseComponent } from '../base/Component';
import { ensureElement as findElement } from '../../utils/utils';
import { currency, categories } from '../../utils/constants';



export class ProductCardComponent extends BaseComponent<ProductType> {
	protected _category: HTMLElement;
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;

	constructor(
		blockName: string,
		container: HTMLElement,
		actions: CardActionsType,
	) {
		if (!blockName || !container) {
			throw new Error('Необходимы blockName и container для инициализации Card.');
		}
		super(container);

		this._category = this._findElementSafe<HTMLElement>(`.${blockName}__category`, container);
		this._title = this._findElementSafe<HTMLElement>(`.${blockName}__title`, container);
		this._image = this._findElementSafe<HTMLImageElement>(`.${blockName}__image`, container);
		this._price = this._findElementSafe<HTMLElement>(`.${blockName}__price`, container);
		this._description = container.querySelector(`.${blockName}__text`) as HTMLElement || null;
		this._button = container.querySelector(`.${blockName}__button`) as HTMLButtonElement || null;
		
		
		if (this._button) {
			this._button.addEventListener('click', actions.onClick);
		} else {
			if (container) {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set category(value: string) {
		if (value) {
			this._setText(this._category, value);
			const category = categories[value] || '';
			if (category) {
				this._category.classList.add('card__category' + category);
			}
		}
	}
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

	set price(value: number) {
		if (value == null || isNaN(value)) {
			this._setText(this._price, 'Бесценно');
			this._disableButton();
		} else {
			this._setText(this._price, `${value} ${currency}`);
		}
	}
	set description(value: string) {
		if (value && this._description) {
			this._setText(this._description, value);
		}
	}

	set button(value: string) {
		if (this._button && value) {
			this._setText(this._button, value);
		}
	}

	get price(): number {
		return Number(this._price.textContent ?? '');
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
