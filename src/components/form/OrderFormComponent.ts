import { Form } from "./BaseFormComponent";
import { IEvents } from "../base/events";
import { IOrderDeliveryDetails } from "../../types/index";

// Класс OrderForm представляет форму заказа с кнопками и полем адреса.
export class OrderForm extends Form<IOrderDeliveryDetails> {
    protected _buttons: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._buttons = Array.from(container.querySelectorAll('.button_alt'));

    // Добавляем обработчик событий для каждой кнопки
        this._buttons.forEach((element) =>
			element.addEventListener('click', (event: MouseEvent) => {
				const target = event.target as HTMLButtonElement;
				const name = target.name;
				this.setButtonClass(name);
				events.emit('payment:changed', { target: name });
			})
        );
    }

    // Устанавливаем класс активной кнопки и снимает класс с других кнопок
    setButtonClass(name: string): void {
        this._buttons.forEach((button) => {
            if (button.name === name) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
    }

    // Устанавливает значение поля адреса в форме заказа
    set address (address: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = address;
    }
}