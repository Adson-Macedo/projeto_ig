function ajaxRequest(config) {
    const xhr = new XMLHttpRequest()

    xhr.open(config.method, config.url, true)

    xhr.onload = event => {
        if (xhr.status === 200) {
            config.success(xhr.response)
        } else if (xhr.status >= 400) {
            config.error({
                status: xhr.status,
                statusText: xhr.statusText
            })
        }
    }

    console.log(config.data)

    if (config.data)
        xhr.send({body: config.data})
    else
        xhr.send()
}
