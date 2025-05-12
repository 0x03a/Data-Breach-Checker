const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');
const crypto = require('crypto');

// Serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID ,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ,
      callbackURL: process.env.GOOGLE_CALLBACK_URL ,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check existing user by Google ID or email
        let user = await User.findOne({ 
          $or: [
            { googleId: profile.id },
            { email: profile.emails[0].value }
          ]
        });

        if (!user) {
          // Create new user if doesn't exist
          user = new User({
            googleId: profile.id,
            fullname: profile.displayName,
            email: profile.emails[0].value,
            isAdmin: false,
          });
        } else if (!user.googleId) {
          // Link existing account with Google
          user.googleId = profile.id;
        }

        // Update session token
        user.sessionToken = crypto.randomBytes(32).toString('hex');
        await user.save();

        return done(null, user);
      } catch (err) {
        console.error('Google Auth Error:', err);
        return done(err);
      }
    }
  )
);