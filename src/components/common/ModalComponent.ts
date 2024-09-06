import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { IModalPopup } from '../../types';

// Класс Modal представляет собой компонент для управления модальными окнами

export class Modal extends Component<IModalPopup> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.close = this.close.bind(this);
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);
        this._closeButton.addEventListener('click', this.close);
        this.container.addEventListener('click', this.close);
        this._content.addEventListener('click', (e) => e.stopPropagation());
	}

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }
    
	close() {
		this.container.classList.remove('modal_active');
		this.content = null;
		this.events.emit('modal:close', this.container);
	}

    render(data: IModalPopup): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}

