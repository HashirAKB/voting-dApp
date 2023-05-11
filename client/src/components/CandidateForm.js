import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/material";

export default function CandidateForm({ contract, web3, currentAccount }) {
  // Define a state variable for the candidate name
  const [name, setName] = useState("");

  // Define a function to handle the form submission
  const handleForm = async (event) => {
    event.preventDefault();
    try {
      // Call the addCandidate method on the contract and send a transaction
      await contract.methods.addCandidate(name).send({ from: currentAccount });
      console.log("candidate added");
    } catch (error) {
      console.log(error);
    }
    // Clear the candidate name input field
    setName("");
  };

  // Define a function to handle the candidate name input field change
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  return (
    // Create a form using the MUI Box component
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
      {/* Create a stack of components using the MUI Stack component */}
      <Stack spacing={2}>
        {/* Create a text input field using the MUI TextField component */}
        <TextField
          id="outlined-basic"
          label="Candidate Name"
          variant="outlined"
          value={name}
          onChange={handleNameChange}
        />
        {/* Create a button using the MUI Button component */}
        <Button variant="contained" type="submit">
          Add Candidates
        </Button>
      </Stack>
    </Box>
  );
}
