// const Voting = artifacts.require("Voting");
const Election = artifacts.require("Election");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */

// Define a contract block to group the tests
contract("Election", (accounts) => {
  // Define a variable to hold the contract instance
  let electionInstance;
  const owner = accounts[0];
  const nonOwner = accounts[1];
  const voter = accounts[1];

  // Define a beforeEach block to deploy a fresh instance of the contract before each test
  beforeEach(async () => {
    electionInstance = await Election.new();
  });

  // Define the first test case
  it("allows owner to add candidates before election starts", async () => {
    // Arrange
    const owner = accounts[0];
    const candidateName = "Candidate 3";

    // Act
    await electionInstance.addCandidate(candidateName, { from: owner });

    // Assert
    const candidateDetails = await electionInstance.getCandidateDetails(2);
    assert.equal(candidateDetails[0], candidateName, "Candidate name not updated correctly");
    assert.equal(candidateDetails[1], 0, "Candidate votes should be zero initially");
  });

  it('should allow the owner to add candidates and increment their IDs', async () => {
    // Define the name of the candidate to be added
    const candidateName = 'Candidate 1';

    // Get the initial number of candidates
    const initialCandidatesCount = await electionInstance.candidatesCount();

    // Add the candidate using the owner's account
    await electionInstance.addCandidate(candidateName, { from: accounts[0] });

    // Get the updated number of candidates and candidate details
    const updatedCandidatesCount = await electionInstance.candidatesCount();
    const candidateDetails = await electionInstance.getCandidateDetails(0);

    // Assert that the updated number of candidates is one more than the initial count
    assert.equal(updatedCandidatesCount, initialCandidatesCount.toNumber() + 1, 'Candidate count not incremented correctly');

    // Assert that the candidate details are correct
    assert.equal(candidateDetails[0], candidateName, 'Candidate name not set correctly');
    assert.equal(candidateDetails[1], 0, 'Candidate vote count not initialized to 0');
  });

  it("should allow owner to add voters before the election starts", async () => {
    // const instance = await Election.deployed();
  
    // Add a new voter
    const voterAddress = accounts[1];
    await electionInstance.addVoter(voterAddress, { from: owner });
  
    // Check if the voter was added correctly
    const isVoter = await electionInstance.checkVoter(voterAddress);
    assert.isTrue(isVoter, "Voter was not added correctly");
  });

  it("voters are added correctly", async () => {
    // const votingInstance = await Voting.deployed();
    const voter1 = accounts[1];
    const voter2 = accounts[2];
  
    await electionInstance.addVoter(voter1, { from: owner });
    await electionInstance.addVoter(voter2, { from: owner });
  
    assert(await electionInstance.checkVoter(voter1));
    assert(await electionInstance.checkVoter(voter2));
  });

  it("identifies the owner, voters, and non-voters correctly using the getRole function", async () => {
    // const electionInstance = await Voting.deployed();
    await electionInstance.addVoter(accounts[1], { from: owner });
    const ownerRole = await electionInstance.getRole(owner);
    const voter1Role = await electionInstance.getRole(accounts[1]);
    const nonVoterRole = await electionInstance.getRole(accounts[9]);
  
    assert.equal(ownerRole, 1);
    assert.equal(voter1Role, 2);
    assert.equal(nonVoterRole, 3);
  });

  // Test case for the owner to start the election
  it("should allow owner to start the election", async () => {
    await electionInstance.startElection({ from: accounts[0] });
    const electionState = await electionInstance.electionState();
    assert.equal(electionState, 1, "Election state should be InProgress");
  });
  
  // Test case for the owner to end the election
  it("should allow owner to end the election", async () => {
    // let currentState = await electionInstance.electionState();
    // console.log("Current state: ", currentState.toNumber());
    await electionInstance.startElection({ from: accounts[0] });
    await electionInstance.endElection({ from: accounts[0] });
    // let newState = await electionInstance.electionState();
    // console.log("New state: ", newState.toNumber());
    const electionState = await electionInstance.electionState();
    assert.equal(electionState, 2, "Election state should be Ended");
  });

      // Test case for only authorised voters being able to vote
it("should only allow authorised voters to vote", async () => {
  // Add a candidate and a non-authorised voter
  await electionInstance.addCandidate("Jane Doe");
  await electionInstance.addVoter(accounts[1], { from: accounts[0] });
  await electionInstance.startElection({ from: accounts[0] });
  // Attempt to cast a vote from a non-authorised address
  try {
  await electionInstance.vote(1, { from: accounts[2] });
  } catch (err) {
  assert.include(
  err.message,
  "Non authorised user cannot vote",
  "Should throw an error"
  );
  return;
  }
  assert.fail("Should have thrown an error");
  });

  // Test case for the vote count being incremented correctly for the chosen candidate
  it("should increment the vote count for the chosen candidate", async () => {
  // Add two candidates and a voter
  await electionInstance.addCandidate("John Smith");
  await electionInstance.addCandidate("Jane Doe");
  await electionInstance.addVoter(accounts[1], { from: accounts[0] });
  await electionInstance.startElection({ from: accounts[0] });
  // Cast a vote for the first candidate
  await electionInstance.vote(1, { from: accounts[1] });
  // Get the candidate details
  const candidateDetails = await electionInstance.getCandidateDetails(1);
  // Check that the vote count has been incremented
  assert.equal(candidateDetails[1], 1, "Vote count should be 1");
  });

  // Test case for getCandidateDetails function returning correct details
  it("should return the correct details for a given candidate ID", async () => {
  // Add a candidate
  // await electionInstance.addCandidate("John Smith", { from: accounts[0] });
  // Get the candidate details and check if they match the added candidate
  const candidateDetails = await electionInstance.getCandidateDetails(0);
  assert.equal(candidateDetails[0], "Candidate 1", "Name should match");
  assert.equal(candidateDetails[1], 0, "Vote count should be zero");
  });

  // Test case for contract behavior when election is in progress
  it("should allow voting when election is in progress", async () => {
    // await electionInstance.addCandidate("John Smith");
    await electionInstance.addVoter(accounts[1], { from: accounts[0] });
    await electionInstance.startElection({ from: accounts[0] });
    // Vote for candidate 1
    await electionInstance.vote(0, { from: accounts[1] });
  
    // Get the candidate details to check the vote count
    const candidateDetails = await electionInstance.getCandidateDetails(0);
    assert.equal(candidateDetails[0], "Candidate 1", "Name should match");
    assert.equal(candidateDetails[1], 1, "Vote count should be one");
    });  

  // Test that non-owners cannot add candidates
  it('does not allow non-owners to add candidates', async function() {
    // Attempt to add a candidate from a non-owner account
    try {
      await electionInstance.addCandidate('Candidate 3', {from: nonOwner});
      assert.fail('Expected an error but none was thrown');
    } catch(error) {
      assert.include(
        error.message,
        'revert Only owner can add candidates',
        'Non-owner was able to add a candidate'
      );
    }
    // Verify that no candidate was added
    const candidateCount = await electionInstance.candidatesCount();
    assert.equal(candidateCount, 2, 'Unexpected number of candidates');
  });


  it('should not allow non-owners to add candidates', async () => {
    // Define the name of the candidate to be added
    const candidateName = 'Candidate 1';

    // Attempt to add the candidate using a non-owner account
    try {
      await electionInstance.addCandidate(candidateName, { from: accounts[1] });
      assert.fail('Expected addCandidate function to throw');
    } catch (error) {
      // Check that the error message contains the expected text
      assert.include(error.message, 'Only owner can add candidates', 'Incorrect error message');
    }
  });

  it("non-owners cannot add voters", async () => {
    // const votingInstance = await Voting.deployed();
    const nonOwner = accounts[1];
  
    try {
      await electionInstance.addVoter(nonOwner, { from: nonOwner });
    } catch (err) {
      assert(err.message.includes("Only owner can add voter"));
      return;
    }
    assert(false, "The function did not throw");
  });
  
  // Test case for non-owners not being able to start the election
  it("should not allow non-owner to start the election", async () => {
    try {
      await electionInstance.startElection({ from: accounts[1] });
    } catch (err) {
      assert.include(
        err.message,
        "Only owner can start the election",
        "Should throw an error"
      );
      return;
    }
    assert.fail("Should have thrown an error");
  });
  
  // Test case for non-owners not being able to end the election
  it("should not allow non-owner to end the election", async () => {
    try {
      await electionInstance.endElection({ from: accounts[1] });
    } catch (err) {
      assert.include(
        err.message,
        "Only owner can end the election",
        "Should throw an error"
      );
      return;
    }
    assert.fail("Should have thrown an error");
  });



  /*/
  // Test that only one vote can be cast per address.
  it("should allow only one vote per address", async () => {
    await electionInstance.addVoter(accounts[1], { from: accounts[0] });
    await electionInstance.startElection({ from: accounts[0] });
    // Cast a vote for candidate 1
    await electionInstance.vote(1, { from: accounts[1] });    
    // Try to cast another vote for candidate 2 from the same address
    await truffleAssert.reverts(
        electionInstance.vote(2, { from: accounts[1] }),
      "Already voted"
    );
    */


// Test case for only one vote being cast per address
it("should only allow one vote per address", async () => {
    // Add a candidate and voter
    await electionInstance.addCandidate("John Smith");
    await electionInstance.addVoter(accounts[1], { from: accounts[0] });
    await electionInstance.startElection({ from: accounts[0] });    
   // Cast the first vote
    await electionInstance.vote(1, { from: accounts[1] });    
    // Attempt to cast a second vote from the same address
    try {
    await electionInstance.vote(1, { from: accounts[1] });
    } catch (err) {
    assert.include(
    err.message,
    "You have already voted",
    "Should throw an error"
    );
    return;
    }
    assert.fail("Should have thrown an error");
    });
    
    // Test case for an error being thrown when an invalid candidate ID is provided
    it("should throw an error when an invalid candidate ID is provided", async () => {
    // Add a candidate and a voter
    await electionInstance.addCandidate("John Smith");
    await electionInstance.addVoter(accounts[1], { from: accounts[0] });
    await electionInstance.startElection({ from: accounts[0] });
    // Attempt to cast a vote with an invalid candidate ID
    try {
    await electionInstance.vote(3, { from: accounts[1] });
    } catch (err) {
    assert.include(
    err.message,
    "Invalid candidate ID",
    "Should throw an error"
    );
    return;
    }
    assert.fail("Should have thrown an error");
    });

// Test case for contract behavior when election has not started
it("should not allow voting when election has not started", async () => {
    // await electionInstance.addCandidate("John Smith");
    await electionInstance.addVoter(accounts[1], { from: accounts[0] });
    // await electionInstance.startElection({ from: accounts[0] });
    // Attempt to vote before starting the election
try {
    await electionInstance.vote(1, { from: accounts[1] });
} catch (err) {
    assert.include(
        err.message,
        "Election is not in progress",
        "Should throw an error"
    );
    return;
}
assert.fail("Should have thrown an error");
});

// Test case for contract behavior when election has ended
it("should not allow voting when election has ended", async () => {
    // await electionInstance.addCandidate("John Smith");
    await electionInstance.addVoter(accounts[1], { from: accounts[0] });
    await electionInstance.startElection({ from: accounts[0] });
    // End the election
await electionInstance.endElection({ from: accounts[0] });

// Attempt to vote after ending the election
try {
    await electionInstance.vote(1, { from: accounts[1] });
} catch (err) {
    assert.include(
        err.message,
        "Election is not in progress",
        "Should throw an error"
    );
    return;
}
assert.fail("Should have thrown an error");
});

});