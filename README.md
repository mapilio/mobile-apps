### ️⚠️️️ If you are getting build errors on Android:
first, you can start `expo run:android` and `expo prebuild -p android --clean` command then `yarn android:debug` or `npm run android:debug`


### ⚠️ if you use macOS!
first you should check if the `.netrc` file exists in the `home (~) directory`. if not, create a new `.netrc` file, and you should write in the file;

    machine api.mapbox.com
    login mapbox
    password sk.ey...ewr

### ⚠️ If you are using nvm and getting error during the build!
If you are getting error `Command PhaseScriptExecution failed exit code` on xcode and using nvm, you should use node version v16.18.0, and run `ln -s $(which node) /usr/local/bin/node` command.


## How to install
https://reactnative.dev/docs/environment-setup?platform=ios

    brew install node
    brew install watchman

    ruby --version

React Native uses a .ruby-version file to make sure that your version of Ruby is aligned with what is needed. Currently, macOS 13.2 is shipped with Ruby 2.6.10, which is not what is required by this version of React Native (2.7.6). Our suggestion is to install a Ruby version manager and to install the proper version of Ruby in your system.

### How to upgrade ruby version

    brew install rbenv
    rbenv init
    rbenv install 2.7.6

    Alternatively, you may want to take a look at this document.
    https://github.com/rbenv/rbenv

After setting the Ruby version, we can continue with the installation.

    yarn install
    npx pod-install

### How to clean prebuild ios project
    expo prebuild -p ios --clean

### How to run ios project for production
    npx pod-install
    expo run:ios --configuration Release

### How to run ios project for development
    expo run:ios

### How to prebuild android project
    expo prebuild -p android --clean
    expo run:android