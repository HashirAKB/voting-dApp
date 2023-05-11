import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

import Candidate from "../components/CandidateCard";

export default function Vote({ role, contract, web3, currentAccount }) {
  // Declare state variables
  const [candidates, setCandidates] = useState([]); // Candidates array
  const [vote, setVote] = useState(null); // Selected candidate
  const [electionState, setElectionState] = useState(0); // Election state

  const [open, setOpen] = useState(false); // Modal state

  // Get candidates from the smart contract
  const getCandidates = async () => {
    if (contract) {
      const count = await contract.methods.candidatesCount().call();
      const temp = [];
      for (let i = 0; i < count; i++) {
        const candidate = await contract.methods.getCandidateDetails(i).call();
        temp.push({ name: candidate[0], votes: candidate[1] });
      }
      setCandidates(temp);
    }
  };

  // Vote for a candidate
  const voteCandidate = async (candidate) => {
    try {
      if (contract) {
        await contract.methods.vote(candidate).send({ from: currentAccount });
        getCandidates();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Get the current state of the election
  const getElectionState = async () => {
    if (contract) {
      const state = await contract.methods.electionState().call();
      setElectionState(parseInt(state));
    }
  };

  // Get the initial state of the election and the candidates
  useEffect(() => {
    getElectionState();
    getCandidates();
  }, [contract]);

  // Handle the change of the selected candidate
  const handleVoteChange = (event) => {
    setVote(event.target.value);
  };

  // Handle the vote submission
  const handleVote = (event) => {
    event.preventDefault();
    voteCandidate(vote);
  };

  return (
    <Box>
      <form onSubmit={handleVote}>
        <Grid container sx={{ mt: 0 }} spacing={6} justifyContent="center">
          <Grid item xs={12}>
            <Typography align="center" variant="h6">
              {electionState === 0 &&
                "Please Wait... Election has not started yet."}
              {electionState === 1 && "VOTE FOR YOUR FAVOURITE CANDIDATE"}
              {electionState === 2 &&
                "Election has ended. See the results below."}
            </Typography>
            <Divider />
          </Grid>
          {electionState === 1 && (
            <>
              <Grid item xs={12}>
                <FormControl>
                  <RadioGroup
                    row
                    sx={{
                      overflowY: "hidden",
                      overflowX: "auto",
                      display: "flex",
                      width: "98vw",
                      justifyContent: "center",
                    }}
                    value={vote}
                    onChange={handleVoteChange}
                  >
                    {candidates.map((candidate, index) => (
                      <FormControlLabel
                        key={index}
                        labelPlacement="top"
                        control={<Radio />}
                        value={index}
                        label={<Candidate id={index} name={candidate.name} />}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <div style={{ margin: 20 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ width: "100%" }}
                  >
                    Vote
                  </Button>
                </div>
              </Grid>
            </>
          )}

          {electionState === 2 && (
            <Grid
              item
              xs={12}
              sx={{
                overflowY: "hidden",
                overflowX: "auto",
                display: "flex",
                width: "98vw",
                justifyContent: "center",
              }}
            >
              {candidates &&
                candidates.map((candidate, index) => (
                  <Box sx={{ mx: 2 }} key={index}>
                    <Candidate
                      id={index}
                      name={candidate.name}
                      voteCount={candidate.votes}
                    />
                  </Box>
                ))}
            </Grid>
          )}
        </Grid>
      </form>
    </Box>
  );
}
