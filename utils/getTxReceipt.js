var Web3 = require('web3');
var Tx = require('ethereumjs-tx');
var prompt = require('prompt');

var prompt_attributes = [
  {
      name: 'apiKey',
  },
  {
    name: 'txHash',
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
