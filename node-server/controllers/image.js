const Clarifai = require('clarifai');
const { response } = require('express');

const USER_ID = 'fabio-teichmann';
// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = 'b280d39a79464394b6ffed935c3d623e';
const APP_ID = 'smart-brain-app';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '45fb9a671625463fa646c3523a3087d5';    
// let IMAGE_URL = 'https://www.online-tech-tips.com/wp-content/uploads/2022/02/faces.jpeg';
let IMAGE_URL = 'https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg';

const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
});

const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
};

const handleApiCall = (req, res) => {
    IMAGE_URL = req.body.input;

    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
        .then(data => {
            console.log(data);
            res.json(data);
        })
        .catch(err => res.status(400).json('unable to work with API'));
}
const handleImage = (req, res, db) => {
    const { id } = req.body;

    db('users').where('id', '=', id)
     .increment('entries', 1)
     .returning('entries')
     .then(entries => {
        res.json(entries[0].entries);
     })
     .catch(err => res.status(400).json('unable to get users'));

    
}

module.exports = {
    handleImage,
    handleApiCall
}