# test1
- latest rn: "react-native": "0.71.0"
- main example with latest react native version
- doesn't use rn-nodeify
- works decently well with iphone
- EXTREMELY slow encryption for android

# test2
- doesn't work!!!
- rn-nodeify / react-native-randombytes not compatible with react native 0.70+


# test3
- use react native v0.67 (similar to previous sdk example)
- works decently for both iphone and android
- works exactly like previous example --> conclusion problem is not from the refactoring but from incompatible latest RN versions.


## Setup
- each RN needs a different ruby version to be working, the best way to manage the different versions is to use `asdf` and switch between projects
    - ruby 2.7.6 for RN 0.71.0
    - ruby 2.7.5 for RN 0.67
```bash
# install compatible ruby versions
 asdf install ruby 2.7.6    
 asdf install ruby 2.7.5    
 asdf install ruby 2.7.4
 # it will then automatically switch to the correct version in each example folder
```

- Make sure to edit the path to latest sdk versions in the `hackit.sh` script that will replace sdk and comm-layer libraries.
- Make sure to test with your local socket server, changing the ngrok url after `ngrok http http://localhost:5400`

## Check rn-nodeify issue on android
```bash
npx react-native init test4
cd test4
yarn add rn-nodeify react-native-randombytes react-native-crypto
## as soon as you run rn-nodeify the project will not build on android
yarn rn-nodeify --hack --install --yarn
# on terminal1:
yarn start
# on terminal2:
yarn android
#### see the errors...
```
```
▷ yarn android                                                                                                                         !? main
yarn run v1.22.19
warning ../../../package.json: No license field
$ react-native run-android
warn Multiple Podfiles were found: ios/Podfile,vendor/bundle/ruby/2.7.0/gems/cocoapods-core-1.11.3/lib/cocoapods-core/Podfile. Choosing ios/Podfile automatically. If you would like to select a different one, you can configure it via "project.ios.sourceDir". You can learn more about it here: https://github.com/react-native-community/cli/blob/master/docs/configuration.md
info JS server already running.
info Launching emulator...
info Successfully launched emulator.
info Installing the app...
Starting a Gradle Daemon (subsequent builds will be faster)

Deprecated Gradle features were used in this build, making it incompatible with Gradle 8.0.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

See https://docs.gradle.org/7.5.1/userguide/command_line_interface.html#sec:command_line_warnings
5 actionable tasks: 5 executed

FAILURE: Build failed with an exception.

* Where:
Build file '/Users/arthurbreton/Projects/tests_crypto/test4/node_modules/react-native-os/android/build.gradle' line: 47

* What went wrong:
A problem occurred evaluating project ':react-native-os'.
> Could not find method compile() for arguments [com.facebook.react:react-native:+] on object of type org.gradle.api.internal.artifacts.dsl.dependencies.DefaultDependencyHandler.

* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.

* Get more help at https://help.gradle.org

BUILD FAILED in 19s

error Failed to install the app. Make sure you have the Android development environment set up: https://reactnative.dev/docs/environment-setup.
Error: Command failed: ./gradlew app:installDebug -PreactNativeDevServerPort=8081

```