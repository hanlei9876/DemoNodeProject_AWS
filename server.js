var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

// A server is to handle different requests
// use the entire directory "DemoProject" as the content being hosted on this server, 
// this will automaticlly find the file "index.html" as starting point
app.use(express.static(__dirname)) 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// add a getMessage service, that is to handle "GET request" from client

var messages = [{name: 'Tim', message: 'Hi'},
                {name: 'Jane', message:'Hello'}] // two JavaScript objects

app.get('/messages', (req, res) =>{  // '/messages' is a GET endpoint
    // res.send('hello')
    res.send(messages)
})

app.post('/messages', (req, res) =>{ // '/message' is a POST endpoint
    console.log(req.body) // node body-parser needs to be installed with npm and imported
    messages.push(req.body) // append the reveived body to the array "message"
    io.emit('message', req.body) // push an event called "message" along with "req.body" to all socketed clients
    res.sendStatus(200)
})

io.on('connection', (socket) => {
    console.log('a user is connected', socket.id)
})

// server =  app.listen(3000, .....)
var server = http.listen(3000, () => {
    console.log('server is listening on port',server.address().port)  // add a callback function to listening function
})

