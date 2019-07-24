# web3-iot-demo
This is a all-in-one repository to set up a very simple demo showing how to use blockchain and IoT for parametric insurance.
The scenario is the following
- Let the audience subscribe your insurance policy using the DApp
- Heat the sensor to increase the mesured temperature above the threshold
- Automatic payout is triggered, the audience are getting some ether back

## Presenter setup
### Get a Infura account
We will avoid the burden of running a full node, so to interact with our smart contract on the Rinkeby test network we will use [Infura](https://infura.io/)

### Deploy the smart contract
There are plenty of options to deploy our smart contract, to keep it simple we will use Remix IDE.
Remix IDE is a web based IDE to develop, compile, deploy, interact and debug your smart contracts. 
https://remix.ethereum.org
Note: Remix IDE works better with Google Chrome

- Copy the contract code in the Remix IDE
- Make sure 'Compiler' and 'Deploy and Run' plugins are activated
- Compile the contract
- Copy the ABI in iot/raspberrypi/abi.json and dapp/api.json
- Deploy the contract
- Save the contract address
- Browse Rinkeby Etherscan to your newly created contract (https://rinkeby.etherscan.io)

### Deploy the dapp
This is a simple web application to interact with the smart contract to subscribe your insurance policy
The full dapp code is under the dapp folder.
- Update dapp/app.js with your contract address (line 34)
- Make sure the abi.json is up to date

You can choose whatever hosting option you like.
Mine is hosted on GitHub pages:
https://mohamedtalhaoui.github.io/web3-iot-demo/

If you plan to deploy your own smart contract, then you will have to 
 - update the abi.json file
 - update the app.js file to provide your smart contract address


### Prepare the raspebrrypi
#### Hardware
- DHT 22 Temperature and humidity sensor
- RaspberryPi 3 B+

#### Wiring

#### Code
- Upload iot/raspreberrypi/abi.json 
- Upload iot/raspreberrypi/abi.json to your raspberry
- Create a secrets.json file with the following data:
```json
{
    "infura_api_key": "<YOUR_INFURA_API_KEY>",
    "admin_addr": "<YOUR_ACCOUNT_ADDRESS>",
    "private_key": "<YOUR_ACCOUNT_PRIVATE_KEY>",
    "contract_addr": "<YOUR_CONTRACT_ADDRESS>"
}
``` 

## Audience setup
### Metamask
Install [Metamask](https://metamask.io/)
Switch to the Rinkeby network

### Claim some Ethers
You will need some ether to play with. You can get some from [here](https://faucet.rinkeby.io/)

### Etherscan
Etherscan allows you to explore and search the Ethereum blockchain for transactions, addresses, tokens, prices and other activities taking place on Ethereum.
We will use the Rinkeby testnet https://rinkeby.etherscan.io/
