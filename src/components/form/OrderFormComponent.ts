
import { BaseFormComponent } from './BaseFormComponent';
import { IEvents } from '../base/events';
import { IOrderDeliveryDetails } from '../../types/index';

export class OrderForm extends BaseFormComponent<IOrderDeliveryDetails> {
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
		const activeButton = this._buttons.find(button => button.name === name);
		this._buttons.forEach(button => button.classList.toggle('button_alt-active', button === activeButton));
	}

	set address(address: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			address;
	}
}
