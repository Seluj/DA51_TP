App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
    if (window.ethereum) {  // Modern dapp browsers
      App.web3Provider = window.ethereum;
      try {
        await window.ethereum.enable();  // Request account access
      } catch (error) {  // User denied account access...
        console.error("User denied account access")
      }
    } else if (window.web3) {  // Legacy dapp browsers
      App.web3Provider = window.web3.currentProvider;
    } else {  // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Crowdfunding.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var AdoptionArtifact = data;
      App.contracts.Crowdfunding = TruffleContract(AdoptionArtifact);
      // Set the provider for our contract
      App.contracts.Crowdfunding.setProvider(App.web3Provider);
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-upload', App.uploadDocument);
    $(document).on('click', '.btn-verify', App.verifyDocument);
  },

  uploadDocument: function(event) {
    event.preventDefault();
    var doc;

    const file = $('#file')[0].files[0];
    if (!file) {
        alert('Please select a file');
        return;
    }
    const reader = new FileReader();
    reader.onload = async function(e) {
        const buffer = e.target.result;
        const sha = await App.getSha256(buffer);
        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
            }
            var account = accounts[0];
            App.contracts.Crowdfunding.deployed().then(function(instance) {
                doc = instance;
                return doc.uploadDocument(sha, {from: account});
            }).then(function(result) {
                $('#status').text('Document uploaded successfully with hash: ' + sha);
            }).catch(function(err) {
                console.log(err.message);
            });

        });
    }
    reader.readAsArrayBuffer(file);
  },

  verifyDocument :function (event) {
    event.preventDefault();
    let doc;
    let sha = $('#hash').val();
    let address = $('#address').val();
    if (!sha || !address) {
        alert('Please enter a hash and address');
        return;
    }
    App.contracts.UploadDocument.deployed().then(function(instance) {
        doc = instance;
        return doc.verifyDocument(address, sha, {from: address});
    }).then(function(result) {
      const date = new Date(result * 1000); // Convert timestamp to date
        if (result !== 0) {
            $('#verify-status').text('Document is verified' + date.toString());
        } else {
            $('#verify-status').text('Document is not verified');
        }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  getSha256(result) {
    return new Promise(function (resolve, reject) {
        const buffer = new Uint8Array(result);
      crypto.subtle.digest('SHA-256', buffer).then(function (hash) {
        resolve(Array.prototype.map.call(new Uint8Array(hash), x => ('00' + x.toString(16)).slice(-2)).join(''));
      });
    })
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});