import { BaseFormComponent as BaseForm } from './BaseFormComponent';
import { ICustomerDetails as ContactsOrderType } from '../../types';
import { IEvents as EventsInterface } from '../base/events';

export class ContactsOrder extends BaseForm<ContactsOrderType> {
	constructor(container: HTMLFormElement, events: EventsInterface) {
		super(container, events);
	}

	set phone(value: string) {
		const phoneInput = this._getInputElement('phone');
		if (phoneInput) {
			phoneInput.value = value;
		}
	}

	set email(value: string) {
		const emailInput = this._getInputElement('email');
		if (emailInput) {
			emailInput.value = value;
		}
	}

	private _getInputElement(name: string): HTMLInputElement | null {
		const form = this.container as HTMLFormElement;
		const inputElement = form.elements.namedItem(
			name
		) as HTMLInputElement | null;
		return inputElement;
	}
}
