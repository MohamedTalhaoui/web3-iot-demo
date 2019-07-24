var Web3 = require('web3');
var Tx = require('ethereumjs-tx');
const Util = require('ethereumjs-util')
var prompt = require('prompt');
const abi = require('../dapp/abi.json');

var prompt_attributes = [
  {
      name: 'apiKey',
  },
  {
    name: 'account',
},
{
      name: 'privateKey'
  },
  {
      name: 'contractAddr',
  }
];

// Start the prompt to read user input.
prompt.start();

// Prompt and get user input then display those data in console.
prompt.get(prompt_attributes, function (err, result) {
  if (err) {
      console.log(err);
      return 1;
  } else {
      console.log('Command-line received data:');

      // Get user input from result object.
      const apiKey = result.apiKey;
      const account = result.account;
      const privateKey = new Buffer.from(result.privateKey, 'hex');
      const contractAddr = result.contractAddr;

      web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/' + apiKey));

      const contract = new web3.eth.Contract(abi, contractAddr)
      const encodedABI = contract.methods.payout(web3.utils.numberToHex(0)).encodeABI();

      console.log("encodedABI:");
      console.log(encodedABI);

      //web3.eth.getTransactionCount(account).then( function(txCount) {
        const txCount = 131;
        var txHexData =  web3.utils.sha3('payout(uint256)').substr(0,10);
        txHexData += Util.bufferToHex(Util.setLengthLeft(0, 32)).substr(2,64);
        console.log("Tx Data:");
        console.log(txHexData);

        var rawTx = {
          nonce: web3.utils.numberToHex(txCount),
          gasPrice: web3.utils.numberToHex(web3.utils.toWei('1', 'gwei')), 
          gasLimit: web3.utils.numberToHex(70000),
          //from: account,
          to: contractAddr, // The receiving address of this transaction
          value: 0x0, //web3.utils.numberToHex(web3.utils.toWei('1', 'ether')), //txValue, 
          data: txHexData // txData
        }
        
        var tx = new Tx(rawTx);
        console.log("Raw Tx:");
        console.log(rawTx);

        console.log("Serialized Tx:");
        console.log(tx.serialize().toString('hex'));

        tx.sign(privateKey); // Here we sign the transaction with the private key
        
        const feeCost = tx.getUpfrontCost()
        console.log('Total Amount of wei needed:' + feeCost.toString())

        var serializedTx = tx.serialize(); // Clean things up a bit
        console.log("Signed Tx:");
        console.log('0x' + serializedTx.toString('hex'));

        /*
        web3.eth.sendSignedTransaction('0x'+serializedTx.toString('hex'), function(err, txHash){
          if (!err) {
            console.log("Tx hash:");
            console.log(txHash);
          } else {
            console.log(err)
          }
        })
        */
      //});
    }
});
