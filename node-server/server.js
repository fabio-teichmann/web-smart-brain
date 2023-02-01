const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: 5444,
        user: 'fabioteichmann',
        password: '',
        database: 'smart-brain'
    }
});

// query returns a promise (like fetch)
// db.select('*').from('users').then(data => {
//     console.log(data);
// });

const app = express();
// app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('welcome home');
})
// SIGN-IN
// app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) });
app.post('/signin', signin.handleSignin(db, bcrypt)); // alternative way
// REGISTER
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) }); // dependency injection
// PROFILE
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });
// IMAGE
app.put('/image', (req, res) => { image.handleImage(req, res, db) });
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });

app.listen(3000, () => {
    console.log('app is running on port 3000');
})