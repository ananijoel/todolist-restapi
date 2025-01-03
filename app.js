const express = require('express')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const sequelize = require('./src/dataBase/sequelize')
const cors = require('cors')

const staticport = 3000
const app = express()
const port = process.env.PORT || staticport

const corsOptions = {
  origin: "http://127.0.0.1:5500/",
};

sequelize.init_dataBase()

app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(bodyParser.json())
    .use(cors(
        //{ origin: 'http://127.0.0.1:5500' }
        ))

app.get('/', (req, res) => res.json('hello Todo_list_restapi'))

//todos routes
require('./src/routes/todos/add-todo')(app)
require('./src/routes/todos/get-todo')(app)
require('./src/routes/todos/remove-todo')(app)
require('./src/routes/todos/check-todo')(app)
// user routes
require('./src/routes/user/add-user')(app)
require('./src/routes/user/get-users')(app)
require('./src/routes/user/get-user-by-param')(app)
require('./src/routes/user/update-user')(app)
require('./src/routes/user/update-user-picture')(app)
require('./src/routes/user/update-user-by-Pk')(app)
require('./src/routes/user/update-user-password')(app)
require('./src/routes/user/get-user-picture')(app)
require('./src/routes/user/remove-user')(app)
require('./src/routes/user/remove-user-picture')(app)
require('./src/routes/user/user-login')(app)


if(process.env.PORT){
    app.listen(port,() => console.log('le projet Todo_list_api est demarée'))
} else{
    app.listen(port,() => console.log('le projet Todo_list_api est demarée sur : http://localhost:'+staticport))
}
