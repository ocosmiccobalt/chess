class AutoRotatingCarousel {
  constructor(
    node,
    {
      mobileStep = 1,
      layoutViewportOptions = {
        mediaQueryString: '(min-width: 64rem)',
        step: 3
      },
      paused = false,
      timeInterval = 4000
    } = {}
  ) {
    this.CAROUSEL_NOJS_CLASS = 'carousel--nojs';
    this.CURRENT_ITEM_CLASS = 'carousel__auto-item--current';
    this.CONTAINER_NEXT_CLASS = 'carousel__auto-items--next';
    this.CONTAINER_PREV_CLASS = 'carousel__auto-items--prev';

    this.node = node;
    this.controlsNode = this.node.querySelector('.carousel__controls');
    this.buttonPrev = this.node.querySelector('.carousel__button--prev');
    this.buttonNext = this.node.querySelector('.carousel__button--next');
    this.countNode = this.node.querySelector('.carousel__count');
    this.totalNode = this.node.querySelector('.carousel__total');
    this.container = this.node.querySelector('.carousel__auto-items');
    this.liveRegionNode = this.container;
    this.items = [
      ...this.node.querySelectorAll('.carousel__auto-item')
    ];

    this.mobileStep = mobileStep;
    this.step = mobileStep;
    this.layoutViewportOptions = layoutViewportOptions;
    this.removeMqResultChangeListener = null;

    const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (hasReducedMotion.matches) {
      paused = true;
    }

    this.isPlayingEnabled = !paused;
    this.timeInterval = timeInterval;
    this.slideTimeout = null;
    this.forward = true;
    this.firstIndex = 0;
  }

  init() {
    this.node.classList.remove(this.CAROUSEL_NOJS_CLASS);
    this.node.setAttribute('aria-roledescription', 'carousel');
    this.countNode.textContent = this.step;
    this.totalNode.textContent = this.items.length;

    this.buttonPrev.addEventListener('click', this.onButtonPrevClick.bind(this));
    this.buttonPrev.addEventListener('focus', this.onFocusIn.bind(this));
    this.buttonPrev.addEventListener('blur', this.onFocusOut.bind(this));

    this.buttonNext.addEventListener('click', this.onButtonNextClick.bind(this));
    this.buttonNext.addEventListener('focus', this.onFocusIn.bind(this));
    this.buttonNext.addEventListener('blur', this.onFocusOut.bind(this));

    this.items.forEach((item) => {
      item.setAttribute('aria-roledescription', 'slide');
      // support stopping rotation when any element receives focus in the carousel item:
      item.addEventListener('focusin', this.onFocusIn.bind(this));
      item.addEventListener('focusout', this.onFocusOut.bind(this));
    });

    this.controlsNode.addEventListener('mouseover', this.onMouseOver.bind(this));
    this.container.addEventListener('mouseover', this.onMouseOver.bind(this));
    this.controlsNode.addEventListener('mouseout', this.onMouseOut.bind(this));
    this.container.addEventListener('mouseout', this.onMouseOut.bind(this));

    if (this.isPlayingEnabled) {
      this.liveRegionNode.setAttribute('aria-live', 'off');
    } else {
      this.liveRegionNode.setAttribute('aria-live', 'polite');
    }

    const checkMqResults = () => {
      if (this.removeMqResultChangeListener !== null) {
        this.removeMqResultChangeListener();
      }

      const mqString = this.layoutViewportOptions.mediaQueryString;
      const mqList = window.matchMedia(mqString);
      mqList.addEventListener('change', checkMqResults);

      this.removeMqResultChangeListener = () => {
        mqList.removeEventListener('change', checkMqResults);
      };

      this.onMediaQueryResultChange(mqList.matches);
    };

    checkMqResults();
    this.rotateSlides();
  }

  onMediaQueryResultChange(matches) {
    if (matches) { // if we are on desktop screen
      this.step = this.layoutViewportOptions.step;
    } else {
      this.step = this.mobileStep;
    }

    const indexes = [];

    for (let i = 0; i < this.step; i++) {
      let index = this.firstIndex + i;

      if (index >= this.items.length) {
        index = index - this.items.length;
      }

      indexes.push(index);
    }

    this.updateItems(indexes);
  }

  updateItems(indexes) {
    for (const item of this.items) {
      item.classList.remove(this.CURRENT_ITEM_CLASS);
    }

    for (const index of indexes) {
      const item = this.items[index];
      this.container.appendChild(item);
      item.classList.add(this.CURRENT_ITEM_CLASS);
    }

    this.countNode.textContent = Math.max(...indexes) + 1;
  }

  showItems(indexes) {
    this.firstIndex = indexes[0];

    this.updateItems(indexes);

    const containerClass = this.forward ?
      this.CONTAINER_NEXT_CLASS :
      this.CONTAINER_PREV_CLASS;

    this.container.classList.add(containerClass);

    const timer = setTimeout(() => {
      this.container.classList.remove(containerClass);
      clearTimeout(timer);
    }, 300);
  }

  showPreviousItems() {
    const indexes = [];

    for (let i = 0; i < this.step; i++) {
      let index = this.firstIndex - this.step + i;

      if (index < 0) {
        index = this.items.length + index;
      }

      indexes.push(index);
    }

    this.forward = false;
    this.showItems(indexes);
  }

  showNextItems() {
    const indexes = [];

    for (let i = 0; i < this.step; i++) {
      let index = this.firstIndex + this.step + i;

      if (index >= this.items.length) {
        index = index - this.items.length;
      }

      indexes.push(index);
    }

    this.forward = true;
    this.showItems(indexes);
  }

  rotateSlides() {
    if (!this.hasFocus && !this.hasHover && this.isPlayingEnabled) {
      this.showNextItems();
    }

    this.slideTimeout = setTimeout(
      this.rotateSlides.bind(this),
      this.timeInterval
    );
  }

  onMouseOver() {
    this.hasHover = true;
  }

  onMouseOut() {
    this.hasHover = false;
  }

  onButtonPrevClick() {
    this.showPreviousItems();
  }

  onButtonNextClick() {
    this.showNextItems();
  }

  onFocusIn() {
    this.liveRegionNode.setAttribute('aria-live', 'polite');
    this.hasFocus = true;
  }

  onFocusOut() {
    if (this.isPlayingEnabled) {
      this.liveRegionNode.setAttribute('aria-live', 'off');
    }

    this.hasFocus = false;
  }
}

export default AutoRotatingCarousel;
