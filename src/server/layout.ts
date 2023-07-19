import html from "html-template-tag-stream"

export default function layout(todos?: AsyncGenerator<any, void, unknown> | AsyncGenerator<any, void, unknown>[] | null) {
    // @ts-ignore
    return html`
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>HTMX • TodoMVC</title>
		<link rel="stylesheet" href="./css/base.css">
		<link rel="stylesheet" href="./css/index.css">
		<!-- CSS overrides - remove if you don't need it -->
		<link rel="stylesheet" href="./css/app.css">
	</head>
	<body hx-ext="x-subscribe">
		<section class="todoapp">
			<header class="header">
				<h1>todos</h1>
				<input
                    id="new-todo"
                    class="new-todo"
                    placeholder="What needs to be done?"
                    autofocus
                    autocomplete="off"
                    name="title"
                    hx-target="#todo-list"
                    hx-post="/todos?handler=create"
                    hx-trigger="keyup[key=='Enter']"
                    hx-swap="beforeend"
                    hx-on="htmx:afterRequest: this.value = ''"
                    x-subscribe="todos-updated: app.getTotalTodos() === 0 && this.focus()"
                    >
			</header>
			<!-- This section should be hidden by default and shown when there are todos -->
			<section
                id="todo-section"
                class="main"
                x-subscribe="todos-updated: $(this).classWhen('hidden', app.getTotalTodos() === 0)"
                >
				<input
                    id="toggle-all"
                    class="toggle-all"
                    type="checkbox"
                    hx-post="/todos?handler=toggle-all"
                    hx-target="#todo-list"
                    >
				<label for="toggle-all">Mark all as complete</label>
				<ul id="todo-list" class="todo-list">${todos}</ul>
			</section>
			<!-- This footer should be hidden by default and shown when there are todos -->
			<footer
                id="footer"
                class="footer"
                x-subscribe="todos-updated: $(this).classWhen('hidden', app.getTotalTodos() === 0)"
                >
				<span
                    class="todo-count"
                    x-subscribe="todos-updated:
                            const count = app.getIncompleteTodos();
                            $(this).html('<strong>'+count+'</strong> item'+app.pluralize(count)+' left')"
                    ></span>
				<ul class="filters">
					<li>
						<a class="selected" href="#" data-action>All</a>
					</li>
					<li>
						<a href="#/active">Active</a>
					</li>
					<li>
						<a href="#/completed">Completed</a>
					</li>
				</ul>
				<!-- Hidden if no completed items are left ↓ -->
				<button
                    id="clear-completed"
                    class="clear-completed"
                    hx-post="/todos?handler=clear-completed"
                    hx-target="#todo-list"
                    x-subscribe="todos-updated: $(this).classWhen('hidden', app.getCompletedTodos() === 0)"
                    >Clear completed</button>
			</footer>
		</section>
        <footer class="info">
            <p>Double-click to edit a todo</p>
            <p><a href="https://github.com/jon49/htmx-todomvc/">Source Code</a></p>
            <p>Created by <a href="https://jnyman.com">Jon Nyman</a></p>
            <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
        </footer>
		<!-- Scripts here. Don't remove ↓ -->
		<script src="./js/lib/base.js"></script>
		<script src="./js/app.js"></script>
		<script src="./js/lib/htmx.js"></script>
	</body>
</html>`
}

