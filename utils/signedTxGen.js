var Web3 = require('web3');
var Tx = require('ethereumjs-tx');
var prompt = require('prompt');

var prompt_attributes = [
  {
      name: 'apiKey',
      default: '91d62b1aafc648358eb9ac3f6d884549',
  },
  {
      name: 'privateKey',
      default: '7a7dacf8e3dff4303eb403b5144f90c2fc55c614f0d6c6323124d9fefe5e58cc',
  },
  {
      name: 'contractAddr',
      default: '0xa7fea702b843dcabe24d2fadd4016b6b0dfd4fa0',
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
      var txData = web3.utils.asciiToHex('payout(0)'); 
      
      var rawTx = {
        nonce: '0x0', // Nonce is the times the address has transacted, should always be higher than the last nonce 0x0#
        gasPrice: '0x1', // 1 GWei
        gasLimit: '0x6ACFC0', // Limit to be used by the transaction, set to  7000000 GWei
        to: contractAddr, // The receiving address of this transaction
        value: txValue, // The value we are sending '0x16345785d8a0000' which is 0.1 Ether
        data: txData // The data to be sent with transaction, '0x6f6820686169206d61726b' or 'oh hai mark' 
      }
      
      var tx = new Tx(rawTx);
      console.log("Raw Tx:");
      console.log(tx.serialize().toString('hex'));

      tx.sign(privateKey); // Here we sign the transaction with the private key
      
      var serializedTx = tx.serialize(); // Clean things up a bit
      console.log("Signed Tx:");
      console.log(serializedTx.toString('hex')); // Log the resulting raw transaction hex for debugging if it fails to send
    }
});
