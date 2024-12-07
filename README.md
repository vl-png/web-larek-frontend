# Проектная работа "Веб-ларек"

Описание:
"Веб-ларек" - это пример интернет-магазина, реализованного с использованием TypeScript и архитектуры MVP (Model-View-Presenter). Приложение позволяет пользователям просматривать список товаров, добавлять товары в корзину и оформлять заказы.

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


## Архитектура
Приложение разделено на три основных слоя согласно архитектуре MVP:

### Слой данных (Model)
Отвечает за хранение и управление данными приложения.

#### DataModel: Класс для работы с данными товаров.

  Атрибуты:

  - `store: IProduct[]` Массив объектов, представляющих товары, загруженные с сервера.

Методы:

  - `setStore(items: IProduct[]): void` Обновляет данные товаров.
  - `resetSelected(): void` Сброс состояния выбора.

####  FormModel: Класс для работы с данными форм. Хранит информацию о заказе, способе оплаты, адресе и контактных данных пользователя.

  Атрибуты:

  - `order: IOrder` Информация о заказе покупке товара.
  - `formErrors: FormErrors` Ошибки при заполнении форм.

  Методы:

  - `setItems(): void` Добавляет товары в заказ.
  - `setOrderField(field: keyof IOrderForm, value: string): void` Заполнение всех пользовательских данных в заказе.
  - `validateContacts(): boolean` Валидация контактов.
  - `validateOrder(): boolean` Валидация заказа.
  - `clearOrder(): void` Очистить после покупки.


#### BasketModel: Класс для работы с корзиной покупок. Предоставляет методы для добавления/удаления товаров в корзину, подсчета общей стоимости и т.д.

  Атрибуты:

  - `basket: IProduct[]` Информация о заказе покупке товара.

  Методы:

  - `addToBasket(value: IProduct): void` Добавляет товар в корзину.
  - `deleteFromBasket(id: string): void` Удаляет товар из корзины.
  - `clearBasket(): void` Отчистка корзины.
  - `getBasketAmount(): number` Получение количества товаров в корзине.
  - `getTotalBasketPrice(): number` Сумма всех товаров в корзине.

### Слой представления (View)
Отвечает за отображение пользовательского интерфейса и взаимодействие с пользователем.

#### Component: Абстрактный базовый класс для всех компонентов представления. Предоставляет общие методы для отображения компонентов.

  Конструктор:

  - `constructor(protected readonly container: HTMLElement)`

  Методы:

  - `render(): HTMLElement`
  - `setText(element: HTMLElement, value: unknown): void`
  

#### Card: Компонент описывающий карточку товара.

  Атрибуты:

  - `_title: HTMLElement` Элемент заголовка карточки.
  - `_image: HTMLImageElement` Элемент изображения карточки.
  - `_category: HTMLElement` Элемент категории карточки.
  - `_price: HTMLElement` Элемент цены карточки.
  - `_button: HTMLButtonElement` Элемент кнопки карточки.
  - `_colors: ICard['colors']` Объект, содержащий классы для различных категорий.

  Методы:

- Сеттеры и геттеры — отвечают за присвоение данных атрибутам элементов карточки товара, а также за получение значений этих атрибутов


#### Basket: Компонент описывающий корзину товаров.

  Атрибуты:

  - `_list: HTMLElement` Элемент содержащий список товаров в корзине.
  - `_price: HTMLElement` Элемент отображающий общую цену товаров.
  - `_button: HTMLButtonElement` Кнопка оформления заказа.

  Методы:

  - Сеттеры для атрибутов.
  - `disableButton()` Метод отключающий кнопку.
  - `updateItemIndices()` Метод для обновления индексов товаров в списке при их удалении.


#### Modal: Компонент описывающий корзину товаров.

  Атрибуты:

  - `_closeButton: HTMLButtonElement` Кнопка закрытия модального окна.
  - `_content: HTMLElement` Элемент, содержащий контент модального окна.

  Методы:

  - `set content(value: HTMLElement)` Метод устанавливает контент для модального окна.
  - `open()` Метод для открытия модального окна.
  - `close()` Метод для закрытия модального окна.


#### Form: Реализует общий компонент формы.

  Атрибуты:

  - `_submit: HTMLButtonElement` КнопкА отправки формы.
  - `_errors: HTMLElement` Контейнер для отображения сообщений об ошибках.

  Методы:

  - `onInputChange(field: keyof T, value: string)` Метод обрабатывает изменения в полях ввода и генерирует событие изменения.
  - `set valid(value: boolean)` Метод устанавливает состояние валидности формы.
  - `set errors(value: string)` Метод обновляет текст ошибок в контейнере ошибок.


#### Order: Компонент для отображения формы оформления заказа.

  Атрибуты:

  - `_card: HTMLButtonElement` Кнопка для оплаты картой.
  - `_cash: HTMLButtonElement` Кнопка для оплаты наличными.

  Методы:

  - `disableButtons()` Метод отключает активные состояния кнопок


#### Success: Компонент для отображения модального окна с успешным оформлением заказа.

  Атрибуты:

  - `_button: HTMLButtonElement` Кнопка закрытия компонента.
  - `_description: HTMLElement` Элемент, отображающий описание.

  Методы:

  - `set description(value: number)` Метод устанавливающий описание.


### Слой коммуникации и презентер (Presenter)

Отвечает за связь между слоем данных и слоем представления, а также за обработку бизнес-логики приложения.


#### EventEmitter: Класс для обработки событий и обеспечения взаимодействия между компонентами.

  Методы:

  - `on` подписка на событие.
  - `emit` инициализация события.
  - `trigger` возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие.

## Взаимодействие компонентов

Взаимодействие между компонентами осуществляется через события, которые генерируются с помощью класса EventEmitter. События позволяют избежать прямой зависимости между компонентами и облегчают управление их взаимодействием.

Основные события

- `items:changed` Вызывает перерисовку списка товаров на странице.
- `card:select` Выбор товара для отображения его детальной информации в модальном окне.
- `card:toBasket` Добавлении товара в корзину.
- `basket:delete` Удаление товара из корзины.
- `basket:open` Открытие модального окна корзины.
- `basket:order` Открывает окно с формой для заполнения адреса и способа оплаты.
- `order:submit` Подтверждает заполнение форм в окне Order.
- `contacts:submit` Подтверждает заполнение форм в окне Contacts.
- `orderInput:change` Начинает процесс валидации формы.
- `orderFormErrors:change` Изменилось состояние валидации заказа.
- `contactsFormErrors:change` Изменилось состояние валидации контактов.
- `order:success` Открывает модальное окно сообщающее об успешной оплате.
- `modal:close` Закрытие модального окна.


## Структуры данных и интерфейсы приложения

Товар

```
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: CategoryType;
  price: number | null;
  selected: boolean;
}
```
Данные пользователя

```
interface IOrder {
  items?: string[];
  payment?: string;
  total?: number;
  address?: string;
  email?: string;
  phone?: string;
}
```
Модель корзины

```
interface IBasketModel {
  basket: IProduct[];
  addToBasket(value: IProduct): void;
  deleteFromBasket(id: string): void;
  clearBasket(): void;
  getBasketAmount(): number;
  getTotalBasketPrice(): number;
}
```
Модель данных

```
interface IDataModel {
	store: IProduct[];
	setStore(items: IProduct[]): void;
  resetSelected(): void;
}
```
Модель формы

```
interface IFormModel {
	order: IOrder;
  formErrors: FormErrors;
	setItems(): void;
	setOrderField(field: keyof IOrderForm, value: string): void;
	validateContacts(): boolean;
	validateOrder(): boolean;
	clearOrder(): void;
}
```