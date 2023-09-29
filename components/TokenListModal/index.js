import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTradeFrom, setTradeTo } from "../../redux/actions";
import { Typography, Box, Modal, InputBase, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Scrollbars } from "rc-scrollbars";
import TokenIterm from "../TokenIterm/TokenIterm";
import { getAddress } from "@ethersproject/address";
import { ethers } from "ethers";
import { erc20ABI } from "wagmi";

const TokenListModal = (props) => {
  const tokenList = Object.entries(props.tokenList);
  const dispatch = useDispatch();
  const tradeInfo = useSelector((RootState) => RootState.trade);
  const { modalOpen, closeModal, modalKey, changeBalance } = props;
  const [tokens, setTokens] = useState([]);

  function isAddress(value) {
    try {
      return getAddress(value.toLowerCase());
    } catch {
      return false;
    }
  }

  const addToken = async (address) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const tokenContract = new ethers.Contract(address, erc20ABI, provider);
      const name = await tokenContract.name();
      const symbol = await tokenContract.symbol();
      const decimals = await tokenContract.decimals();

      const newToken = {
        chainId: chain.id,
        address: address,
        name: name,
        symbol: symbol,
        decimals: decimals,
        logoURI: "",
        tags: ["tokens"],
      };

      setTokens(newToken);
    } catch (e) {
      console.log(e);
    }
  };

  const searchToken = async (e) => {
    const keyword = e.target.value;

    if (isAddress(keyword)) {
      const filtered = await tokenList.filter((token, index) => {
        return (
          token[1].address.toLowerCase().indexOf(keyword.toLowerCase()) > -1
        );
      });
      if (filtered) {
        setTokens(filtered);
      } else {
        addToken(keyword);
      }
    } else {
      const filtered = await tokenList.filter((token, index) => {
        return token[1].name.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
      });
      setTokens(filtered);
    }
  };

  const changeTrade = (token) => {
    if (modalKey === "from") {
      if (token.symbol === tradeInfo.to.symbol) {
        changeBalance();
        dispatch(setTradeTo(tradeInfo.from));
        dispatch(setTradeFrom(token));
      } else dispatch(setTradeFrom(token));
    } else {
      if (token.symbol === tradeInfo.from.symbol) {
        changeBalance();
        dispatch(setTradeFrom(tradeInfo.to));
        dispatch(setTradeTo(token));
      } else dispatch(setTradeTo(token));
    }
    closeModal();
  };

  useEffect(() => {
    setTokens(tokenList);
  }, [props.tokenList]);
  
  useEffect(() => {
    return () => {
      setTokens()
    }
  }, [])
  

  return (
    <Modal
      open={modalOpen}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="tokenSelectModalBox">
        <Grid justifyContent={"space-between"} container alignItems={"center"}>
          <Typography variant="h6" component="h2" color={"white"}>
            Select a Token
          </Typography>
          <CloseIcon onClick={closeModal} className="close-button" />
        </Grid>
        <Grid className="search-box">
          <InputBase
            placeholder="Search token name or address"
            onKeyUp={(e) => searchToken(e)}
            fullWidth={true}
          />
          <SearchOutlinedIcon className="search-icon" />
        </Grid>
        <hr />
        <Grid container direction="column">
          <Scrollbars
            style={{ height: 326 }}
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}
          >
            {tokens && tokens.length ? (
              tokens.map((token, index) => {
                return (
                  <React.Fragment key={index}>
                    {(tradeInfo.from.symbol === token[1].symbol &&
                      modalKey === "from") ||
                    (tradeInfo.to.symbol === token[1].symbol &&
                      modalKey === "to") ? (
                      <TokenIterm token={token} disabled={true} index={index} />
                    ) : (
                      <TokenIterm
                        token={token}
                        changeTrade={changeTrade}
                        index={index}
                      />
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <p className="no-tokens">There is no token on the current network</p>
            )}
          </Scrollbars>
        </Grid>
      </Box>
    </Modal>
  );
};

export default TokenListModal;
