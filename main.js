const express = require('express')
const request = require('request')
const url = require('url')
const app = express()
const port = 3000

app.use('/css', express.static('css'))
app.use('/js', express.static('js'))
app.use('/image', express.static('image'))

app.get('/', (req, res) => {
    console.log('RESPONSE GET /');
    res.sendFile(__dirname + '/template/index.html')
})

app.get('/login', (req, res) => {
    console.log('RESPONSE GET /login');
    res.sendFile(__dirname + '/template/login.html')
})

app.get('/login/oauth-login', (req, res) => {
    console.log('RESPONSE GET /login/oauth-login');
    console.log('REDIRECT TO http://localhost:9000/oauth/authorize');
    res.redirect(url.format({
        pathname: 'http://localhost:9000/oauth/authorize',
        query: {
            'response_type': 'code',
            'client_id': 'user',
            'redirect_url': 'http://localhost:3000/login/oauth',
            'scope': 'read'
        }
    }))
})

app.get('/login/oauth', (req, res) => {
    console.log('RESPONSE GET /login/oauth');
    console.log('code : ' + req.query['code'])
    
    const code = req.query['code']
    const options = {
        url: 'http://user:pass@localhost:9000/oauth/token',
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
            
            console.log('token : ' + token) // token가지고 resource 서버와 소통해서 계정 정보 가져오고 로그인 시키기
            
            res.redirect(url.format({
                pathname: 'http://localhost:3000/'
            }))
        }
    }
    
    console.log('REQUEST POST http://user:pass@localhost:9000/oauth/token');
    request(options, callback)
})

app.listen(port, () => {
    console.log(`server is listening at localhost:${ port }`)
})