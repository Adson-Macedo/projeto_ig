const getData = () => {
    const inputs = Array.from(document.querySelectorAll('input'))
    const data = {}

    inputs.forEach((input) => data[input.getAttribute('id')] = input.value)
    return data
}

const setValidation = (form) => {
    form && form.addEventListener('submit', event => {
        event.preventDefault()
        event.stopPropagation();

        form.classList.add('was-validated');

        if (form.checkValidity()) {
            const url = form.getAttribute('url')
            const method = form.getAttribute('method')

            $.ajax({
                method, 
                url, 
                data: getData(), 
            })
        }
    }, false)
}

const getPage = (url) => {
    $.get(url, response => {
        $('#destino').html(response);
        const form = $('.needs-validation').get(0)
        const tabela = $('.table').get(0)

        form && setValidation(form)
        tabela && loadData(tabela)
    })
}

const toRow = (item) => {
    return Object.values(item)
        .reduce((acc, value) => acc + `<td>${value}</td>`, '<tr>' ) + '</tr>'
}

const loadData = (tabela) => {
    const url = tabela.getAttribute('url')
    const tBody = $('tbody')
    tBody.html('')
    $.get(url)
        .then(items => items.map(item => toRow(item)))
        .then(rows => rows.forEach(row => {
            tBody.append(row)
        }))
}

$('.nav-link').toArray().forEach(link => {
    const url = link.href

    link.onclick = (event) => {
        event.preventDefault()
        getPage(url)
    }
})

