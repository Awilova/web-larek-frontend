import { ensureElement as findElement } from "../../utils/utils";
import { Component as BaseComponent } from "../base/Component";
import { IOperationResultSummary as SuccessData, IOperationHandlers as SuccessActionsInterface } from "../../types";
import { VALUE_CATALOG as CatalogValue, numberWithSpaces as formatNumberWithSpaces } from "../cards/ProductCardComponent";

// Класс SuccessComponent представляет компонент успешного выполнения операции

export class SuccessComponent extends BaseComponent<SuccessData> {
    protected _closeButton: HTMLElement;
    protected _totalDisplay: HTMLElement;

    constructor(container: HTMLElement, actions: SuccessActionsInterface, value: number) {
        if (!container || !(container instanceof HTMLElement)) {
            throw new Error("Необходимо передать корректный контейнер для инициализации SuccessComponent");
        }
        if (!actions || !actions.onClick || typeof actions.onClick !== "function") {
            throw new Error("Необходим объект actions с корректной функцией onClick для инициализации SuccessComponent");
        }
        if (isNaN(value) || value < 0) {
            throw new Error("Необходимо передать корректное значение для отображения суммы");
        }
        super(container);

        // Инициализация элементов
        this._closeButton = this._findElementSafe<HTMLElement>(".order-success__close", this.container);
        this._totalDisplay = this._findElementSafe<HTMLElement>("order-success__description", this.container);

        // Установка текста и обработчиков событий
        this._initializeComponent(actions, value);
    }

    // Приватный метод инициализации компонента

    private _initializeComponent(actions: SuccessActionsInterface, value: number): void {
        if (actions && actions.onClick) {
            this._closeButton.addEventListener("click", (event) => {
                if (event) {
                    actions.onClick();
                }
            });
            this._setTotalText(value);
        }
    }

    // Приватный метод установки текста общей суммы

    private _setTotalText(value: number): void {
        if (isNaN(value) || value < 0) {
            throw new Error("Значение для общей суммы должно быть корректным положительным числом");
        }
    this._setText(this._totalDisplay, `Списано ${formatNumberWithSpaces(value)} ${CatalogValue}`);
    }

    private _setText(element: HTMLElement, text: string): void {
        if (!element || typeof text !== "string") {
            throw new Error("Передан некорректный элемент или текст для установки");
        }
        element.textContent = text;
    }

    private _findElementSafe<T extends HTMLElement>(selector: string, context: HTMLElement): T {
        const element = findElement<T>(selector, context);
        if (!element) {
            throw new Error(`Элемент с селектором ${selector} не найден в заданном контексте.`);
        }
        return element;
    }
}