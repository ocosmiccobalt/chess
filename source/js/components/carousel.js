class Carousel {
  constructor(node, { noCarouselMediaQueryString = '(min-width: 78rem)' } = {}) {
    this.CAROUSEL_NOJS_CLASS = 'carousel--nojs';
    this.CURRENT_SLIDE_CLASS = 'carousel__slide--current';
    this.node = node;
    this.buttonPrev = this.node.querySelector('.carousel__button--prev');
    this.buttonNext = this.node.querySelector('.carousel__button--next');
    this.bullets = [
      ...this.node.querySelectorAll('.carousel__bullet')
    ];
    this.list = this.node.querySelector('.carousel__list');
    this.items = [
      ...this.node.querySelectorAll('.carousel__item')
    ];
    this.mqString = noCarouselMediaQueryString;
    this.removeMqResultChangeListener = null;
    this.index = 0;
  }

  init() {
    this.node.classList.remove(this.CAROUSEL_NOJS_CLASS);
    this.node.setAttribute('aria-roledescription', 'carousel');

    this.items.forEach((item, i) => {
      const slide = item.firstElementChild;
      slide.setAttribute('aria-roledescription', 'slide');
      this.bullets[i].setAttribute('aria-label', slide.getAttribute('aria-label'));
    });

    const checkMqResults = () => {
      if (this.removeMqResultChangeListener !== null) {
        this.removeMqResultChangeListener();
      }

      const mqList = window.matchMedia(this.mqString);
      mqList.addEventListener('change', checkMqResults);

      this.removeMqResultChangeListener = () => {
        mqList.removeEventListener('change', checkMqResults);
      };

      this.onMediaQueryResultChange(mqList.matches);
    };

    checkMqResults();
    this.setBulletState(this.index);
    this.setButtonState(this.index);

    this.buttonPrev.addEventListener('click', this.onButtonPrevClick.bind(this));
    this.buttonNext.addEventListener('click', this.onButtonNextClick.bind(this));
    this.bullets.forEach((bullet) => {
      bullet.addEventListener('click', this.onBulletClick.bind(this));
    });
  }

  onMediaQueryResultChange(matches) {
    if (matches) { // if we are not on mobile screen
      // do not transform list of items:
      this.setSlideState(0);
    } else {
      this.setSlideState(this.index);
    }
  }

  setSlideState(index) {
    const x = `${-100 * index}%`;
    this.list.style.transform = `translateX(${x})`;

    this.items.forEach((item, i) => {
      const isCurrent = i === index;
      const slide = item.firstElementChild;

      if (isCurrent) {
        slide.classList.add(this.CURRENT_SLIDE_CLASS);
      } else {
        slide.classList.remove(this.CURRENT_SLIDE_CLASS);
      }
    });
  }

  setBulletState(index) {
    this.bullets.forEach((bullet, i) => {
      const isCurrent = i === index;
      bullet.setAttribute('aria-disabled', isCurrent);
      bullet.setAttribute('aria-current', isCurrent);
    });
  }

  setButtonState(index) {
    const atFirstSlide = index < 1;
    const atLastSlide = index >= this.items.length - 1;
    this.buttonPrev.setAttribute('aria-disabled', atFirstSlide);
    this.buttonNext.setAttribute('aria-disabled', atLastSlide);
  }

  onSlideChoice(index) {
    this.setSlideState(index);
    this.setBulletState(index);
    this.setButtonState(index);
    this.index = index;
  }

  onButtonPrevClick() {
    if (this.index > 0) {
      this.onSlideChoice(this.index - 1);
    }
  }

  onButtonNextClick() {
    if (this.index < this.items.length - 1) {
      this.onSlideChoice(this.index + 1);
    }
  }

  onBulletClick(evt) {
    const target = evt.currentTarget;
    const bulletIndex = this.bullets.indexOf(target);

    if (bulletIndex !== this.index) {
      this.onSlideChoice(bulletIndex);
    }
  }
}

export default Carousel;
