App = {
    web3Provider: null,
    contracts: {},

    init: async function () {
        return await App.initWeb3();
    },

    initWeb3: async function () {
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

    initContract: function () {
        $.getJSON('Crowdfunding.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            var AdoptionArtifact = data;
            App.contracts.Crowdfunding = TruffleContract(AdoptionArtifact);
            // Set the provider for our contract
            App.contracts.Crowdfunding.setProvider(App.web3Provider);
        });
        return App.bindEvents();
    },

    bindEvents: function () {
        $(document).on('click', '.btn-start-campaign', App.startCampaignJs);
        $(document).on('click', '.btn-contribute', App.contributeJs);
        $(document).on('click', '.btn-check-goal', App.checkGoalJs);
        $(document).on('click', '.btn-withdraw', App.withdrawJs);
        $(document).on('click', '.btn-close', App.closeCampaignJs);
    },

    startCampaignJs: function (event) {
        event.preventDefault();
        var doc;
        const goal = $('#goal').val();
        if (!goal) {
            alert('Please enter a goal');
            return;
        }
        const deadline = $('#deadline').val();
        if (!deadline) {
            alert('Please enter a deadline');
            return;
        }
        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }
            var account = accounts[0];
            App.contracts.Crowdfunding.deployed().then(function (instance) {
                doc = instance;
                return doc.startCampaign(goal, deadline, {from: account});
            }).then(function (result) {
                $('#startCampaignResult').text('Campaign started successfully' + result);
            }).catch(function (err) {
                console.log(err.message);
            });
        });
    },

    contributeJs: function (event) {
        event.preventDefault();
        var doc;
        const campaignId = $('#campaignId').val();
        const amount = $('#amount').val();
        if (!amount) {
            alert('Please enter an amount');
            return;
        }
        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }
            var account = accounts[0];
            App.contracts.Crowdfunding.deployed().then(function (instance) {
                doc = instance;
                return doc.contribute(campaignId, {from: account, value: amount});
            }).then(function (result) {
                $('#contributeResult').text('Contribution successful, balance:' + result);
            }).catch(function (err) {
                console.log(err.message);
            });
        });
    },

    checkGoalJs: function (event) {
        event.preventDefault();
        const campaignId = $('#campaignIdCheck').val();
        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }
            var account = accounts[0];
            App.contracts.Crowdfunding.deployed().then(function (instance) {
                return instance.checkGoalReached(campaignId, {from: account});
            }).then(function (result) {
                if (result) {
                    $('#checkGoalResult').text('Goal reached');
                } else {
                    $('#checkGoalResult').text('Goal not reached');
                }
            }).catch(function (err) {
                console.log(err.message);
            });
        });
    },

    closeCampaignJs: function (event) {
        event.preventDefault();
        const campaignId = $('#campaignIdClose').val();
        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }
            var account = accounts[0];
            App.contracts.Crowdfunding.deployed().then(function (instance) {
                return instance.close(campaignId, {from: account});
            }).then(function (result) {
                $('#closeResult').text('Campaign closed');
            }).catch(function (err) {
                console.log(err.message);
            });
        });
    },

    withdrawJs: function (event) {
        event.preventDefault();
        const campaignId = $('#campaignIdClose').val();
        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }
            var account = accounts[0];
            App.contracts.Crowdfunding.deployed().then(function (instance) {
                return instance.withdraw(campaignId, {from: account});
            }).then(function (result) {
                $('#withdrawResult').text('Withdrawal successful');
            }).catch(function (err) {
                console.log(err.message);
            });
        });
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});