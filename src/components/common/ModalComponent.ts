import { ensureElement } from '../../utils/utils';
import { IModalPopup } from '../../types';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';


export class ModalComponents extends Component<IModalPopup> {
	protected closeButtonElement: HTMLButtonElement;
	protected modalContentElement: HTMLElement;

	constructor(container: HTMLElement, protected eventHandlers: IEvents) {

		if (!(container instanceof HTMLElement)) {
			throw new Error('Передан некорректный контейнер для PopupModal.');
		}
		if (!eventHandlers) {
			throw new Error('Event handlers не переданы в конструктор PopupModal.');
		}

		super(container);

		this.close = this.close.bind(this);
		this._closeHandler = this._closeHandler.bind(this);

		this.closeButtonElement = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this.modalContentElement = ensureElement<HTMLElement>('.modal__content', container);

		this._attachEventListeners();
	}


	open() {
		this.container.classList.toggle('modal_active', true);
		this.eventHandlers.emit('modal:open');
	}

	close() {
		this.container.classList.toggle('modal_active', false);
		this.modalContentElement.textContent = '';
		this.eventHandlers.emit('modal:close');
	}

	set content(value: HTMLElement) {
		this.modalContentElement.replaceChildren(value);
	}
	
	render(data: IModalPopup): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}

	private _attachEventListeners(): void {
		this.closeButtonElement.addEventListener('click', this.close);
		this.container.addEventListener('click', this.close);
		this.modalContentElement.addEventListener('click', (event) => event.stopPropagation());
	}

	private _closeHandler() {
		this.close();
	}
}

