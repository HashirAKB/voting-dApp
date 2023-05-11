import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

// CandidateCard component to display information about a candidate
export default function Candidate({ id, name, voteCount }) {
  // Placeholder image for the candidate
  const IMG =
    "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=1400";

  return (
    // Render a card to display candidate information
    <Card sx={{ maxWidth: 345, minWidth: 300 }}>
       {/* Display the candidate's name in the card header */}
      <CardHeader
        title={
          <Typography align="center" variant="subtitle1">
            {name}
          </Typography>
        }
      />
      <CardContent sx={{ padding: 0 }}>
        <CardMedia
          component="img"
          alt="green iguana"
          height="140"
          image={IMG}
        />
      </CardContent>
      {/* Display the candidate's vote count in the card actions */}
      <CardActions sx={{ justifyContent: "center" }}>
        {voteCount && (
          <Typography align="center" variant="">
            <strong>{voteCount}</strong> votes
          </Typography>
        )}
      </CardActions>
    </Card>
  );
}
