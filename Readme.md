# Лендинг для международного васюкинского турнира по шахматам (с участием гроссмейстера О. Бендера)

## ТЗ

Сверстайте адаптивный лендинг по макету в Figma, используя стек html + css + чистый js (без библиотек и фреймворков).

- Придерживайтесь принципа Pixel Perfect.

- Избегайте дублирования текстового контента в мобильной и десктопной версиях.

- Добавьте бегущую строку и другую анимацию по своему усмотрению.

- Кнопки на стартовом экране являются якорями и ведут к соответствующим блокам.

- Карусель с карточками участников должна быть зацикленной и меняться автоматически через каждые 4 секунды.

- Карусель с этапами не должна быть зацикленной и не должна автоматически менять слайды.

## Заметки по итогам работы

1. Ширина мобильного макета в Figma - 375 пикселей, десктопного - 1366 пикселей. На этих вьюпортах верстка наиболее точно соответствует макету. Но я использую и другие медиавыражения.

2. Карусель с этапами двигается так: по клику пользователя меняется положение контейнера (списка) с помощью CSS-свойства `transform`. Количество элементов в списке остается неизменным, как и его реальная ширина. Каждый *слайд* находится *внутри* каждого элемента списка. В целях доступности я скрываю с помощью свойства `display` все слайды, кроме активного в данный момент.

3. Карусель с карточками участников (зациклена, вращается автоматически) работает иначе: *слайды* находятся прямо в контейнере, скрываются и показываются в нужном количестве и порядке. Если число всех участников перестанет быть кратным числу слайдов, показываемых одновременно, то может понадобиться показать первый и последний слайд вместе. Это учтено в коде. 

4. Карусель с карточками участников приостанавливает движение на время, пока пользователь наводит на нее мышь и пока управляющие каруселью кнопки или ссылки внутри карточек находятся в фокусе. Эта же карусель вращается только вручную, если выполняется условие `'(prefers-reduced-motion: reduce)'`.

5. Для проверки медиаусловий (чтобы показывать больше или меньше слайдов за один шаг и др.) я использую метод `window.matchMedia()`. Адаптирую решение, найденное на [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio#monitoring_screen_resolution_or_zoom_level_changes).

6. В обеих каруселях стараюсь использовать ARIA-атрибуты по [ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/examples/carousel-1-prev-next/).

7. Если карусель не проинициализируется с помощью JS, то ее кнопки останутся скрытыми, а слайды можно будет скроллить (свойства `scroll-snap-type` для контейнера и `scroll-snap-align` для элементов).
