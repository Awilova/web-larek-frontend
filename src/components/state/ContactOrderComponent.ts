import { Form as BaseForm } from '../form/BaseFormComponent';
import { ICustomerDetails as ContactsOrderType } from '../../types';
import { IEvents as EventsInterface } from '../base/events';

/**
 * Класс `ContactsOrder` управляет формой контактов, обрабатывая ввод телефона и email.
 */
export class ContactsOrder extends BaseForm<ContactsOrderType> {
	constructor(container: HTMLFormElement, events: EventsInterface) {
		super(container, events); // Вызов базового конструктора
	}

	/**
	 * Устанавливает номер телефона в форму.
	 */
	set phone(value: string) {
		const phoneInput = this._getInputElement('phone');
		if (phoneInput) {
			phoneInput.value = value;
		}
	}

	/**
	 * Устанавливает адрес электронной почты в форму.
	 */
	set email(value: string) {
		const emailInput = this._getInputElement('email');
		if (emailInput) {
			emailInput.value = value;
		}
	}

	/**
	 * Приватный метод для получения элемента ввода формы по имени.
	 * @param name - имя элемента
	 * @returns HTMLInputElement или null
	 */
	private _getInputElement(name: string): HTMLInputElement | null {
		const inputElement = this.container.elements.namedItem(name) as HTMLInputElement | null;
		return inputElement;
	}
}