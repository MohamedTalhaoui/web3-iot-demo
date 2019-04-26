var Web3 = require('web3');
var Tx = require('ethereumjs-tx');
var prompt = require('prompt');

var prompt_attributes = [
  {
      name: 'apiKey',
  },
  {
      name: 'privateKey',
  },
  {
      name: 'contractAddr',
      hidden: false
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
      var apiKey = result.apiKey;
      var privateKey = new Buffer.from(result.privateKey, 'hex');
      var contractAddr = result.contractAddr;

      web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/' + apiKey));

      // Value to be sent, converted to wei and then into a hex value
      var txValue = web3.utils.numberToHex(web3.utils.toWei('0', 'ether'));
      
      // Data to be sent in transaction, converted into a hex value. Normal tx's do not need this and use '0x' as default, but who wants to be normal?
      var txData = web3.utils.asciiToHex('payout()'); 
      
      var rawTx = {
        nonce: '1', // Nonce is the times the address has transacted, should always be higher than the last nonce 0x0#
        gasPrice: '0x14f46b0400', // Normal is '0x14f46b0400' or 90 GWei
        gasLimit: '0x55f0', // Limit to be used by the transaction, default is '0x55f0' or 22000 GWei
        to: contractAddr, // The receiving address of this transaction
        value: txValue, // The value we are sending '0x16345785d8a0000' which is 0.1 Ether
        data: txData // The data to be sent with transaction, '0x6f6820686169206d61726b' or 'oh hai mark' 
      }
      
      var tx = new Tx(rawTx);
      tx.sign(privateKey); // Here we sign the transaction with the private key
      
      var serializedTx = tx.serialize(); // Clean things up a bit
      
      console.log(serializedTx.toString('hex')); // Log the resulting raw transaction hex for debugging if it fails to send
    }
});
