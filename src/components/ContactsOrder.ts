import { Form } from './common/Form';
import { IContactsOrder } from '../types';
import { IEvents } from './base/events';

export class ContactsOrder extends Form<IContactsOrder> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
		const phoneInput = this.container.elements.namedItem(
			'phone'
		) as HTMLInputElement;
		if (phoneInput) {
			phoneInput.value = value;
		}
	}

	set email(value: string) {
		const emailInput = this.container.elements.namedItem(
			'email'
		) as HTMLInputElement;
		if (emailInput) {
			emailInput.value = value;
		}
	}
}
