import { Form } from './common/Form';
import { IEvents } from './base/events';
import { IOrderAddress } from '../types';

export class OrderForm extends Form<IOrderAddress> {
	protected _buttons: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._buttons = Array.from(container.querySelectorAll('.button_alt'));

		this._buttons.forEach((element) =>
			element.addEventListener('click', (event: MouseEvent) => {
				const target = event.target as HTMLButtonElement;
				const name = target.name;
				this.setButtonClass(name);
				events.emit('payment:changed', { target: name });
			})
		);
	}
	setButtonClass(name: string): void {
		this._buttons.forEach((button) => {
			if (button.name === name) {
				button.classList.add('button_alt_active');
			} else {
				button.classList.remove('button_alt_active');
			}
		});
	}

	set address(address: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			address;
	}
}
