### ️⚠️️️ If you are getting build errors on Android:
first, you can start `expo run:android` and `expo prebuild -p android --clean` command then `yarn android:debug` or `npm run android:debug`


### ⚠️ if you use macOS!
first you should check if the `.netrc` file exists in the `home (~) directory`. if not, create a new `.netrc` file, and you should write in the file;

    machine api.mapbox.com
    login mapbox
    password sk.ey...ewr

### ⚠️ If you are using nvm and getting error during the build!
If you are getting error `Command PhaseScriptExecution failed exit code` on xcode and using nvm, you should use node version v16.18.0, and run `ln -s $(which node) /usr/local/bin/node` command. 