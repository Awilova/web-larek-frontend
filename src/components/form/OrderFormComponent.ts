
import { IEvents } from '../base/events';
import { BaseFormComponent } from './BaseFormComponent';
import { IOrderDeliveryDetails } from '../../types/index';

export class OrderForm extends BaseFormComponent<IOrderDeliveryDetails> {
	protected FormButtons: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		if (!(container instanceof HTMLFormElement)) {
			throw new Error('Контейнер должен быть HTMLFormElement.'); 
		  }
		super(container, events);
		this.FormButtons = Array.from(container.querySelectorAll('.button_alt'));

		
		this.FormButtons.forEach((element) =>
			element.addEventListener('click', (event: MouseEvent) => {
				const target = event.target as HTMLButtonElement;
				const name = target.name;
				this.setButtonClass(name);
				events.emit('payment:changed', { target: name });
			})
		);
	}

	setButtonClass(name: string): void {
		const activeButton = this.FormButtons.find(button => button.name === name);
		this.FormButtons.forEach(button => button.classList.toggle('button_alt-active', button === activeButton));
	}

	set address(address: string) {
		const addressInput = this._getInputElement('address');
		if (addressInput) {
		  addressInput.value = address;
		}
	  }

	private _getInputElement(name: string): HTMLInputElement | null {
		const form = this.container as HTMLFormElement;
		const inputElement = form.elements.namedItem(name) as HTMLInputElement | null;
		return inputElement;
	  }
}
