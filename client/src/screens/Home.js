// This component represents the Home screen of the voting dApp.
// It imports necessary packages and components.
// It also initializes states using the useState hook.

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Vote from "./Vote";
import Admin from "./Admin";
import ElectionContract from "../contracts/Election.json";
import getWeb3 from "../utils/getWeb3";

export default function Home() {
  // State initialization
  const [role, setRole] = useState(2);
  const [web3, setWeb3] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);

  // This function loads the Web3 instance and sets the contract instance and current account.
  const loadWeb3 = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ElectionContract.networks[networkId];
      const instance = new web3.eth.Contract(
        ElectionContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      // Update state variables
      setWeb3(web3);
      setCurrentAccount(accounts[0]);
      setContract(instance);
      console.log("init");
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // This function gets the user's role from the smart contract.
  const getRole = async () => {
    if (contract) {
      const user = await contract.methods.getRole(currentAccount).call();
      // Update the role state variable
      setRole(parseInt(user));
      console.log("role:");
      setLoading(false);
    }
  };

  // Load Web3 instance on component mount
  useEffect(() => {
    loadWeb3();
  }, []);

  // Get user's role on contract initialization
  useEffect(() => {
    getRole();
  }, [contract]);
  return (
    <Box
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
        height: "100vh",
      }}
    >
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          Loading...
        </Box>
      ) : (
        <Box>
          {role === 1 && (
            <Admin
              role={role}
              contract={contract}
              web3={web3}
              currentAccount={currentAccount}
            />
          )}

          {role === 2 && (
            <Vote
              role={role}
              contract={contract}
              web3={web3}
              currentAccount={currentAccount}
            />
          )}

          {role === 3 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "80vh",
              }}
            >
              Unauthorized User
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
