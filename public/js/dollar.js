"use strict";
(() => {
  class App {
    constructor(nodes = []) {
      this.nodes = nodes;
    }
    addClass(className) {
      this.nodes.forEach((x) => x.classList.add(className));
      return this;
    }
    removeClass(className) {
      this.nodes.forEach((x) => x.classList.remove(className));
      return this;
    }
    classWhen(className, condition) {
      if (condition) {
        this.addClass(className);
      } else {
        this.removeClass(className);
      }
      return this;
    }
    closest(selector) {
      return app(this.nodes[0]?.closest(selector));
    }
    find(selector) {
      return this.nodes[0] ? app(selector, this.nodes[0]) : app();
    }
    focus() {
      const el = this.nodes[0];
      if (el instanceof HTMLElement) {
        el.focus();
      }
      return this;
    }
    count() {
      return this.nodes.length;
    }
    text(value) {
      this.nodes.forEach((x) => {
        x.textContent = value ?? "";
      });
      return this;
    }
  }
  function app(val = null, el = null) {
    if (val == null) {
      return new App([]);
    }
    if (val instanceof Element) {
      return new App([val]);
    }
    return new App(Array.from((el ?? document).querySelectorAll(val)));
  }
  app.ESC_KEY = 27;
  app.ENTER_KEY = 13;
  window.$ = app;
})();
