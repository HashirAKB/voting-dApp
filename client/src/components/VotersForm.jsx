// This component is responsible for rendering a form that enables the user to add a voter to the blockchain.
// It receives props such as contract, web3 and currentAccount which are used to interact with the blockchain and add the voter.
// It uses the useState hook to manage the state of the input field for the voter's name.

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/material";

export default function VotersForm({ contract, web3, currentAccount }) {
  // Define the state variable for the voter's name
  const [name, setName] = useState("");

  // Handles the submission of the form by calling the addVoter function of the contract and passing the voter's name
  const handleForm = async (event) => {
    event.preventDefault();
    try {
      await contract.methods.addVoter(name).send({ from: currentAccount });
      console.log("voter added");
    } catch (error) {
      console.log(error);
    }
    setName("");
  };

  // Handles changes to the voter's name input field
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  // Renders the form
  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "2rem",
        width: "40%",
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleForm}
    >
      <Stack spacing={2}>
        <TextField
          id="outlined-basic"
          label="Voters Address"
          variant="outlined"
          value={name}
          onChange={handleNameChange}
        />
        <Button variant="contained" type="submit">
          Add Voter
        </Button>
      </Stack>
    </Box>
  );
}
