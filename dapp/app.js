App = {
  web3Provider: null,
  SimpleInsurance: null,
  premium : 0.1,
  pool: null,
  account: '0x0',
  loading: false,
  holders: new Map(),

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
      //App.SimpleInsurance = SimpleInsuranceContract.at('0x7b61ff44894a397589bd4d4f8be8f5cac0363217');
      App.SimpleInsurance = SimpleInsuranceContract.at('0x23eb8e8c933f4a39838892497d852bf598d4c3f8');
             
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
      
      App.account = web3.eth.accounts[0];
      $('#accountAddress').html("Your account: " + App.account);
      setInterval(function() {
        if (web3.eth.accounts[0] !== App.account) {
          App.account = web3.eth.accounts[0];
          $('#accountAddress').html("Your account: " + App.account);
        }
      }, 100);
      
      App.SimpleInsurance.pool(function(error, result){
        if(!error) {
          console.log('Pool: ' + result  );
          App.pool = web3.fromWei(result, 'ether').toNumber();
          $('.pool').html(App.pool);
        } else {
          console.error(error);
        }
      });

      var container = $('#holders');
      $('#holders tbody').empty();
      table = $('#holders tbody');
      let holdersAddresses = App.holders.keys();
      for (let address of holdersAddresses) { 
        var tr = $('<tr>');
        tr.append('<td>' + address + '</td>');
        let holder = App.holders.get(address);
        tr.append('<td>' + holder.name + '</td>');
        tr.append('<td data-align="left">' + holder.value + '</td>');
        table.append(tr);
      }
      container.append(table);

      console.log(App.SimpleInsurance);

      loader.hide();
      content.show();
      App.loading = false;
  },

  subscribe: function () {
    var holderName = $('#holderName').val();

    App.SimpleInsurance.subscribe(holderName, {
      from:web3.eth.accounts[0], 
      value: web3.toWei(App.premium, 'ether')},
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
    App.SimpleInsurance.HolderUpdate({}, {fromBlock: 0, toBlock: 'latest' }).watch(function (err, event) {
      if(!err) {
        console.log("Holder Update event received");
        let holderInfo = event.args;
        console.log(holderInfo);
        let holder = {};
        holderBalance =  web3.fromWei(holderInfo.balance, 'ether').toNumber();
        if(holderBalance === 0) {
          App.holders.delete(holderInfo.holder);
        } else {
          if(App.holders.has(holderInfo.holder)) {
            holder = App.holders.get(holderInfo.holder);
            holder.value += Number(holderBalance);
          } else {
            holder.name = holderInfo.name;
            holder.amount = holderBalance;
            holder.value = holderBalance;
          }
          App.holders.set(holderInfo.holder, holder);  
        }
        App.render();
      } else {
        console.log(err);
      }
    });

  }
  
}

$(function() {
  App.init();
});