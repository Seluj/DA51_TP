const Lab9Token = artifacts.require("Lab9Token");

contract("Lab9Token", (accounts) => {
  let lab9TokenInstance;

  const [owner, account1, account2] = accounts;

  before(async () => {
    lab9TokenInstance = await Lab9Token.new();
  });

  it("should have correct initial values", async () => {
    const name = await lab9TokenInstance.name();
    const symbol = await lab9TokenInstance.symbol();
    const decimals = await lab9TokenInstance.decimals();

    assert.equal(name, "DA51-Lab9", "Name is incorrect");
    assert.equal(symbol, "Lab9", "Symbol is incorrect");
    assert.equal(decimals.toNumber(), 18, "Decimals is incorrect");
  });

  it("should allow an account to approve another for spending", async () => {
    const approveAmount = 1000;

    const tx = await lab9TokenInstance.approve(account1, approveAmount, { from: owner });
    const allowance = await lab9TokenInstance.allowed(owner, account1);

    assert.equal(allowance.toNumber(), approveAmount, "Allowance is incorrect");
    assert.equal(tx.logs[0].event, "Approval", "Approval event not emitted");
  });

  it("should allow transfer of tokens between accounts", async () => {
    const initialOwnerBalance = await lab9TokenInstance.balanceOf(owner);
    const transferAmount = 500;

    await lab9TokenInstance.transfer(account1, transferAmount, { from: owner });

    const newOwnerBalance = await lab9TokenInstance.balanceOf(owner);
    const recipientBalance = await lab9TokenInstance.balanceOf(account1);

    assert.equal(
      newOwnerBalance.toNumber(),
      initialOwnerBalance.toNumber() - transferAmount,
      "Owner balance incorrect after transfer"
    );
    assert.equal(recipientBalance.toNumber(), transferAmount, "Recipient balance incorrect after transfer");
  });

  it("should fail transfer if balance is insufficient", async () => {
    const transferAmount = 10000;

    try {
      await lab9TokenInstance.transfer(account1, transferAmount, { from: account2 });
      assert.fail("Transfer should have thrown");
    } catch (err) {
      assert.include(err.message, "Insufficient balance", "Incorrect error message");
    }
  });

  it("should allow transferFrom if allowed and sufficient balance", async () => {
    const approveAmount = 500;
    const transferAmount = 200;

    await lab9TokenInstance.approve(account2, approveAmount, { from: owner });
    await lab9TokenInstance.transferFrom(owner, account1, transferAmount, { from: account2 });

    const ownerBalance = await lab9TokenInstance.balanceOf(owner);
    const recipientBalance = await lab9TokenInstance.balanceOf(account1);
    const allowance = await lab9TokenInstance.allowed(owner, account2);

    assert.equal(allowance.toNumber(), approveAmount - transferAmount, "Allowance not updated correctly");
    assert.equal(recipientBalance.toNumber(), transferAmount, "Recipient balance incorrect");
  });

  it("should fail transferFrom if allowance is exceeded", async () => {
    const transferAmount = 600;

    try {
      await lab9TokenInstance.transferFrom(owner, account1, transferAmount, { from: account2 });
      assert.fail("TransferFrom should have thrown");
    } catch (err) {
      assert.include(err.message, "Allowance exceeded", "Incorrect error message");
    }
  });
});