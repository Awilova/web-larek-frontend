import { IPageContentConfig as IPageDataInterface } from '../../types';
import { ensureElement as getElementFromUtils } from '../../utils/utils';
import { Component as BaseComponent } from '../base/Component';
import { IEvents as IEventsInterface } from '../base/events';


export class MainPageComponents extends BaseComponent<IPageDataInterface> {
	protected counterElement: HTMLElement | null;
	protected catalogList: HTMLElement | null;
	protected wrapperPage: HTMLElement | null;
	protected basketElement: HTMLElement | null;

	constructor(container: HTMLElement, protected events: IEventsInterface) {
		super(container);

		this.basketElement = getElementFromUtils<HTMLElement>('.header__basket', container) as HTMLElement | null;
		this.counterElement = getElementFromUtils<HTMLElement>('.header__basket-counter', container) as HTMLElement | null;
		this.catalogList = getElementFromUtils<HTMLElement>('.gallery', container) as HTMLElement | null;
		this.wrapperPage = getElementFromUtils<HTMLElement>('.page__wrapper', container) as HTMLElement | null;


		if (this.basketElement) {
			this.basketElement.addEventListener('click', this.handleBasketClick.bind(this));
		}
	}

	private handleBasketClick(): void {
		if (this.container) {
			this.events.emit('basket:open', this.container);
		}
	}

	set catalog(items: HTMLElement[]) {
		if (this.catalogList) {
			this.catalogList.replaceChildren(...items);
		}
	}

	set counter(value: number) {
		if (this.counterElement) {
			this.counterElement.textContent= String(value);
		}
	}
	

	set locked(value: boolean) {
		if (this.wrapperPage) {
			this.wrapperPage.classList.toggle('page__wrapper_locked', value);
		}
	}
}