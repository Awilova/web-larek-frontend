import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { IFormValidationState } from '../../types';

//   Класс предназначен для управления формой заказа

export class Form<T> extends Component<IFormValidationState> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		// Инициализация элементов формы
		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		) as HTMLButtonElement;
		this._errors = ensureElement<HTMLElement>(
			'.form__errors',
			this.container
		) as HTMLElement;

		// Привязка обработчиков событий
		this.setupEventListeners();
	}

	//  Настройка обработчиков событий для формы

	private setupEventListeners(): void {
		this.container.addEventListener('input', this.handleInputChange.bind(this));
		this.container.addEventListener('submit', this.handleSubmit.bind(this));
	}

	// Обрабатывает изменение значения поля формы

	private handleInputChange(e: Event): void {
		const target = e.target as HTMLInputElement;
		if (target.name) {
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		}
	}


	// Обрабатывает отправку формы

	private handleSubmit(e: Event): void {
		e.preventDefault();
		this.events.emit(`${this.container.name}:submit`);
	}


	// Метод, вызываемый при изменении значения поля формы
	
	protected onInputChange(field: keyof T, value: string): void {
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
		});
	}


// Установка состояния валидности формы

	set valid(value: boolean) {
		if (this._submit) {
			this._submit.disabled = !value;
		}
	}


	//  Установка текста сообщения об ошибках

	set errors(value: string) {
		if (this._errors) {
			this.setText(this._errors, value);
		}
	}

	// Метод для отображения состояния формы
	
	render(state: Partial<T> & IFormValidationState): HTMLFormElement {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });

		// Приведение типа для обновления состояния
		Object.assign(this, inputs as T);

		return this.container;
	}
}
