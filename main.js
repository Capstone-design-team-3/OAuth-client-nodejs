const app_1 = require('./app')
const request = require('request')
const url = require('url')
const app = app_1.app
const port = 3000


app.get('/', (req, res) => {
    res.locals.isLogin = app.locals.isLogin
    res.locals.id = app.locals.id
    res.locals.email = app.locals.email
    res.locals.address = app.locals.address
    res.render('index.html')
})

app.get('/login', (req, res) => {
    res.render('login.html')
})

app.get('/logout', (req, res) => {
    app.locals.isLogin = false
    app.locals.id = ""
    app.locals.email = ""
    app.locals.address = ""
    
    res.redirect(url.format({
        pathname: 'http://localhost:3000'
    }))
})

app.get('/login/oauth-login', (req, res) => {
    res.redirect(url.format({
        pathname: 'http://localhost:9000/oauth/authorize',
        query: {
            'response_type': 'code',
            'client_id': 'client',
            'redirect_url': 'http://localhost:3000/login/oauth',
            'scope': 'read'
        }
    }))
})

app.get('/login/oauth', (req, res) => {
    const code = req.query['code']
    const options = {
        url: 'http://client:secret@localhost:9000/oauth/token',
        method: 'POST',
        form: {
            'grant_type': 'authorization_code',
            'code': code,
            'scope': 'read',
            'redirect_uri': 'http://localhost:3000/login/oauth'
        }
    }
    
    function callback(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log('RESPONSE GET /login/oauth');
            const token = JSON.parse(body)['access_token']
            const options = {
                url: 'http://localhost:9090/account',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }
            
            request(options, (error, response, body) => {
                const accountInfo = JSON.parse(body)
                
                app.locals.isLogin = true
                app.locals.id = accountInfo['userName']
                app.locals.email = accountInfo['email']
                app.locals.address = accountInfo['address']
    
                res.redirect(url.format({
                    pathname: 'http://localhost:3000/'
                }))
            })
        }
    }
    
    request(options, callback)
})

app.listen(port, () => {
    console.log(`server is listening at localhost:${ port }`)
})