const Crowdfunding = artifacts.require("Crowdfunding");

contract("Crowdfunding", (accounts) => {
    let crowdfundingInstance;

    const [creator, contributor] = accounts;

    beforeEach(async () => {
        crowdfundingInstance = await Crowdfunding.new();
    });

    it("should start a campaign", async () => {
        const goal = web3.utils.toWei("10", "ether");
        const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

        await crowdfundingInstance.startCampaign(goal, deadline, { from: creator });

        const campaign = await crowdfundingInstance.campaigns(0);
        assert.equal(campaign.creator, creator, "Campaign creator is incorrect");
        assert.equal(campaign.goal.toString(), goal, "Campaign goal is incorrect");
        assert.equal(campaign.deadline.toNumber(), deadline, "Campaign deadline is incorrect");
        assert.equal(campaign.balance.toString(), "0", "Campaign balance should start at 0");
        assert.equal(campaign.closed, false, "Campaign should not be closed initially");
    });

    it("should allow contributions", async () => {
        const goal = web3.utils.toWei("10", "ether");
        const deadline = Math.floor(Date.now() / 1000) + 3600;

        await crowdfundingInstance.startCampaign(goal, deadline, { from: creator });

        const contributionAmount = web3.utils.toWei("1", "ether");
        await crowdfundingInstance.contribute(0, { from: contributor, value: contributionAmount });

        const campaign = await crowdfundingInstance.campaigns(0);
        assert.equal(campaign.balance.toString(), contributionAmount, "Campaign balance should reflect the contribution");
    });

    it("should close the campaign and allow withdrawal when the goal is reached", async () => {
        const goal = web3.utils.toWei("2", "ether");
        const deadline = Math.floor(Date.now() / 1000) + 3600;

        await crowdfundingInstance.startCampaign(goal, deadline, { from: creator });

        await crowdfundingInstance.contribute(0, { from: contributor, value: web3.utils.toWei("2", "ether") });

        await crowdfundingInstance.checkGoalReached(0, { from: creator });

        const campaign = await crowdfundingInstance.campaigns(0);
        assert.equal(campaign.closed, true, "Campaign should be closed after goal is reached");

        const initialBalance = web3.utils.toBN(await web3.eth.getBalance(creator));
        await crowdfundingInstance.withdraw(0, { from: creator });

        const finalBalance = web3.utils.toBN(await web3.eth.getBalance(creator));
        assert(finalBalance.gt(initialBalance), "Creator should have withdrawn funds");
    });

    it("should fail to contribute after the campaign deadline", async () => {
        const goal = web3.utils.toWei("10", "ether");
        const deadline = Math.floor(Date.now() / 1000) + 1; // 1 second from now

        await crowdfundingInstance.startCampaign(goal, deadline, { from: creator });

        await new Promise((resolve) => setTimeout(resolve, 2000));

        try {
            await crowdfundingInstance.contribute(0, { from: contributor, value: web3.utils.toWei("1", "ether") });
            assert.fail("Contribution should fail after the deadline");
        } catch (error) {
            assert(error.message.includes("Deadline has passed"), "Expected 'Deadline has passed' error");
        }
    });
});
