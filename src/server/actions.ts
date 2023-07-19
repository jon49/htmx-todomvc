import html from "html-template-tag-stream"
// @ts-ignore
import { get, getMany, set, del } from "idb-keyval"
import layout from "./layout.js"

interface RequestOptions {
    request: Request
    url: URL
    data: any
}
type Handler = (o: RequestOptions) => Promise<AsyncGenerator<any, void, unknown> | null>

export const getAll = async () => {
    const todos : number[] = (await get("todos")) ?? []
    if (todos.length === 0) return layout()
    const todoData = await getMany(todos)
    const todoViews = todoData.map(todoView)
    return layout(todoViews)
}

export const createTodo : Handler = async({ data }) => {
    if (data.title === "") return null
    const todos : number[] = (await get("todos")) ?? []
    const newTodoId = Date.now()
    todos.push(newTodoId)
    await set("todos", todos)
    const newData = { ...data, completed: false, id: newTodoId }
    await set(newTodoId, newData)
    return todoView(newData)
}

export const updateTodo : Handler = async ({ url, data }) => {
    const idMaybe = url.searchParams.get("id")
    if (!idMaybe) return null
    const id = parseInt(idMaybe)
    const oldData = await get(id)
    const combinedData = { ...oldData, ...data }
    await set(id, combinedData)
    return todoView(combinedData)
}

export const deleteTodo : Handler = async ({ url }) => {
    const todos : number[] = (await get("todos")) ?? []
    const idMaybe = url.searchParams.get("id")
    if (!idMaybe) return null
    const id = parseInt(idMaybe)
    const cleanedTodos = todos.filter(x => x !== id)
    await set("todos", cleanedTodos)
    await del(id)
    return html``
}

export const toggleComplete : Handler = async ({ url }) => {
    const idMaybe = url.searchParams.get("id")
    if (!idMaybe) return null
    const id = parseInt(idMaybe)
    const oldData = await get(id)
    const newData = { ...oldData, completed: !oldData.completed }
    await set(id, newData)
    return todoView(newData)
}

export const toggleAll : Handler = async ({ }) => {
    const todos : number[] = (await get("todos")) ?? []
    const todoData : Todo[] = await getMany(todos)
    const completed = !todoData.every(x => x.completed)
    const newData = todoData.map(x => ({ ...x, completed: completed }))
    await Promise.all(newData.map(x => set(x.id, x)))
    return html`${newData.map(todoView)}`
}

export const clearCompleted : Handler = async ({ }) => {
    const todos : number[] = (await get("todos")) ?? []
    const todoData : Todo[] = await getMany(todos)
    const completed = todoData.filter(x => x.completed).map(x => x.id)
    await Promise.all(completed.map(x => del(x)))
    await set("todos", todos.filter(x => !completed.includes(x)))
    return html`${todoData.filter(x => !x.completed).map(todoView)}`
}

interface Todo {
    completed: boolean
    title: string
    id: number
}

function todoView({completed, title, id}: Todo) {
    let statusClass = completed ? ` class="completed"` : ""
    // @ts-ignore
    return html`
    <li$${statusClass} hx-target="this" hx-swap="outerHTML">
        <div class="view">
            <input
                class="toggle"
                type="checkbox"
                ${completed ? "checked" : ""}
                hx-post="/todos?handler=toggle-complete&id=${id}"
                >
            <label
                hx-on="dblclick: $(this).closest('li').addClass('editing').find('.edit').focus()"
                >${title}</label>
            <button class="destroy" hx-post="/todos?handler=delete&id=${id}"></button>
        </div>
        <input
            class="edit"
            value="${title}"
            name="title"
            hx-trigger="keyup[key=='Enter']"
            hx-post="/?handler=update&id=${id}"
            hx-on="
                blur: $(this).closest('li').removeClass('editing')
                keydown: event.keyCode === $.ESC_KEY && $(this).closest('li').removeClass('editing')"
            >
    </li>`
}

