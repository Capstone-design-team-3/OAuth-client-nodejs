const express = require('express')
const path = require('path')
const nunjucks = require('nunjucks')
const logger = require('morgan')

class App {
    
    constructor() {
        this.app = express()
        
        this.setViewEngine()
        this.setMiddleWare()
        this.setStatic()
        this.setLocals()
        this.setErrorHandler()
    }
    
    setMiddleWare() {
        this.app.use(logger('dev'))
    }
    
    setViewEngine() {
        nunjucks.configure('template', {
            autoescape: true,
            express: this.app
        })
    }
    
    setStatic() {
        this.app.use(express.static(path.join(__dirname, 'template')))
        this.app.use('/image', express.static('image'))
    }
    
    setLocals() {
        this.app.use((req, res, next) => {
            next()
        })
    }
    
    setErrorHandler() {
        this.app.use((err, req, res, _) => {
        })
    }
    
}

exports.App = App;
exports.app = new App().app