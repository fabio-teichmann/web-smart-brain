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
db.select('*').from('users').then(data => {
    console.log(data);
});


const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'banana',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}

const app = express();

// app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send(database.users);
})

// SIGN-IN
app.post('/signin', (req, res) => {
    // bcrypt.compare("apples", '$2a$10$bM.r2lbiAfjNj3wayvFYg.qHcW1PFvFExEzXgknYSk0/8WLFumJ2G', function(err, res) {
    //     // res == true
    //     console.log('first guess', res);
    // });
    // bcrypt.compare("veggies", '$2a$veggies$v.r2lbiAfjNj3wayvFYg.qHcW1PFvFExEzXgknYSk0/8WLFumJ2G', function(err, res) {
    //     // res == true
    //     console.log('second guess', res);
    // });

    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('error logging in');
    }
    res.json('sign in');
})

// REGISTER
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    bcrypt.hash(password, null, null, function(err, hash) {
        // Store hash in your password DB.
        // console.log(hash);
    });
    // create new user
    db('users')
        .returning('*')
        .insert({
        email: email,
        name: name,
        joined: new Date(),
    }).then(user => {
        res.json(user);
    }).catch(err => res.status(400).json('unable to register'))
    
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