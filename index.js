
const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');
const { rest } = require('lodash');
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
mongoose.connect('mongodb://localhost:27017/myFlixDB', 
{ useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(bodyParser.json()); // support parsing of application/json type post data

const users = [
  {
    "id":1,
    "name":"kim",
    "password":"frank45",
    "favoriteMovie":"The Dark Knight"
  },
  {
    "id":2,
    "name":"lee",
    "password":"lewis45",
    "favoriteMovie":""
  }

];

let movies = [
  {
    "title": 'The Shawshank Redemption',
    "genre": {
      "name": 'drama'
    },
    "story":'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    "director": {
      "name":"Frank Darabont"
    },
    "stars": {
      "name":'Tim Robbins'
    },

  },
  {
    "title": 'Al-arraab',
   "genre": {
      "name": 'action'
    },
  
    "story":'The aging patriarch of an organized crime dynasty in postwar New York City transfers control of his clandestine empire to his reluctant youngest son.',
    "director": {
      "name":'Francis Ford Coppola'
    },
    "stars": {
    "name" : 'Marlon Brando' 
    },

  },
  {
    "title": 'The Dark Knight',
   "genre": {
      "name": 'drama'
    },
    "story":'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    "director": {
      "name":'Christopher Nolan'
    },
    "stars": {
      "name":'christian Bale'
    },

  },
  {
    "title": 'The Matrix',
    "genre": {
      "name": 'action'
    },
    "story":'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.',
    "director": { 
      "name":'Lana  Wachowski'
    },
    "stars": {"name":'Keanu Reeves'},

  },
  {
    "title": ' Gladiator',
    "genre": {
      "name": 'action'
    },
    "story":'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
    "director": { "name":'Ridley Scott'
  },
    "stars": {"name":'Russell Crowe'},


  },
  {
    "title": 'Casablanca',
  "genre": {
      "name": 'drama'
    },
   "story":'A cynical expatriate American cafe owner struggles to decide whether or not to help his former lover and her fugitive husband escape the Nazis in French Morocco.',
    "director": { "name":'Michael Curtiz'},
    "stars": {"name": 'Humphrey Bogart' },
  },
  {
    "title": 'Braveheart',
   "genre": {
      "name": 'action'
    },
    "story":'Scottish warrior William Wallace leads his countrymen in a rebellion to free his homeland from the tyranny of King Edward I of England.',
    "director": { "name":'Mel Gibson'},
    "stars": {"name":'Mel Gibson'},
  },

];

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my website for movies!');
});

app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/index', (req, res) => {                  
  res.sendFile('public/index.html', { root: __dirname });
});
//get all movies in mongoose

app.get('/movies', (req, res) => {
  Users.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//get movies/:title in mongoose 
app.get('/movies/:Title',(req,res)=> {
  movies.findOne({Title: req.params.Title})
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    });
});

//get movies/director/:directorName
app.get('/movies/director/:directorName',(req,res)=> {
  movies.findOne({"Director.Name": req.params.name})
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    });
});

//get movies/genre/:genreName
app.get('/movies/genre/:genreName',(req,res)=>{movies.findOne({"Genre.Name": req.params.name})
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    });
});


// Adds data for a new movie to our list of movies in mongoose
app.post('/movies', (req, res) => {
  Users.findOne({ Title: req.body.Title })
    .then((movie) => {
      if (movie) {
        return res.status(400).send(req.body.Title + 'already exists');
      } else {
        movies
          .create({
            Title: req.body.Title,
            Description: req.body.Description,
            Genre: req.body.Genre,
            Director: req.body.Director,
            ImagePath: req.body.ImagePath,
            Featured:req.body.ImagePath
          })
          .then((movie) =>{res.status(201).json(movie) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Adds data for a new user to our list of users in mongoose
app.post('/users', (req, res) => {
  Users.findOne({ userName: req.body.userName})
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.userName + 'already exists');
      } else {
        users
          .create({
            userName: req.body.Username,
            password: req.body.password,
            email: req.body.email,
            Birthday: req.body.Birthday,
            favoriteMovie:req.body.favoriteMovie
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});
// delete one user by  username
app.delete('/users/:userName', (req, res) => {
  Users.findOneAndRemove({ userName: req.params.userName })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// delete one movie by  title
app.delete('/movies/:Title', (req, res) => {
  Users.findOneAndRemove({ Title: req.params.Title })
    .then((movie) => {
      if (!movie) {
        res.status(400).send(req.params.Title + ' was not found');
      } else {
        res.status(200).send(req.params.Title + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({userName: req.params.userName }, {
     $push: { favoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//update user in mongoose
app.put('/users/:userName', (req, res) => {
  Users.findOneAndUpdate({ userName: req.params.userName}, { $set:
    {
    Username: req.body.Username,
    Password: req.body.Password,
    Email: req.body.Email,
    Birthday: req.body.Birthday,
    favoriteMovie:req.body.favoriteMovie
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});


app.use(morgan('combined')); // setup the logger, Mildware function to the terminal

app.use(express.static('public')); // Automatically routes all requests for static files to their corresponding files within a certain folder on the server.


app.use(bodyParser.urlencoded({ extended: true })); //support parsing of application/x-www-form-urlencoded post data

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
