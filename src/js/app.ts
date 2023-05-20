const $ = window.$

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
    .register('/sw.js')
    .then(_ => {
        console.log("Service worker registered.")
    })
} else {
    alert("Service worker is not supported. Please use a modern browser.")
}

document.addEventListener('todos-updated', todosUpdated)

function todosUpdated() {
    const totalTodos = $('#todo-list > li').count(),
        incompleteTodos = $('#todo-list > li:not(.completed)').count()

    // Update Count for incomplete todos
    $('#count').text(incompleteTodos)
    // Hide footer when there are no todos
    $('#footer').classWhen('hidden', !totalTodos)
    // Hide todo-section when there are no todos
    $('#todo-section').classWhen('hidden', !totalTodos)
    // Hide clear-completed when there are no completed todos
    $('#clear-completed').classWhen('hidden', totalTodos === incompleteTodos)

    updateFilter()
}

window.addEventListener('hashchange', handleHashChange)

function updateFilter() {
    const hash = window.location.hash,
        listQuery = '#todo-list > li'
    $(listQuery).removeClass('hidden')
    if (hash === '#/active') {
        $(listQuery+'.completed').addClass('hidden')
    } else if (hash === '#/completed') {
        $(listQuery+':not(.completed)').addClass('hidden')
    }
}

function handleHashChange() {
    const hash = window.location.hash
    $('.filters > li > a').removeClass('selected')
    $(`.filters > li > a[href="${hash}"]`).addClass('selected')
    updateFilter()
}

handleHashChange()
todosUpdated()

