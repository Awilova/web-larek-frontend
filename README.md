# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных используемые в приложении

"Web-Larek" использует интерфейсы для определения структуры данных и взаимодействий в приложении.

### `ITotalElementsList<T>`

Представляет общее количество элементов и их список.

- **Поля:**
  - `total: number` — Общее количество элементов.
  - `items: T[]` — Массив элементов.

### `ICartElementData`

Описывает отдельный товар в корзине.

- **Поля:**
  - `title: string` — Название товара.
  - `price: number` — Цена товара.

### `ProductApiService`

Определяет методы API для работы с товарами и заказами.

- **Методы:**
  - `getProductItem(id: string): Promise<IProduct>` — Получает информацию о товаре по ID.
  - `getProductList(): Promise<IProduct[]>` — Получает список товаров.
  - `orderProduct(order: OrderForm): Promise<IOrderResult>` — Отправляет данные заказа на сервер.

### `IModal`

Управляет отображением модальных окон.

- **Поля:**
  - `content: HTMLElement` — Содержимое модального окна.

### `IProduct`

Описывает структуру данных товара в каталоге.

- **Поля:**
  - `id: string` — Уникальный идентификатор.
  - `description: string` — Описание товара.
  - `image?: string` — URL изображения.
  - `index?: number` — Порядковый номер (опционально).
  - `title: string` — Название.
  - `category: string` — Категория.
  - `price: number | null` — Цена.
  - `button?: string` - кнопка добавить/Удалить.

### `IPageContentConfig`

Интерфейс страницы, описывающий элементы управления и содержимое.

- **Поля:**
  - `counter: number` — Счетчик товаров в корзине.
  - `catalog: HTMLElement[]` — Массив элементов каталога.
  - `locked: boolean` — Статус блокировки страницы.

### `ICartItemData`

Описывает структуру данных корзины покупок.

- **Поля:**
  - `items: HTMLElement[]` — Список товаров в корзине.
  - `total: number` — Общая стоимость товаров.

### `IOperationResultSummary`

Описывает данные для отображения успешного завершения операции.

- **Поля:**
  - `total: number` — Итоговая сумма.

### `IOperationHandlers`

Определяет действия в случае успешного выполнения операции.

- **Поля:**
  - `onClick: () => void` — Функция, вызываемая при клике на элемент.

### `ICustomerDetails`

Определяет структуру формы для контактных данных.

- **Поля:**
  - `phone: string` — Номер телефона.
  - `email: string` — Электронная почта.

### `IFormOrderStructure`

Описывает форму заказа.

- **Поля:**
  - `payment: PaymentOption` - Выбор способа оплаты.
  - `email: string` - Электронная почта.
  - `phone: string` - Контактный телефон.
  - `address: string` - Адрес доставки.
  - `total: number` - Стоимость выбранных товаров.
  - `items: string[]` - Выбранные товары.

### `IOrderTransactionResult`

Описывает результат обработки заказа.

- **Поля:**
  - `id: string` — Идентификатор заказа.
  - `total: number` — Итоговая сумма заказа.

# Архитектура приложения

```

Проект построен на основе архитектурного шаблона Model-View-Presenter (MVP), что позволяет разделить логику приложения и его интерфейс, создавая устойчивую и легко расширяемую структуру.

- **Model** — компонент, отвечающий за бизнес-логику и обработку данных, включая взаимодействие с серверным API.
- **View** — отвечает за визуальное отображение данных и управление пользовательским интерфейсом.
- **Presenter** — связывает Model и View, управляет пользовательскими действиями и обновляет представление на основе изменений в модели.
```

# Базовый код

## `class Api`

Класс `Api` предоставляет основные возможности для выполнения HTTP-запросов к серверу.

- **Конструктор:**

  - `baseUrl: string` — Базовый URL для API запросов.
  - `options: RequestInit` — Настройки запросов по умолчанию.

- **Методы:**
  - `get(uri: string): Promise<object>` — Выполняет GET-запрос.
  - `post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` — Выполняет POST-запрос.
  - `handleResponse(response: Response): Promise<object>` — Обрабатывает и возвращает ответ от сервера.

## `class EventEmitter`

Класс `EventEmitter` реализует механизм подписки и уведомления об изменениях, что позволяет управлять событиями в приложении.

- **Конструктор:**

  - Инициализирует структуру хранения событий.

- **Методы:**
  - `on(event: EventName, callback: (data: T) => void)` — Подписывает на событие.
  - `emit(event: string, data?: T)` — Инициирует событие.
  - `off(eventName: EventName, callback: Subscriber)` — Отписывает от события.
  - `onAll(callback: (event: EmitterEvent) => void)` — Подписывает на все события.

## `abstract class Component`

Базовый абстрактный класс `Component` предоставляет общую функциональность для всех компонентов пользовательского интерфейса.

- **Конструктор:**

  - Принимает DOM-элемент, представляющий контейнер компонента.

- **Методы:**
  Методы для работы с DOM, такие как `setText`, `setVisible`, `setDisabled`, и `render`.

## `abstract class Model`

Абстрактный класс `Model` служит основой для создания моделей данных, управляющих состоянием и взаимодействиями.

- **Конструктор:**

  - `constructor(data: Partial<T>, protected events: IEvents)` - Инициализирует модель данными и событийному менеджеру.

- **Методы:**
  - `emitChanges(event: string, payload?: object): void` — Генерирует событие об изменении модели.
  - `getData(): T` — возвращает текущие данные модели.

# Model-View-Presenter (MVP)

## Модель (Model)

Компоненты модели данных

### `class Product`

Класс `Product` представляет модель товара и наследует от абстрактного класса `Model`. Он включает специфические для товара свойства и методы.

- **Поля:**
  - `id: string` — Уникальный идентификатор товара.
  - `description: string` — Описание товара.
  - `image: string` — Изображение товара.
  - `title: string` — Название товара.
  - `category: string` — Категория товара.
  - `price: number | null` — Цена товара.

### `class AppStateModel`

Класс `AppStateModel`, расширяющий `Model` и реализующий интерфейс `IAppState`, управляет глобальным состоянием приложения.

- **Поля:**

  - `basket: Product[]` — Список товаров в корзине.
  - `catalog: Product[]` — Полный каталог товаров.
  - `order: IOrderForm` — Текущий заказ.
  - `prewiew: string | null` — Статус отображения.
  - `formErrors: FormErrors` — Ошибки в форме заказа.

- **Методы:**
  - `deleteFromBasket(product: Product)` — Удаляет товар из корзины.
  - `putInBasket(product: Product)` — Добавляет товар в корзину.
  - `defaultOrder()` — Инициализирует пустой заказ.
  - `clearBasket()` — Очищает корзину.
  - `getTotal()` — Возвращает общую стоимость товаров в корзине.
  - `setCatalog(catalog: Product[])` — Обновляет каталог товаров.
  - `fullBasket(): IProduct[]` - Возвращает все добаленные товары в корзину.
  - `checkBasket(item: IProduct)` - проверяет добавление товара в корзину.
  - `setPreview(item: Product)` - Отображает добавленный товар в корзину.
  - `setOrder(): void` — Задает цену и количество товаров в заказе.
  - `checkPayment(orderPayment: PaymentType): void` - Проверяет выбор способа оплаты.
  - `checkAddress(orderAddress: string): void` - Проверяет заполнение строки с адресом.
  - `checkEmail(orderEmail: string): void` - Проверяет заполнение эл. почты.
  - `checkPhone(orderPhone: string): void` - Проверяет заполнение номера телефона.
  - `validateOrderPayment()` — Валидирует способ оплаты.
  - `validateOrderForm()` — Валидирует поля ввода.
  - `setContactField(field: keyof IContactsOrder, value: string): void` - инициализирует поля контактов.

## View (Представление)

Компоненты представления

### `class Page`

Класс `Page` управляет основными элементами интерфейса, включая счётчик товаров, каталог и блокировку страницы.

- **Поля:**

  - `counter`: Обновляет количество товаров в корзине.
  - `catalog`: Обновляет и отображает товары в каталоге.
  - `locked`: Управляет блокировкой интерфейса.

- **Методы:**
  - Конструктор класса принимает элемент контейнера и объект событий.
  - `set counter(value: number)`: Обновляет счётчик товаров.
  - `set catalog(items: HTMLElement[])`: Обновляет каталог товаров.
  - `set locked(value: boolean)`: Блокирует или разблокирует интерфейс.

### `class ProductCardComponent`

Класс `ProductCardComponent` представляет карточку товара, отображая информацию о товаре и предоставляя интерфейс для взаимодействия.

- **Поля:**

  - `categoryElement: HTMLElement` — DOM-элемент для категории товара.
  - `titleElement: HTMLElement` — DOM-элемент для названия товара.
  - `imageElement: HTMLImageElement` — DOM-элемент для картинки товара.
  - `priceElement: HTMLElement` — DOM-элемент для цены товара.
  - `descriptionElement?: HTMLElement` — DOM-элемент для описания товара (опционально).
  - `actionButton?: HTMLButtonElement` - Кнопка добавления товара в корзину(опционально).

- **Методы:**
  - `set category(value: string)` - устанавливает категорию товара.
  - `set title(value: string)` — устанавливает название товара.
  - `set image(value: string)` - устанавливает картинку товара.
  - `set price(value: number)` — устанавливает цену товара.
  - `set description(value: string)` — устанавливает описание товара.
  - `set button(value: string)` - устанавливает текст кнопки.
  - `get price(): number` - получает цену товара.

### `class ShoppingBasketComponent`

Класс `ShoppingBasketComponent`, унаследованный от `Component` и реализующий `IBasketData`, управляет взаимодействием с корзиной покупок.

- **Поля:**

  - `itemListElement: HTMLElement` - DOM-элемент для списка товаров.
  - `totalPriceElement: HTMLElement` - DOM-элемент для общей стоимости товаров.
  - `orderButtonElement: HTMLElement` - Кнопка оформления заказа.

- **Методы:**
  - `set items(items: HTMLElement[])` - Обновляет список товаров.
  - `set total(total: number)` - Обновляет общую стоимость товаров.

### `class ShoppingBasketCardComponent`

Класс `ShoppingBasketCardComponent` отвечает за представление товара в корзине, отображая его информацию и обрабатывая события.

- **Поля:**

  - `titleElement: HTMLElement` - DOM-элемент для названия товара.
  - `priceElement: HTMLElement` - DOM-элемент для цены товара.
  - `buttonElement: HTMLElement` - Кнопка для удаления товара.
  - `indexElement: HTMLElement` - DOM-элемент для порядкового номера товара.

- **Методы:**
  - `set title(value: string)` - Устанавливает название товара.
  - `set price(value: number)` - Устанавливает цену товара.
  - `set index(value: number)` - Устанавливает порядковый номер товара.

### `class ModalComponents`

Класс `ModalComponents` наследует от `Component` и реализует управление модальными окнами.

- **Поля:**

  - `closeButtonElement: HTMLElement` — Содержимое модального окна.
  - `modalContentElement: HTMLButtonElement` - Кнопка закрытия модального окна.

- **Методы:**
  - `open()` - Открывает модальное окно.
  - `close()` - Закрывает модальное окно.
  - `render(data: IModal)` - Рендерит модальное окно с переданными данными.
  - `set content(value: HTMLElement)` - Устанавливает DOM элементы модального окна.

### `class BaseFormComponent`

Класс `BaseFormComponent`, расширяющий `Component` и реализующий `IFormState`, управляет формой заказа.

- **Поля:**

  - `submitButton: HTMLButtonElement` - Кнопка отправки формы.
  - `errorsForm: HTMLElement` - Сообщение об ошибках.

- **Методы:**
  - `onInputChange(field: keyof T, value: string)` - Обрабатывает изменения в форме.
  - `set valid(value: boolean)` - Устанавливает валидность для блокировки/разблокировки кнопки.
  - `set errors(value: string)` - Устанавливает текст ошибки.
  - `render(state: Partial<T> & IFormState)` - Рендерит форму с текущим состоянием.

### `class OrderForm`

Класс `OrderForm` представляет форму заказа и управляет её элементами.

- **Поля:**

  - `FormButtons: HTMLButtonElement[]`: Кнопки выбора способа оплаты.

- **Методы:**

  - `setButtonClass(name: string): void` — Устанавливает класс активной кнопки.
  - `set address(address: string)` - Устанавливает адрес доставки товара.

### `class ContactsOrder`

  Класс `ContactsOrder` расширяет `Form` и добавляет методы для управления контактными данными.

### `class SuccessComponent`

Класс `SuccessComponent` отображает сообщение о завершении заказа.

- **Поля:**
  - `closeButtonElement` — Кнопка при завершении заказа.
  - `totalDisplayElement: HTMLElement` - — Общая сумма списания.

## Presenter (Презентер)

Презентер управляет взаимодействиями между моделью и представлением, обеспечивая их синхронизацию. В данном проекте роль презентера реализована в файле index.ts.

```
*Список возможных событий приложения:*

- `items:changed` - подсчёт количества товаров в корзине;
- `card:select` - выбор карточки для отображения в модальном окне;
- `preview:changed` - обновление отображения товаров в модальном окне корзины при добавлении или удалении каждого следующего;
- `webproduct:added`- добавление товара в корзину;
- `webproduct:deletet`  - удаление товара из корзины;
- `itemsBasket:changed`- подсчёт стоимости заказа;
- `basket:open` - отображение модального окна корзины при открытии;
- `order:open` - отображение модального окна заказа при открытии;
- `payment:changed` - переключение способа оплаты при оформлении заказа;
- `order:submit` - отправка заказа;
- `formAddresErrors:change` - проверка на наличие ошибок в инпуте адреса формы;
- `formContactErrors:change` - проверка на наличие ошибок в инпуте контакта формы;
- `order.address:change`- внесение адреса при оформлении заказа;
- `contacts:submit` - отправка контактов, для оформления заказа;
- `modal:open` - открытие модального окна;
- `modal:close` - закрытие модального окна;
```
