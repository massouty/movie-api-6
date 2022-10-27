const mongoose = require ("mongoose");
bcrypt = require('bcrypt'); // for hashing password
let movieSchema = mongoose.Schema({Title:{type:String , required:true},
Description:{type:String , required:true},
Genre:{
    Name:String,
    Description:String
},
Director:{
    Name:String,
    Bio:String
},
ImagePath:String,
Featured:Boolean
});

let userSchema = mongoose.Schema({Username:{type:String, required:true},
Password:{type:String , required:true},
Email:{type:String,required:true},
Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

// hashing of submitted passwords
userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);}


let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);



module.exports.Movie = Movie;
module.exports.User = User;

