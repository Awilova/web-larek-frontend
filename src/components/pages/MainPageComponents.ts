import { IPageContentConfig as IPageDataInterface } from '../../types';
import { ensureElement as getElementFromUtils } from '../../utils/utils';
import { Component as BaseComponent } from '../base/Component';
import { IEvents as IEventsInterface } from '../base/events';


export class Page extends BaseComponent<IPageDataInterface> {
	protected _counter: HTMLElement | null;
	protected _catalog: HTMLElement | null;
	protected _wrapper: HTMLElement | null;
	protected _basket: HTMLElement | null;

	constructor(container: HTMLElement, protected events: IEventsInterface) {
		super(container);

		this._basket = getElementFromUtils<HTMLElement>('.header__basket', container) as HTMLElement | null;
		this._counter = getElementFromUtils<HTMLElement>('.header__basket-counter', container) as HTMLElement | null;
		this._catalog = getElementFromUtils<HTMLElement>('.gallery', container) as HTMLElement | null;
		this._wrapper = getElementFromUtils<HTMLElement>('.page__wrapper', container) as HTMLElement | null;


		if (this._basket) {
			this._basket.addEventListener('click', this.handleBasketClick.bind(this));
		}
	}

	private handleBasketClick(): void {
		if (this.container) {
			this.events.emit('basket:open', this.container);
		}
	}

	set counter(value: number) {
		if (this._counter) {
			this.setText(this._counter, String(value));
		}
	}
	set catalog(items: HTMLElement[]) {
		if (this._catalog) {
			this._catalog.replaceChildren(...items);
		}
	}

	set locked(value: boolean) {
		if (this._wrapper) {
			this._wrapper.classList.toggle('page__wrapper_locked', value);
		}
	}
}