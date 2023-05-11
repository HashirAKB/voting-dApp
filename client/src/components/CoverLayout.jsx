/**
 * CoverLayout component
 * @param {Object} props - component props
 * @param {Object} props.sxBackground - inline styling for the background Box
 * @param {Node} props.children - the component's children nodes
 * @returns - a CoverLayout component with a cover image and centered content
 */
import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import HowToVoteIcon from "@mui/icons-material/HowToVote";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

// Styled component for the CoverLayout section
const CoverLayoutRoot = styled("section")(({ theme }) => ({
  color: theme.palette.common.white,
  position: "relative",
  display: "flex",
  alignItems: "center",
  [theme.breakpoints.up("sm")]: {
    height: "100vh",
    minHeight: 500,
    maxHeight: 1300,
  },
}));

// Styled Box component for the background image
const Background = styled(Box)({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  zIndex: -2,
});

function CoverLayout(props) {
  const { sxBackground, children } = props;

  // Returns the CoverLayout component with the cover image and centered content
  return (
    <CoverLayoutRoot>
      <Container
        sx={{
          mt: 3,
          mb: 14,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <HowToVoteIcon style={{ fontSize: 64 }} />
        {children}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: "common.black",
            opacity: 0.5,
            zIndex: -1,
          }}
        />
        <Background sx={sxBackground} />
      </Container>
    </CoverLayoutRoot>
  );
}

// Prop types for the CoverLayout component
CoverLayout.propTypes = {
  children: PropTypes.node,
  sxBackground: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])
    ),
    PropTypes.func,
    PropTypes.object,
  ]),
};

export default CoverLayout;
