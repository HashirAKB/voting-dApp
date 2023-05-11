// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Election {
enum State {
NotStarted, // Election not started
InProgress, // Election in progress
Ended // Election ended
}

struct Candidate {
    uint256 id;        // Candidate id
    string name;       // Candidate name
    uint256 voteCount; // Candidate vote count
}

address public owner;         // Owner of the contract
State public electionState;   // Current state of the election

struct Voter {
    uint256 id;   // Voter id
    string name;  // Voter name
}

mapping(uint256 => Candidate) candidates;   // Map of candidate id to candidate object
mapping(address => bool) voted;             // Map of voter address to voting status

mapping(address => bool) isVoter;           // Map of voter address to voting eligibility status

uint256 public candidatesCount = 0;         // Count of candidates
uint256 public votersCount = 0;             // Count of voters

constructor() {
    owner = msg.sender;                     // Set contract owner to deployer
    electionState = State.NotStarted;        // Set initial state to NotStarted
    addCandidate("Candidate 1");             // Add default candidates
    addCandidate("Candidate 2");
}

event Voted(uint256 indexed _candidateId);  // Event emitted when vote is cast

function startElection() public {
    require(msg.sender == owner, "Only owner can start the election");  // Only owner can start election
    require(electionState == State.NotStarted);                         // Election should not have already started
    electionState = State.InProgress;                                   // Set state to InProgress
}

function endElection() public {
    require(msg.sender == owner, "Only owner can end the election");    // Only owner can end election
    require(electionState == State.InProgress);                         // Election should be in progress
    electionState = State.Ended;                                        // Set state to Ended
}

function addCandidate(string memory _name) public {
    require(owner == msg.sender, "Only owner can add candidates");      // Only owner can add candidates
    require(electionState == State.NotStarted, "Election has already started");  // Election should not have already started

    candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);  // Add new candidate with id and name
    candidatesCount++;                                                  // Increment count of candidates
}

function addVoter(address _voter) public {
    require(owner == msg.sender, "Only owner can add voter");           // Only owner can add voters
    require(!isVoter[_voter], "Voter already added");                    // Voter should not have already been added
    require(electionState == State.NotStarted, "Voter can't be added after election started"); // Election should not have already started

    isVoter[_voter] = true;                                             // Mark voter as eligible
    votersCount++;                                                      // Increment count of voters
}

function checkVoter(address _voter) public view returns (bool) {
    return isVoter[_voter];                                             // Return voting eligibility of voter
}


function getRole(address _current) public view returns (uint256) {
    // Returns the role of the given address
    if (owner == _current) { // If the address belongs to the owner
        return 1; // Return 1 (owner role)
    } else if (isVoter[_current]) { // If the address belongs to a registered voter
        return 2; // Return 2 (voter role)
    } else { // If the address doesn't belong to the owner or a registered voter
        return 3; // Return 3 (non-voter role)
    }
}

function vote(uint256 _candidateId) public {
    // Allows a registered voter to cast a vote for a candidate
    require(electionState == State.InProgress, "Election is not in progress"); // Requires the election to be in progress
    require(isVoter[msg.sender], "Non authorised user cannot vote"); // Requires the sender to be a registered voter
    require(!voted[msg.sender], "You have already voted"); // Requires the sender to not have voted before
    require(_candidateId >= 0 && _candidateId < candidatesCount, "Invalid candidate ID"); // Requires a valid candidate ID
    
    candidates[_candidateId].voteCount++; // Increases the vote count for the selected candidate
    voted[msg.sender] = true; // Marks the sender as having voted
    emit Voted(_candidateId); // Emits an event indicating that the given candidate received a vote
}

function getCandidateDetails(uint256 _candidateId) public view returns (string memory, uint256) {
    // Returns the name and vote count of a candidate
    require(_candidateId >= 0 && _candidateId < candidatesCount, "Invalid candidate ID"); // Requires a valid candidate ID
    return (candidates[_candidateId].name, candidates[_candidateId].voteCount); // Returns the candidate's name and vote count
}

}
