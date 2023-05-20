
class App {
    nodes
    constructor(nodes: Element[] = []) {
        this.nodes = nodes
    }

    addClass(className: string) {
        this.nodes.forEach(x => x.classList.add(className))
        return this
    }

    removeClass(className: string) {
        this.nodes.forEach(x => x.classList.remove(className))
        return this
    }

    classWhen(className: string, condition: boolean) {
        if (condition) {
            this.addClass(className)
        } else {
            this.removeClass(className)
        }
        return this
    }

    closest(selector: string) {
        return app(this.nodes[0]?.closest(selector))
    }

    find(selector: string) {
        return this.nodes[0]
            ? app(selector, this.nodes[0])
        : app()
    }

    focus() {
        const el = this.nodes[0]
        if (el instanceof HTMLElement) {
            el.focus()
        }
        return this
    }

    count() {
        return this.nodes.length
    }

    text(value: any) {
        this.nodes.forEach(x => {
            x.textContent = value ?? ""
        })
        return this
    }
}

function app(val : string | Element | null = null, el: Element | null = null) {
    if (val == null) {
        return new App([])
    }
    if (val instanceof Element) {
        return new App([val])
    }
    return new App(Array.from((el ?? document).querySelectorAll(val)))
}

app.ESC_KEY = 27
app.ENTER_KEY = 13

// @ts-ignore
window.$ = app

export type AppFunc = typeof app

declare global {
    interface Window {
        $: AppFunc
    }
}

