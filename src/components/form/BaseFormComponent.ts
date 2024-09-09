
import { IFormValidationState } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';


export class BaseFormComponent<T> extends Component<IFormValidationState> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		) as HTMLButtonElement;
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container) as HTMLElement;

		this.setupEventListeners();
	}

	private setupEventListeners(): void {
		this.container.addEventListener('input', this.handleInputChange.bind(this));
		this.container.addEventListener('submit', this.handleSubmit.bind(this));
	}

	private handleInputChange(e: Event): void {
		const target = e.target as HTMLInputElement;
		if (target.name) {
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		}
	}

	private handleSubmit(e: Event): void {
		e.preventDefault();
		this.events.emit(`${this.container.name}:submit`);
	}

	
	protected onInputChange(field: keyof T, value: string): void {
		this.events.emit(`${this.container.name}.${field as string}:change`, { field, value });
	}

	set valid(value: boolean) {
		if (this._submit) {
			this._submit.disabled = !value;
		}
	}

	set errors(value: string) {
		if (this._errors) {
			this.setText(this._errors, value);
		}
	}

	render(state: Partial<T> & IFormValidationState) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}
