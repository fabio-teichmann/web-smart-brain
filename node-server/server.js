const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

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
app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('wrong credentials'))
            } else {
                res.status(400).json('wrong credentials');
            }
        })
        .catch(err => res.status(400).json('wrong credentials'))
})

// REGISTER
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email,
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return db('users')
                .returning('*')
                .insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date(),
            })
            .then(user => {
                res.json(user);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'))
})

// PROFILE
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    
    db.select('*').from('users').where({
        id: id
    })
    .then(user => {
        if (user.length) {
            res.json(user[0]);
        } else {
            res.status(400).json('user not found');
        }
    })
    .catch(err => {
        res.status(404).json('error getting user');
    });
})


// IMAGE
app.put('/image', (req, res) => {
    const { id } = req.body;

    db('users').where('id', '=', id)
     .increment('entries', 1)
     .returning('entries')
     .then(entries => {
        res.json(entries[0].entries);
     })
     .catch(err => res.status(400).json('unable to get users'));

    
})




// Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });


app.listen(3000, () => {
    console.log('app is running on port 3000');
})

/*
/ --> res = this is working (root)
/signin --> POST = success/fail (since we sent password, we do POST instead of GET)
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT = user

*/