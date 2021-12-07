const query = document.location.href.split('#')[1]
const tokenQuery = query.split('&')[0]
const token = tokenQuery.split('=')[1]

const req = new XMLHttpRequest()

req.open('GET', 'http://localhost:3000/login/oauth-implicit-token')
req.setRequestHeader('Authorization', 'Bearer ' + token)
req.send()

req.onreadystatechange = (event) => {
    const { target } = event
    
    if (target.readyState === XMLHttpRequest.DONE) {
        const { status } = target
    
        if (status === 0 || (status >= 200 && status < 400)) {
            console.log(req.response)
        } else {
            console.log(req.response)
        }
    }
}

console.log(token)