import React, { Component } from 'react';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';
import './App.css';

const app = new Clarifai.App({
apiKey: '83f43f57979f408f8e37c14033c9c0d7'
});

const particlesOptions = {

    particles: {
      number: {
        value: 100,
        density: {
          enable: true,
          value_area: 800,
        }
      },

      shape: {
        stroke: {
          width: 0,
        },

        polygon: {
          nb_sides: 5
        },

        image: {
          width: 100,
          height: 100
        }
      },

      size: {
          value: 3,
          random: {
            enable: false
          },
          anim: {
            enable: false,
            speed: 30,
            size_min: 0.1,
            sync: false
          }
      },

      line_linked: {
        enable_auto: true,
        distance: 150,
        opacity: 0.4,
        width: 1
      },

      move: {
        enable: true,
        speed: 6,
        attract: {
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    
    interactivity: {
        onhover: {
          enable: true,
          repulse: {
            enable: true
          }
       }
     }
}


const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  faceName: '',
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}



class App extends Component {
  constructor() {
    super();
    this.state= initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }


calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
  }
}


displayFaceBox = (box) => {
  this.setState({box: box});
}
/*

calculateFaceName = (data) => {
  const faceName = data.outputs[0].data.regions[0].data.concepts;
  console.log('faceName ran');
  this.setState({name: faceName});
}
*/

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }


  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})


    app.models.initModel({id: Clarifai.CELEBRITY_MODEL, version: ""})
      .then(celebrityModel => {
        return celebrityModel.predict(this.state.input);
      })

      .then(response => {
        if (response) {
          fetch('https://powerful-sierra-79006.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}, ({faceName: response.outputs[0].data.regions[0].data.concepts[0].name})))
            })
            .catch(console.log)
        }

        this.displayFaceBox(this.calculateFaceLocation(response));
        //const concepts = response['outputs'][0]['data']['concepts']
        // console.log(response.outputs[0].data.regions[0].data.concepts[0]/*.region_info.bounding_box*/);    
      })
     .catch(err => console.log(err));
}


onRouteChange = (route) => {
  if (route === 'signout') {
    this.setState(initialState)
  } else if (route === 'home') {
    this.setState({isSignedIn: true})
  }
    this.setState({route: route});
}



  render() {
    const  { isSignedIn, imageUrl, route, box, faceName } = this.state;

    return (
      <div className="App">

        <Particles 
                className='particles'
                params={particlesOptions}
              />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />


        {route === 'home'
        
         ?  <div>
               <Logo />
               <Rank name={this.state.user.name}
                     entries= {this.state.user.entries}
                />
               <ImageLinkForm 
                 onInputChange={this.onInputChange} 
                 onButtonSubmit={this.onButtonSubmit}
                 faceName={faceName}
                />
               <FaceRecognition 
                  box={box} 
                  imageUrl={imageUrl}
                />
             </div>
         
         /*wth is this below?*/
         : (
           route === 'signin' 
           ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
           : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
         )
         
        }
      </div>
    )
  }
}

export default App;
