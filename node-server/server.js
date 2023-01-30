const express = require('express');


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
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
}

const app = express();

// app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send(database.users);
})

// SIGN-IN
app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json('success');
    } else {
        res.status(400).json('error logging in');
    }
    res.json('sign in');
})

// REGISTER
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    // create new user
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    });
    res.json(database.users[database.users.length-1]);
})

// PROFILE
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach( user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        } 
    })
    if (!found) {
        res.status(404).json('user not found');
    }
})


// IMAGE
app.post('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach( user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        } 
    })
    if (!found) {
        res.status(404).json('user not found');
    }
})


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