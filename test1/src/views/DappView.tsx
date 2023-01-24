import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MetaMaskSDK} from '@metamask/sdk';
import {
  ChannelConfig,
  ConnectionStatus,
  MessageType,
} from '@metamask/sdk-communication-layer';
import {ethers} from 'ethers';
import {MetaMaskInpageProvider} from '@metamask/providers';
import {colors} from './colors';

export interface DAPPViewProps {
  sdk: MetaMaskSDK;
  onTerminate: (terminate: boolean) => void;
}

const createStyles = (connectionStatus: ConnectionStatus) => {
  return StyleSheet.create({
    container: {
      borderWidth: 2,
      borderColor:
        connectionStatus === ConnectionStatus.LINKED
          ? colors.success.default
          : colors.warning.default,
      padding: 10,
      backgroundColor: colors.background.default,
    },
    button: {
      height: 30,
      marginTop: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'blue',
    },
    title: {
      backgroundColor: '#a5c9ff',
      textAlign: 'center',
      padding: 10,
    },
    textData: {
      color: 'black',
    },
    buttonText: {
      color: 'black',
    },
    removeButton: {
      backgroundColor: '#ffcc00',
    },
  });
};

export const DAPPView = ({sdk, onTerminate}: DAPPViewProps) => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [ethereum, setEthereum] = useState<MetaMaskInpageProvider>();
  const [response, _setResponse] = useState<unknown>('');
  const [account, _setAccount] = useState<string>();
  const [chain, _setChain] = useState<number>();
  const [balance, _setBalance] = useState<string>();
  const [connected, _setConnected] = useState<boolean>(false);
  const [channelConfig, setChannelConfig] = useState<ChannelConfig>();
  const [status, setConnectionStatus] = useState(ConnectionStatus.DISCONNECTED);
  const styles = createStyles(status);
  const hasPauseAction =
    (status !== ConnectionStatus.PAUSED &&
      status === ConnectionStatus.LINKED) ||
    status === ConnectionStatus.WAITING;
  const hasResumeAction = status === ConnectionStatus.PAUSED;

  const getBalance = async () => {
    if (!ethereum?.selectedAddress) {
      return;
    }
    const bal =
      (await provider?.getBalance(ethereum?.selectedAddress)) ??
      ethers.BigNumber.from(0);
    _setBalance(ethers.utils.formatEther(bal));
  };

  useEffect(() => {
    try {
      const _ethereum = sdk.getProvider();
      const _provider = new ethers.providers.Web3Provider(_ethereum);

      setEthereum(_ethereum);
      setProvider(_provider);

      _ethereum.on('chainChanged', (newChain: number) => {
        console.log('chainChanged event', newChain);
        _setConnected(true);
        _setChain(newChain);
      });

      _ethereum.on('_initialized', () => {
        console.log('_initialized event');
        _setConnected(true);
      });

      _ethereum.on('connect', ({chainId}: {chainId: string}) => {
        console.debug('connect event', chainId);
        _setConnected(true);
        _setChain(parseInt(chainId, 10));
      });

      _ethereum.on('accountsChanged', (newAccounts: string[]) => {
        console.log('accountsChanged changed', newAccounts);
        _setAccount(newAccounts?.[0]);
        _setConnected(true);
        getBalance();
      });

      _ethereum.on('disconnect', (error: unknown) => {
        console.log('disconnect event', error);
        _setConnected(false);
      });

      sdk.on(
        MessageType.CONNECTION_STATUS,
        (_connectionStatus: ConnectionStatus) => {
          setConnectionStatus(_connectionStatus);
          setChannelConfig(sdk.getChannelConfig());
        },
      );
    } catch (err) {
      console.log('strange errror', err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connect = async () => {
    try {
      const result = (await ethereum?.request({
        method: 'eth_requestAccounts',
      })) as string[];
      console.log('RESULT', result?.[0]);
      _setAccount(result?.[0]);
      // getBalance();
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  const exampleRequest = async () => {
    try {
      const result = await ethereum?.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x89',
            chainName: 'Polygon',
            blockExplorerUrls: ['https://polygonscan.com'],
            nativeCurrency: {symbol: 'MATIC', decimals: 18},
            rpcUrls: ['https://polygon-rpc.com/'],
          },
        ],
      });
      console.log('RESULT', result);
      _setResponse(result);
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  const sign = async () => {
    const msgParams = JSON.stringify({
      domain: {
        // Defining the chain aka Rinkeby testnet or Ethereum Main Net
        chainId: ethereum?.chainId ? parseInt(ethereum.chainId, 16) : 1,
        // Give a user friendly name to the specific contract you are signing for.
        name: 'Ether Mail',
        // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        // Just let's you know the latest version. Definitely make sure the field name is correct.
        version: '1',
      },

      // Defining the message signing data content.
      message: {
        /*
         - Anything you want. Just a JSON Blob that encodes the data you want to send
         - No required fields
         - This is DApp Specific
         - Be as explicit as possible when building out the message schema.
        */
        contents: 'Hello, Bob!',
        attachedMoneyInEth: 4.2,
        from: {
          name: 'Cow',
          wallets: [
            '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
            '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
          ],
        },
        to: [
          {
            name: 'Bob',
            wallets: [
              '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
              '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
              '0xB0B0b0b0b0b0B000000000000000000000000000',
            ],
          },
        ],
      },
      // Refers to the keys of the *types* object below.
      primaryType: 'Mail',
      types: {
        // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
        EIP712Domain: [
          {name: 'name', type: 'string'},
          {name: 'version', type: 'string'},
          {name: 'chainId', type: 'uint256'},
          {name: 'verifyingContract', type: 'address'},
        ],
        // Not an EIP712Domain definition
        Group: [
          {name: 'name', type: 'string'},
          {name: 'members', type: 'Person[]'},
        ],
        // Refer to PrimaryType
        Mail: [
          {name: 'from', type: 'Person'},
          {name: 'to', type: 'Person[]'},
          {name: 'contents', type: 'string'},
        ],
        // Not an EIP712Domain definition
        Person: [
          {name: 'name', type: 'string'},
          {name: 'wallets', type: 'address[]'},
        ],
      },
    });

    var from = ethereum?.selectedAddress;

    var params = [from, msgParams];
    var method = 'eth_signTypedData_v4';

    const resp = await ethereum?.request({method, params});
    _setResponse(resp);
  };

  const sendTransaction = async () => {
    const to = '0x0000000000000000000000000000000000000000';
    const transactionParameters = {
      to, // Required except during contract publications.
      from: ethereum?.selectedAddress, // must match user's active address.
      value: '0x5AF3107A4000', // Only required to send ether to the recipient from the initiating external account.
    };

    try {
      // txHash is a hex string
      // As with any RPC call, it may throw an error
      const txHash = await ethereum?.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      _setResponse(txHash);
    } catch (e) {
      console.log(e);
    }
  };

  const textStyle = {
    color: colors.text.default,
    margin: 10,
    fontSize: 16,
  };

  return (
    <View style={{borderWidth: 2, padding: 5}}>
      <Text style={styles.title}>{sdk.getDappMetadata()?.name}</Text>
      <Text>Status: {status}</Text>
      <Text>Channel: {channelConfig?.channelId}</Text>
      <Text>{`Expiration: ${channelConfig?.validUntil ?? ''}`}</Text>
      <Button
        title={'Test Storage'}
        onPress={() => {
          sdk.testStorage();
        }}
      />
      <Button title={connected ? 'Connected' : 'Connect'} onPress={connect} />
      {connected && (
        <>
          <Button title="Sign" onPress={sign} />
          <Button title="Send transaction" onPress={sendTransaction} />
          <Button title="Add chain" onPress={exampleRequest} />
          <Text style={textStyle}>
            {chain && `Connected chain: ${chain}\n`}
            {account && `Connected account: ${account}\n\n`}
            {account && balance && `Balance: ${balance} ETH`}
          </Text>
          <Text style={textStyle}>
            {response ? `Last request response: ${response}` : ''}
          </Text>
          {hasResumeAction && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                // todo
              }}>
              <Text style={styles.buttonText}>Resume</Text>
            </TouchableOpacity>
          )}
          {hasPauseAction && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                // todo
              }}>
              <Text style={styles.buttonText}>Pause</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.button, styles.removeButton]}
            onPress={() => {
              console.debug('start disconnect on app');
              sdk.disconnect();
            }}>
            <Text style={styles.buttonText}>Disconnect</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity
        style={[styles.button, styles.removeButton]}
        onPress={() => onTerminate(ethereum?.isConnected() ?? false)}>
        <Text style={styles.buttonText}>Terminate</Text>
      </TouchableOpacity>
    </View>
  );
};
