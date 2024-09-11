import { IProductCardHandlers as ProductCardHandlers, IItemProductStructure as ProductType } from '../../types/index';
import { Component as BaseComponentView } from '../base/Component';
import { ensureElement as findElement } from '../../utils/utils';
import { currency, categories } from '../../utils/constants';



export class ProductCardComponent extends BaseComponentView<ProductType> {
	protected categoryElement: HTMLElement;
	protected titleElement: HTMLElement;
	protected imageElement: HTMLImageElement;
	protected priceElement: HTMLElement;
	protected descriptionElement?: HTMLElement;
	protected actionButton?: HTMLButtonElement;

	constructor(
		blockClassName: string,
		parentContainer: HTMLElement,
		handlers: ProductCardHandlers,
	) {
		if (!blockClassName || !(parentContainer instanceof HTMLElement)) {
			throw new Error('Необходимы blockClassName и container для инициализации ProductCardComponent.');
		}
		super(parentContainer);

		this.categoryElement = this._findElementSafe<HTMLElement>(`.${blockClassName}__category`, parentContainer);
		this.titleElement = this._findElementSafe<HTMLElement>(`.${blockClassName}__title`, parentContainer);
		this.imageElement = this._findElementSafe<HTMLImageElement>(`.${blockClassName}__image`, parentContainer);
		this.priceElement = this._findElementSafe<HTMLElement>(`.${blockClassName}__price`, parentContainer);
		this.descriptionElement = parentContainer.querySelector(`.${blockClassName}__text`) as HTMLElement || null;
		this.actionButton = parentContainer.querySelector(`.${blockClassName}__button`) as HTMLButtonElement || null;
		
		
		if (this.actionButton) {
			this.actionButton.addEventListener('click', handlers.onClick);
		} else {
			if (parentContainer) {
				parentContainer.addEventListener('click', handlers.onClick);
			}
		}
	}

	set category(value: string) {
		if (value) {
			this._setText(this.categoryElement, value, 'категория');
			const category = categories[value] || '';
			if (category) {
				this.categoryElement.classList.add('card__category' + category);
			}
		}
	}
	set title(value: string) {
		if (value) {
			this._setText(this.titleElement, value, 'наименование товара');
		}
	}

	set image(value: string) {
		if (value && this.titleElement.textContent) {
			this._setImage(this.imageElement, value, this.titleElement.textContent);
		}
	}

	set price(value: number) {
		if (value == null || isNaN(value)) {
			this._setText(this.priceElement, 'Бесценно', 'цена');
			this._disableActionButton();
		} else {
			this._setText(this.priceElement, `${value} ${currency}`, 'цена');
			this._enableActionButton();
		}
	}
	set description(value: string) {
		if (value && this.descriptionElement) {
			this._setText(this.descriptionElement, value, 'описание');
		}
	}

	set button(value: string) {
		if (this.actionButton && value) {
			this._setText(this.actionButton, value, 'кнопка');
		}
	}

	get price(): number {
		return Number(this.priceElement.textContent ?? '');
	}

	// Вспомогательные методы
	private _setText(element: HTMLElement | null, text: string, elementName: string): void {
		if (element && text !== undefined) {
			element.textContent = text;
		} else {
			console.warn(`Элемент ${elementName} не найден. Проверьте разметку.`);
		}
	}

	private _setImage(imageElement: HTMLImageElement, src: string, alt: string): void {
		if (imageElement && src && alt) {
			imageElement.src = src;
			imageElement.alt = alt;
		}
	}

	private _findElementSafe<T extends HTMLElement>(selector: string, context: HTMLElement): T {
		const element = findElement<T>(selector, context);
		if (!element) {
			throw new Error(`Элемент с селектором ${selector} не найден в заданном контексте.`);
		}
		return element;
	}

	private _disableActionButton(): void {
		if (this.actionButton) {
			this.actionButton.setAttribute('disabled', 'disabled');
		}
	}

	private _enableActionButton(): void {
		if (this.actionButton) {
			this.actionButton.removeAttribute('disabled');
		}
	}

}
