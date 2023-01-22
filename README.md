# test1
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
- works exactly like previous example --> conclusion problem is not from the refactoring but from not compatible latest RN versions.


## Setup
- Make sure to edit the path to latest sdk versions in the `hackit.sh` script that will replace sdk and comm-layer libraries.
- Make sure to test with your local socket server, changing the ngrok url after `ngrok http http://localhost:5400`

