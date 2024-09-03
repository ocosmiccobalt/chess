import Carousel from './components/carousel.js';
import AutoRotatingCarousel from './components/auto-rotating-carousel.js';

function init(Component, selector, options) {
  const nodes = document.querySelectorAll(selector);

  for (const node of nodes) {
    const instance = new Component(node, options);
    instance.init();
  }
}

function work() {
  init(Carousel, '.carousel[data-hand-rotated]');
  init(AutoRotatingCarousel, '.carousel[data-auto-rotating]');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', work);
} else {
  work();
}
