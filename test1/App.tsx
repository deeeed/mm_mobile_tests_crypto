/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

import React, {useEffect, useState} from 'react';
import {
  Button,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {MetaMaskSDK} from '@metamask/sdk';
import {
  CommunicationLayerMessage,
  CommunicationLayerPreference,
  DappMetadata,
  MessageType,
  RemoteCommunication,
} from '@metamask/sdk-communication-layer';
import crypto from 'crypto';
import {encrypt} from 'eciesjs';
import BackgroundTimer from 'react-native-background-timer';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {DAPPView} from './src/views/DappView';
import {StorageManagerRN} from './src/StorageManagerRN';
const remotServerUrl = 'https://5488-1-36-226-145.ap.ngrok.io';

function App(): JSX.Element {
  const [sdkList, setSDKList] = useState<MetaMaskSDK[]>([]);
  const isDarkMode = useColorScheme() === 'dark';

  const initSDK = (dappMetadata: DappMetadata) => {
    try {
      const sdk = new MetaMaskSDK({
        openDeeplink: (link: string) => {
          try {
            Linking.openURL(link);
          } catch (err) {
            console.log('oospie', err);
          }
        },
        communicationServerUrl: remotServerUrl,
        timer: BackgroundTimer,
        enableDebug: true,
        dappMetadata: dappMetadata,
        storage: {
          debug: true,
          // storageManager: new StorageManagerRN({debug: true}),
        },
        ecies: {
          enabled: true,
        },
      });
      setSDKList([...sdkList, sdk]);
    } catch (err) {
      console.debug('oospie', err);
    }
  };

  useEffect(() => {
    console.debug('use effect now');
    initSDK({
      name: 'Demo',
      url: 'example.com',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const backgroundStyle = {
    backgroundColor: Colors.lighter,
  };

  const testEncrypt = async () => {
    // const privateKey =
    //   '0x131ded88ca58162376374eecc9f74349eb90a8fc9457466321dd9ce925beca1a';
    console.debug('begin encryptiion test');
    const data =
      '{"type":"originator_info","originatorInfo":{"url":"example.com","title":"React Native Test Dapp","platform":"NonBrowser"}}';
    const other =
      '024368ce46b89ec6b5e8c48357474b2a8e26594d00cd59ff14753f8f0051706016';
    const payload = Buffer.from(data);
    const encryptedData = encrypt(other, payload);
    const encryptedString = Buffer.from(encryptedData).toString('base64');
    console.debug('encrypted: ', encryptedString);
  };

  const testStorage = async () => {
    // const allKeys = await AsyncStorage.getAllKeys();
    // console.debug('allKeys', allKeys);
    // await AsyncStorage.setItem('temp', 'test', () => {
    //   console.debug(
    //     'StorageManagerRN::persisChannelConfig() saved to storage.',
    //   );
    // });
    const isHermes = () => !!global.HermesInternal;
    console.log("Is Hermes enabled " + isHermes())
  };

  const removeSdk = (sdk: MetaMaskSDK, index: number) => {
    const newList = [...sdkList];
    newList.splice(index, 1);
    // setSDKList();
    console.debug(
      `index=${index} Before=${sdkList.length} newList.length=${newList.length}`,
    );
    setSDKList(newList);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            marginTop: 30,
            backgroundColor: Colors.white,
          }}>
          <Text style={{color: Colors.black, fontSize: 24}}>
            TEST1 Mobile Dapp Test (RN v0.71.1)
          </Text>
          <Button
            title="Remote Connection"
            onPress={() => {
              const url = new URL(
                'https://metamask.app.link/connect?channelId=e52ec4b0-cdca-48d1-99bb-9b6c80e11951&comm=socket&pubkey=0298223b92a89fb637f7f6a1142ef5dee464847f5b2a246b7e70d7d95a0066bc75',
              );
              const channelId = url.searchParams.get('channelId') ?? '';
              const pubkey = url.searchParams.get('pubkey') ?? '';
              console.log(`channelId: ${channelId}`);
              console.log(`pubkey: ${pubkey}`);
              console.log('crypto: ', crypto.randomBytes(32).toString('hex'));
              console.log('RemoteCommunication', RemoteCommunication);
              // // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const mmRemote = new RemoteCommunication({
                communicationLayerPreference:
                  CommunicationLayerPreference.SOCKET,
                platform: 'test',
                otherPublicKey: pubkey,
                communicationServerUrl: remotServerUrl,
                context: 'mm-mobile',
                enableDebug: true,
              });
              mmRemote.on('clients_disconnected', () => {
                console.log('disconnected');
                mmRemote.disconnect();
              });
              mmRemote.on('clients_ready', (clientMsg: unknown) => {
                console.log('clients_ready', clientMsg);
              });
              mmRemote.on('message', (message: CommunicationLayerMessage) => {
                console.log('received remote Msg: ', message);
                try {
                  if (message.method?.toLowerCase() === 'eth_requestaccounts') {
                    // fake reply
                    const reply = {
                      name: 'metamask-provider',
                      data: {
                        id: message.id,
                        jsonrpc: '2.0',
                        result: ['0x123', '0xbadbeef'],
                      },
                      type: MessageType.JSONRPC,
                    };
                    console.log('replying: ', reply);
                    mmRemote.sendMessage(reply);
                  }
                } catch (err) {
                  console.error('oospie', err);
                }
              });
              mmRemote.connectToChannel(channelId);
            }}
          />
          <Button title="TestEncrypt" onPress={testEncrypt} />
          <Button title="Test Storage" onPress={testStorage} />
          <Button
            title="New SDK"
            onPress={() => {
              initSDK({
                name: `MobileDapp_${sdkList.length}`,
                url: 'http://somedappurl.com',
              });
            }}
          />

          {sdkList.map((sdk, index) => (
            <DAPPView
              sdk={sdk}
              key={`sdk${index}`}
              onTerminate={terminate => {
                console.debug(`onTerminate terminate=${terminate}`);
                if (terminate) {
                  sdk.terminate();
                }
                removeSdk(sdk, index);
              }}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
