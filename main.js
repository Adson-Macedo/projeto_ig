
const getData = () => {
    const inputs = Array.from(document.querySelectorAll('input'))
    const data = {}

    inputs.forEach((input) => data[input.getAttribute('id')] = input.value)
    return data
}

const configureForm = (form) => {
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
            }).then( res => {
                const lista = form.getAttribute('lista')
                alert('Salvo com Sucesso!')
                getPage(lista)
            }).catch(err => alert('Registro duplicado!'))

        }
    }, false)
}

const getPage = (url) => {
    $.get(url, response => {
        $('#destino').html(response);
        const form = $('.needs-validation').get(0)
        const tabela = $('.table').get(0)

        form && configureForm(form)

        if (tabela) {
            loadData(tabela)
            const title = $('.lista').attr('titulo')
            $('.list-title').html(title)
        }
    })
}

const toRow = (item, botoes) => {
    const tr = $('<tr>')
    Object.values(item).forEach(value => tr.append(`<td>${value}</td>`))
    botoes && tr.append(botoes)

    return tr
}

const loadData = (tabela) => {
    let myButtons

    const url = tabela.getAttribute('url')
    const tBody = $(tabela).find('tbody')
    tBody.html('')

    $.get(url)
        .then(items => items.map(item => {
            if (tabela.getAttribute('id') === 'tabela-adicionar-alunos')
                myButtons = getBotoesAluno(item.id)
            else if (tabela.getAttribute('id') === 'tabela-projetos')
                myButtons = getBotoesProjeto(item.id)

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

const getBotoesProjeto = (projeto) => {
    const td = $('<td>').html('<div class="btn-acoes"> <button class="btn-adicionar"> <i class="fa fa-plus"> </i> Alunos</button> <button class="btn-lista">Lista</button> </div>')

    const btnAdicionar = $(td).find('.btn-adicionar')
    const btnLista = $(td).find('.btn-lista')
    
    btnAdicionar.on('click', event => {
        event.preventDefault()

        $.get('./pages/adicionar-alunos-lista.html')
            .then(response => $('<div>').append(response))
            .then(page => {
                const table = $(page).find('.table').get(0)

                table.setAttribute('id-projeto', projeto)
                $(page).find('.list-title').html('Adicionar Alunos ao Projeto')
                loadData(table)
                return page
            }).then(page => $('#destino').html(page))

    })

    btnLista.on('click', event => {
        event.preventDefault()

        $.get('./pages/alunos-lista.html')
            .then(response => $('<div>').append(response))
            .then(page => {
                const table = $(page).find('.table').get(0)

                table.setAttribute('id-projeto', projeto)
                $(page).find('.list-title').html('Lista de Alunos do Projeto')

                const tBody = $(table).find('tbody')
                tBody.html('')
            
                $.get(`/projetos/${projeto}/alunos`)
                    .then(items => items.map(item => {
                        return toRow(item)
                    }))
                    .then(rows => rows.forEach(row => {
                        tBody.append(row)
                    }))

                return page
            }).then(page => $('#destino').html(page))

    })

    return td
}

const getBotoesAluno = (idAluno) => {
    const td = $('<td>').html('<div class="btn-acoes"><button class="btn-adicionar"><i class="fa fa-plus"></i></button><button class="btn-remover d-none"><i class="fa fa-close"></i></button></div>')

    const btnAdicionar = $(td).find('.btn-adicionar')
    const btnRemover = $(td).find('.btn-remover')
    btnAdicionar.on('click', () => {
        const idProjeto = $('.table').get(0).getAttribute('id-projeto')

        $.post(`/projetos/${idProjeto}/alunos`, {idAluno})

        alert('Aluno Adicionado')
        btnAdicionar.addClass('d-none')
        btnRemover.removeClass('d-none')

    })
    
    btnRemover.on('click', () => {
        const idProjeto = $('.table').get(0).getAttribute('id-projeto')
        $.ajax({method: 'delete', url: `/projetos/${idProjeto}/alunos`, data: {idAluno}})

        btnRemover.addClass('d-none')
        btnAdicionar.removeClass('d-none')
        alert('Aluno Removido')
    })

    return td
}

