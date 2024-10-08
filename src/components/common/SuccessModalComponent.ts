import { ensureElement as findElement } from '../../utils/utils';
import { Component as BaseComponent } from '../base/Component';
import {
	IOperationResultSummary as SuccessData,
	IOperationHandlers as SuccessActionsInterface,
} from '../../types';
import { currency } from '../../utils/constants';

export class SuccessComponent extends BaseComponent<SuccessData> {
	protected closeButtonElement: HTMLElement;
	protected totalDisplayElement: HTMLElement;

	constructor(
		container: HTMLElement,
		actions: SuccessActionsInterface,
		value: number
	) {
		if (!container || !(container instanceof HTMLElement)) {
			throw new Error(
				'Необходимо передать корректный контейнер для инициализации SuccessComponent.'
			);
		}
		if (!actions || !actions.onClick || typeof actions.onClick !== 'function') {
			throw new Error(
				'Необходим объект actions с корректной функцией onClick для инициализации SuccessComponent.'
			);
		}
		if (isNaN(value) || value < 0) {
			throw new Error(
				'Необходимо передать корректное значение для отображения суммы.'
			);
		}

		super(container);

		this.closeButtonElement = this._findElementSafely<HTMLElement>(
			'.order-success__close',
			this.container
		);
		this.totalDisplayElement = this._findElementSafely<HTMLElement>(
			'.order-success__description',
			this.container
		);

		this._initializeComponent(actions, value);
	}

	// Приватные методы для инициализации компонента, установки общей суммы, текта, его поиска и проверки на существование

	private _initializeComponent(
		actions: SuccessActionsInterface,
		value: number
	): void {
		if (actions && actions.onClick) {
			this.closeButtonElement.addEventListener('click', (event) => {
				if (event) {
					actions.onClick();
				}
			});
			this._setTotalText(value);
		}
	}

	private _setTotalText(value: number): void {
		if (isNaN(value) || value < 0) {
			throw new Error(
				'Значение для общей суммы должно быть корректным положительным числом.'
			);
		}
		this._setText(this.totalDisplayElement, `Списано ${value} ${currency}`);
	}

	private _setText(element: HTMLElement, text: string): void {
		if (!element || typeof text !== 'string') {
			throw new Error('Передан некорректный элемент или текст для установки.');
		}
		element.textContent = text;
	}

	private _findElementSafely<T extends HTMLElement>(
		selector: string,
		context: HTMLElement
	): T {
		const element = findElement<T>(selector, context);
		if (!element) {
			throw new Error(
				`Элемент с селектором ${selector} не найден в заданном контексте.`
			);
		}
		return element;
	}
}
