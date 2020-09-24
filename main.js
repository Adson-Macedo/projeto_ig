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
        form && setValidation(form)
    })
}

$('.nav-link').toArray().forEach(link => {
    const url = link.href

    link.onclick = (event) => {
        event.preventDefault()
        getPage(url)
    }
})
