const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');
const crypto = require('crypto');

// Serialization
passport.serializeUser((user, done) => {
  console.log('Serializing user:', user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    console.log('Deserialized user:', user ? user.email : 'not found');
    done(null, user);
  } catch (err) {
    console.error('Deserialization error:', err);
    done(err, null);
  }
});

// Google Strategy for general authentication
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google OAuth Flow - Processing profile:', {
          id: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName
        });

        // Check if user exists by Google ID
        let user = await User.findOne({ googleId: profile.id });
        console.log('Existing user with Google ID:', user ? user.email : 'none');

        if (!user) {
          // Check for duplicate email
          const existingUser = await User.findOne({ email: profile.emails[0].value });
          console.log('Checking for duplicate email:', profile.emails[0].value);
          console.log('Found existing user with email:', existingUser ? 'YES' : 'NO');

          if (existingUser) {
            console.log('DUPLICATE EMAIL DETECTED - Details:', {
              email: profile.emails[0].value,
              existingUserId: existingUser._id,
              existingUserGoogleId: existingUser.googleId
            });
            return done(null, false, { 
              message: 'This email is already registered. Please use a different email or log in with your existing account.',
              errorType: 'existing_email'
            });
          }

          console.log('Creating new user with email:', profile.emails[0].value);
          // Create new user (no password)
          user = new User({
            googleId: profile.id,
            fullname: profile.displayName,
            email: profile.emails[0].value,
            isAdmin: false,
          });
        } else if (!user.googleId) {
          console.log('Linking existing account with Google ID:', profile.id);
          // Link existing account with Google
          user.googleId = profile.id;
        }

        // Update session token
        user.sessionToken = crypto.randomBytes(32).toString('hex');
        await user.save();
        console.log('Successfully processed user:', user.email);
        return done(null, user);
      } catch (err) {
        console.error('Google Auth Error - Full details:', {
          error: err.message,
          stack: err.stack,
          profile: profile ? {
            id: profile.id,
            email: profile.emails?.[0]?.value
          } : 'No profile'
        });
        return done(err);
      }
    }
  )
);

// Google Signup Strategy
passport.use('google-signup',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL.replace('/callback', '/signup/callback'),
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists by Google ID
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          // Already signed up with Google
          return done(null, false, { 
            message: 'Account already exists. Please log in.',
            errorType: 'existing_google_account'
          });
        }

        // Check for duplicate email
        const existingUser = await User.findOne({ email: profile.emails[0].value });
        if (existingUser) {
          return done(null, false, { 
            message: 'This email is already registered. Please use a different email or log in with your existing account.',
            errorType: 'existing_email'
          });
        }

        // Create new user
        user = new User({
          googleId: profile.id,
          fullname: profile.displayName,
          email: profile.emails[0].value,
          isAdmin: false,
          sessionToken: crypto.randomBytes(32).toString('hex'),
        });
        await user.save();
        return done(null, user);
      } catch (err) {
        console.error('Google Signup Error:', err);
        return done(err);
      }
    }
  )
);