
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
    console.log(url)
    $.get(url, response => {
        $('#destino').html(response);
        const form = $('.needs-validation').get(0)
        const tabela = $('.table').get(0)

        form && setValidation(form)

        if (tabela){
            loadData(tabela)
            const title = $('.lista').attr('title')
            $('.list-title').html(title)
        }
    })
}

const toRow = (item, botoes) => {
    const tr = $('<tr>')
    Object.values(item).forEach(value => tr.append(`<td>${value}</td>`))
    tr.append(botoes)

    return tr
}

const loadData = (tabela) => {
    const botoes = tabela.getAttribute('id') === 'tabela-alunos' ? getBotoesAluno : getBotoesProjeto

    const url = tabela.getAttribute('url')
    const tBody = $('tbody')
    tBody.html('')

    $.get(url)
        .then(items => items.map(item => {
            const myButtons = botoes(item.id)
            return toRow(item, myButtons) 
        }))
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

const botoesAlunos = `<td><div class="btn-acoes d-none"><button class="btn-adicionar"><i class="fa fa-plus"></i></button><button class="btn-remover"><i class="fa fa-close"></i></button></div></td>`

const getBotoesProjeto = (projeto) => {
    const td = $('<td>')
    const acoes = $('<div>').addClass('btn-acoes')
    const btnAdicionar = $('<button>').addClass('btn-adicionar').html('<i class="fa fa-plus"></i> Alunos')
    
    acoes.append(btnAdicionar)
    td.append(acoes)

    btnAdicionar.on('click', event => {
        event.preventDefault()
        getPage('/alunos')
    })

    return td
}

const getBotoesAluno = (aluno) => {
    const td = $('<td>')
    td.append(botoesAlunos)

    return td
}

