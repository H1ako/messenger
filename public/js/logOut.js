var logout = document.getElementById('logOut');
logout.onclick =function() {
    const data = {
        type: 'logOut',
    }
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'X-CSRF-Token': document.querySelector('meta[name="_token"]').getAttribute('content')
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then((response) => {
        console.log(response);
        location.replace(response.url);
    })
    .catch(err => console.log(err))
}