import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { ISuccess, ISuccessActions } from '../../types';
import { CATALOG_VALUE, numberWithSpaces } from '../../index';

export class Success extends Component<ISuccess> {
	protected _close: HTMLElement;
	protected _total: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions, value: number) {
		super(container);

		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
			this._total.textContent = `Списано ${numberWithSpaces(
				value
			)} ${CATALOG_VALUE}`;
		}
	}
}
