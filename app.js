if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

SimpleInsuranceContract: null;
$.getJSON("abi.json", function (abi) {
  SimpleInsuranceContract = web3.eth.contract(abi);
  let SimpleInsurance = SimpleInsuranceContract.at('0x28f2e2c20b5b191e3088fa9623bc7b89461c98e0');

  console.log(SimpleInsurance);
  
  SimpleInsurance.pool(function(error, result){
    if(!error) {
      console.log('Pool: ' + result  );
    } else {
      console.error(error);
    }
  });  
});


$("#button").click(function() {                   
  SimpleInsurance.subscribe({
      from:web3.eth.accounts[0], 
      value: 500000000000000000}, // 0.5 ETH
      function(error, result){
          if(!error) {
              console.log('Subscribed from account: ' + web3.eth.accounts[0]);
          } else {
              console.error(error);
          }
      });
});