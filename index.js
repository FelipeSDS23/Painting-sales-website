const express = require('express')

const conn = require('./db/conn')

const app = express()

// receber resposta do body
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// public path
app.use(express.static('public'))

conn.sync()
    .then(() => {
        app.listen(3000)
    }).catch((error) => {
        console.log(error)
    })