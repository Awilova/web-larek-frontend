import { ensureElement } from '../../utils/utils';
import { IModalPopup } from '../../types';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';


export class Modal extends Component<IModalPopup> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));

		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open() {
		this.container.classList.toggle('modal_active', true);
		this.events.emit('modal:open');
	}

	close() {
		this.container.classList.toggle('modal_active', false);
		this._content.textContent = '';
		this.events.emit('modal:close');
	}


	render(data: IModalPopup): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}

