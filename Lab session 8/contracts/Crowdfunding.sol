// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

contract Crowdfunding {
    struct Campaign {
        address payable creator;
        uint256 goal;
        uint256 deadline;
        uint256 balance;
        bool closed;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public campaignId;

    function startCampaign(uint256 _goal, uint256 _deadline) public returns (uint256) {
        require(_goal > 0, "Goal must be greater than 0");
        require(_deadline > block.timestamp, "Deadline must be in the future");

        campaigns[campaignId] = Campaign({
            creator: msg.sender,
            goal: _goal,
            deadline: _deadline,
            balance: 0,
            closed: false
        });

        campaignId++;
        return campaignId - 1;
    }

    function contribute(uint256 _campaignId) public payable returns (uint256) {
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.value > 0, "Contribution must be greater than 0");
        require(!campaign.closed, "Campaign is closed");
        require(block.timestamp < campaign.deadline, "Deadline has passed");

        campaign.balance += msg.value;
        return campaign.balance;
    }

    function checkGoalReached(uint256 _campaignId) public returns (bool) {
        Campaign storage campaign = campaigns[_campaignId];
        require(!campaign.closed, "Campaign is closed");
        //require(block.timestamp >= campaign.deadline, "Deadline has not passed");

        if (campaign.balance >= campaign.goal) {
            return true;
        } else {
            return false;
        }
    }

    function closeCampaign(uint256 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
        require(!campaign.closed, "Campaign is already closed");

        campaign.closed = true;
    }

    function withdraw(uint256 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.closed, "Campaign is not closed");
        require(msg.sender == campaign.creator, "Only the creator can withdraw funds");

        campaign.creator.transfer(campaign.balance);
    }
}
