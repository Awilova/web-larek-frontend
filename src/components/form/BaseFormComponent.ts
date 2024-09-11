import { IFormValidationState } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export class BaseFormComponent<T> extends Component<IFormValidationState> {
	protected submitButton: HTMLButtonElement;
	protected errorsForm: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this.submitButton = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		) as HTMLButtonElement;
		this.errorsForm = ensureElement<HTMLElement>(
			'.form__errors',
			this.container
		) as HTMLElement;

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
		this.events.emit(`${this.container.name}.${field as string}:change`, {
			field,
			value,
		});
	}

	set valid(value: boolean) {
		if (this.submitButton) {
			this.submitButton.disabled = !value;
		}
	}

	set errors(value: string) {
		if (this.errorsForm) {
			this.setText(this.errorsForm, value);
		} else {
			console.log(
				'Элемент ошибки не найден, невозможно установить текст ошибки.'
			);
		}
	}

	render(state: Partial<T> & IFormValidationState): HTMLFormElement {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });

		const inputValues = inputs as Record<string, any>;

		Object.keys(inputValues).forEach((key) => {
			const value = inputValues[key];
			if (typeof value === 'string') {
				const inputElement = this.container.elements.namedItem(
					key
				) as HTMLInputElement | null;
				if (inputElement) {
					inputElement.value = value;
				} else {
					console.warn(`Элемент с именем ${key} не найден в форме.`);
				}
			} else {
				console.warn(`Некорректное значение для ключа ${key}: ${value}`);
			}
		});

		return this.container;
	}
}
