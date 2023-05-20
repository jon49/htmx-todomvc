"use strict";
(() => {
  // src/js/dollar.ts
  var Query = class {
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
      return query(this.nodes[0]?.closest(selector));
    }
    find(selector) {
      return this.nodes[0] ? query(selector, this.nodes[0]) : query();
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
  };
  function query(val = null, el = null) {
    if (val == null) {
      return new Query([]);
    }
    if (val instanceof Element) {
      return new Query([val]);
    }
    return new Query(Array.from((el ?? document).querySelectorAll(val)));
  }
  query.ESC_KEY = 27;
  query.ENTER_KEY = 13;
  window.$ = query;

  // src/js/app.ts
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register(`${document.location.pathname}sw.js`).then((_) => {
      console.log("Service worker registered.");
    });
  } else {
    alert("Service worker is not supported. Please use a modern browser.");
  }
  document.addEventListener("todos-updated", todosUpdated);
  function todosUpdated() {
    const totalTodos = query("#todo-list > li").count(), incompleteTodos = query("#todo-list > li:not(.completed)").count();
    query("#count").text(incompleteTodos);
    query("#footer").classWhen("hidden", !totalTodos);
    query("#todo-section").classWhen("hidden", !totalTodos);
    query("#clear-completed").classWhen("hidden", totalTodos === incompleteTodos);
    if (totalTodos === 0) {
      query("#new-todo").focus();
    }
    updateFilter();
  }
  window.addEventListener("hashchange", handleHashChange);
  function updateFilter() {
    const hash = window.location.hash, listQuery = "#todo-list > li";
    query(listQuery).removeClass("hidden");
    if (hash === "#/active") {
      query(listQuery + ".completed").addClass("hidden");
    } else if (hash === "#/completed") {
      query(listQuery + ":not(.completed)").addClass("hidden");
    }
  }
  function handleHashChange() {
    const hash = window.location.hash;
    query(".filters > li > a").removeClass("selected");
    query(`.filters > li > a[href="${hash}"]`).addClass("selected");
    updateFilter();
  }
  handleHashChange();
  todosUpdated();
})();
