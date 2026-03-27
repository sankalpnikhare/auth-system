const dotenv = require('dotenv');
dotenv.config();

const passport = require('passport');
const usermodel = require('../../db/model/usermodel');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback",
  passReqToCallback: true
},
async function(req, accessToken, refreshToken, profile, done) {

  try {

    let user = await usermodel.findOne({ googleId: profile.id });

    if (!user) {
      user = await usermodel.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        photo: profile.photos[0].value
      });
    }

    return done(null, user);

  } catch (err) {
    return done(err, null);
  }

}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await usermodel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});