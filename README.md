PushpinAndroid
==============

Android version of PushpinOSM

Build instructions:

Before building, edit custom_rules.xml, changing the value of the "public-project-base" and "private-project-base" properties, which store the path's to the PushpinAndroid repository and the private repository with Secrets.js.

Then run the following from the directory containing custom_rules.xml:

ant update-secrets-js

Without doing this update, your build will not be able to login the user.

Alternatively, you can create a file called Secrets.js in <repo path>/Pushpin/platforms/android/assets/www/js/PushPin/ with the following contents, replacing the bracketed fields with their appropriate values:

PushPin.Secrets = {
  OAUTH: {
    CONSUMER_KEY: '< consumer key here >',
    CONSUMER_SECRET: '< consumer secret here >'
  }
};
