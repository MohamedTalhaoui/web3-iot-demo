var Web3 = require('web3');
var Tx = require('ethereumjs-tx');
var prompt = require('prompt');

var prompt_attributes = [
  {
      name: 'apiKey',
      default: '91d62b1aafc648358eb9ac3f6d884549',
  },
  {
    name: 'txHash',
    default: '0x51ca9b941970dbcc413073f5668918e836fee1b3797c257083a9ef3b57ce8448',
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
      const apiKey = result.apiKey;
      const txHash = result.txHash;

      web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/' + apiKey));

      web3.eth.getTransactionReceipt(txHash).then(function(receipt) {
        console.log("Tx Receipt:");
        console.log(receipt);
      });
    }
});
