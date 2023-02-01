import React from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg'
// import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

//////////////////////////////////////////////////////////////////////////////////////////
// In this section, we set the user authentication, app ID, model details, and the URL
// of the image we want as an input. Change these strings to run your own example.
/////////////////////////////////////////////////////////////////////////////////////////

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

// NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
// https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
// this will default to the latest version_id


// const app = new Clarifai.App({
//   apiKey: 'b280d39a79464394b6ffed935c3d623e'
// });
// MODEL_ID: 45fb9a671625463fa646c3523a3087d5

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '', //'https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '', 
        entries: 0,
        joined: '',
      }
    }
  }

  loadUser = (data) => {
    console.log('app-loadUser-data:', data);
    this.setState((data) => ({
      user: {
      id: data.id,
      name: data.name,
      email: data.email, 
      entries: data.entries,
      joined: data.joined,
    }})
    )
    console.log('app-loadUser-state:', this.state);
  }

  // componentDidMount() {
  //   fetch('http://localhost:3000')
  //     .then(response => response.json())
  //     .then(console.log)
  // }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs['0'].data.regions[0].region_info.bounding_box
    // const {top, left, right, bottom} = clarifaiFace;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    }
  }


  displayFaceBox = (box) => {
    // console.log('box:', box);
    this.setState({box: box});
  }


  onInputChange = (event) => {
    this.setState({input: event.target.value}) // need to fix this
    IMAGE_URL = event.target.value;
    // console.log(event.target.value);
  }


  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    // console.log('click');

    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
        .then(response => {
          // console.log(response);
          return response.json();
        })
        .then(result => {
          if (result) {
            fetch('http://localhost:3000/image', {
              method: 'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                id: this.state.user.id,
              })
            })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, {entries: count}))
            })
          }
          this.displayFaceBox(this.calculateFaceLocation(result));

          // console.log(result);
          // console.log(result.outputs);
          // console.log(result.outputs['0'].data.regions[0].region_info.bounding_box)
        })
        .catch(error => console.log('error', error));
  }


  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }


  render() {
    console.log('app-render:', this.state);
    const { isSignedIn, imageUrl, route, box, user} = this.state;
    let faceRecognition;
    if (imageUrl !== '') {
      faceRecognition = <FaceRecognition box={box} imageUrl={imageUrl}/>
    }
    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home' 
        ? <div>
            <Logo />
            <Rank name={user.name} entries={user.entries}/> 
            <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onButtonSubmit={this.onButtonSubmit}
            />

            {/* <FaceRecognition imageUrl={this.state.imageUrl}/> */}
            {faceRecognition}
          </div>
        : (
            (route === 'signin' || route === 'signout')
            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        )
        }
      </div>
    );
  }
  
}

export default App;
