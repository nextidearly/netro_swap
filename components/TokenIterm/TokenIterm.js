import React from "react";
import { Grid } from "@mui/material";

export const TokenIterm = (props) => {
  return (
    <Grid
      item
      container
      className={props.disabled ? "token-item disabled" : "token-item"}
      alignItems={"center"}
      key={props.index}
      onClick={() => {
        !props.disabled && props.changeTrade(props.token[1]);
      }}
    >
      <img
        src={props.token[1].logoURI}
        alt="icon"
        className="token-icon"
        onError={(element) => {
          element.target.src = "/default.png";
        }}
      />
      {props.token[1].symbol}
    </Grid>
  );
};
export default TokenIterm;
