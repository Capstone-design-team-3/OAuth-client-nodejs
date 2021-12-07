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

app.get('/login/oauth-login-grant', (req, res) => {
    res.redirect(url.format({
        pathname: 'http://localhost:9000/oauth/authorize',
        query: {
            'response_type': 'code',
            'client_id': 'client',
            'redirect_uri': 'http://localhost:3000/login/oauth-grant',
            'scope': 'read'
        }
    }))
})

app.get('/login/oauth-grant', (req, res) => {
    const code = req.query['code']
    const options = {
        url: 'http://client:secret@localhost:9000/oauth/token',
        method: 'POST',
        form: {
            'grant_type': 'authorization_code',
            'code': code,
            'scope': 'read',
            'redirect_uri': 'http://localhost:3000/login/oauth-grant'
        }
    }
    
    function callback(error, response, body) {
        if (!error && response.statusCode === 200) {
            const token = JSON.parse(body)['access_token']
            
            res.send(token)
            // const options = {
            //     url: 'http://localhost:9090/account',
            //     method: 'GET',
            //     headers: {
            //         'Authorization': 'Bearer ' + token
            //     }
            // }
            //
            // request(options, (error, response, body) => {
            //     const accountInfo = JSON.parse(body)
            //
            //     app.locals.isLogin = true
            //     app.locals.id = accountInfo['userName']
            //     app.locals.email = accountInfo['email']
            //     app.locals.address = accountInfo['address']
            //
            //     res.redirect(url.format({
            //         pathname: 'http://localhost:3000/'
            //     }))
            // })
        }
    }
    
    request(options, callback)
})

app.get('/login/oauth-login-implicit', (req, res) => {
    res.redirect(url.format({
        pathname: 'http://localhost:9000/oauth/authorize',
        query: {
            'response_type': 'token',
            'client_id': 'client',
            'redirect_uri': 'http://localhost:3000/login/oauth-implicit',
            'scope': 'read'
        }
    }))
})

app.get('/login/oauth-implicit', (req, res) => {
    res.redirect(url.format({
        pathname: 'http://localhost:3000/'
    }))
})

app.get('/login/oauth-implicit-token', (req, res) => {
    // const token = REQ.HEADER
    
    console.log(req.header('Authorization'))
    
    // res.send(token)
    // const options = {
    //     url: 'http://localhost:9090/account',
    //     method: 'GET',
    //     headers: {
    //         'Authorization': 'Bearer ' + token
    //     }
    // }
    //
    // request(options, (error, response, body) => {
    //     const accountInfo = JSON.parse(body)
    //
    //     app.locals.isLogin = true
    //     app.locals.id = accountInfo['userName']
    //     app.locals.email = accountInfo['email']
    //     app.locals.address = accountInfo['address']
    //
    //     res.redirect(url.format({
    //         pathname: 'http://localhost:3000/'
    //     }))
    // })
})

app.get('/login/oauth-login-password', (req, res) => {
    const options = {
        url: 'http://client:secret@localhost:9000/oauth/token',
        method: 'POST',
        form: {
            'grant_type': 'password',
            'scope': 'read',
            'user': 'foo',
            'password': 'foo'
        }
    }
    
    function callback(error, response, body) {
        if (!error && response.statusCode === 200) {
            const token = JSON.parse(body)['access_token']
    
            res.send(token)
            // const options = {
            //     url: 'http://localhost:9090/account',
            //     method: 'GET',
            //     headers: {
            //         'Authorization': 'Bearer ' + token
            //     }
            // }
            //
            // request(options, (error, response, body) => {
            //     const accountInfo = JSON.parse(body)
            //
            //     app.locals.isLogin = true
            //     app.locals.id = accountInfo['userName']
            //     app.locals.email = accountInfo['email']
            //     app.locals.address = accountInfo['address']
            //
            //     res.redirect(url.format({
            //         pathname: 'http://localhost:3000/'
            //     }))
            // })
        }
    }
    
    request(options, callback)
})

app.get('/login/oauth-login-client', (req, res) => {
    const options = {
        url: 'http://client:secret@localhost:9000/oauth/token',
        method: 'POST',
        form: {
            'grant_type': 'client_credentials',
            'scope': 'read',
        }
    }
    
    function callback(error, response, body) {
        if (!error && response.statusCode === 200) {
            const token = JSON.parse(body)['access_token']
            
            res.send(token)
        }
    }
    
    request(options, callback)
})

app.listen(port, () => {
    console.log(`server is listening at localhost:${ port }`)
})