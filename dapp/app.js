App = {
  web3Provider: null,
  SimpleInsurance: null,
  premium : 0.5,
  pool: null,
  account: '0x0',
  loading: false,

  init: function () {
      console.log("App init ...")
      return App.initWeb3();
  },
  
  initWeb3: async function ()  {
       if (window.ethereum) {
           web3 = new Web3(ethereum);
           App.web3Provider = web3.currentProvider;
           await ethereum.enable();
       } else if (window.web3) {
          console.log('Web3 found');
          App.web3Provider = web3.currentProvider;
          web3 = new Web3(web3.currentProvider);
      } else {
          App.web3Provider = new Web3.providers.WebsocketProvider('ws://localhost:7545');
          web3 = new Web3(App.web3Provider);
      }
      return App.initContracts();
  },

  initContracts: function () {
    $.getJSON("abi.json", function (abi) {
      let SimpleInsuranceContract = web3.eth.contract(abi);
      App.SimpleInsurance = SimpleInsuranceContract.at('0xa7fea702b843dcabe24d2fadd4016b6b0dfd4fa0');
       
      App.listenForEvents();
      return App.render();
    })
  },

  render: function () {
      console.log('Loading ... ');
      if(App.loading) {
          return;
      }
      App.loading = true;

      var loader = $("#loader");
      var content = $("#content");
      loader.show();
      content.hide();

      $('.premium').html(App.premium);
      
      web3.eth.getCoinbase(function (err, account) {
          if(err==null){
              App.account = account;
              $('#accountAddress').html("Your account: " + account);
          }
      })

      App.SimpleInsurance.pool(function(error, result){
        if(!error) {
          console.log('Pool: ' + result  );
          App.pool = web3.fromWei(result, 'ether').toNumber();
          $('.pool').html(App.pool);
        } else {
          console.error(error);
        }
      });

      console.log(App.SimpleInsurance);

      loader.hide();
      content.show();
      App.loading = false;
  },

  subscribe: function () {
    App.SimpleInsurance.subscribe({
      from:web3.eth.accounts[0], 
      value: 500000000000000000}, // 0.5 ETH
      function(error, result){
        if(!error) {
            console.log('Subscribed from account: ' + web3.eth.accounts[0]);
        } else {
            console.error(error);
        }
    });

    App.render();
  },
  
  listenForEvents: function () {
    App.SimpleInsurance.PremiumReceived({}, {fromBlock: 0, toBlock: 'latest' }).watch(function (err, event) {
      console.log('PremiumReceived event triggered');
      App.render();
    })
  }
  
}

$(function() {
  App.init();
});