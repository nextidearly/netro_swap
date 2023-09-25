import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  InputBase,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SwapCallsOutlinedIcon from "@mui/icons-material/SwapCallsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useSnackbar } from "notistack";
import { useAccount, useNetwork } from "wagmi";
import { ethers } from "ethers";
import { setTradeFrom, setTradeTo, initTradeInfo } from "../../redux/actions";
import TokenListModal from "../../components/TokenListModal";
import ABI from "../../environment/ERC20_ABI.json";
import Header from "../../components/Header/Header";
import SlippageModal from "../../components/Slippage/SlippageModal";
import { PROTOCOLS } from "../../environment/config";
import "./styles.scss";
import defaultImg from "../../assets/erc20.png";

const SwapPage = () => {
  const dispatch = useDispatch();
  let tradeInfo = useSelector((RootState) => RootState.trade);
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  const correctNetwork =
    chain &&
    (chain.id === 324 ||
      chain.id === 42161 ||
      chain.id === 10 ||
      chain.id === 56 ||
      chain.id === 8453);

  const { enqueueSnackbar } = useSnackbar();
  const [tokenList, setTokenList] = useState([]);
  const [pairResult, setpairResult] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [slippageModalOpen, setSlippageModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState("from");
  const [balance, setBalance] = useState(0);
  const [balanceFrom, setBalanceFrom] = useState(0);
  const [balanceTo, setBalanceTo] = useState(0);
  const [sellBalance, setSellBalance] = useState("");
  const [buyBalance, setBuyBalance] = useState("");
  const [balanceError, setBalanceError] = useState(false);
  const [unknownPrice, setUnknownPrice] = useState(false);
  const [liquidityError, setLiquidityError] = useState(false);
  const [estimatedGas, setEstimatedGas] = useState(0);
  const [router, setRouter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [txData, setTxData] = useState(null);
  const [loadingTx, setLoadingTx] = useState(false);
  const [allowanceError, setallowanceError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [pathResults, setPathResults] = useState(null);
  const [protocols, setProtocols] = useState([]);

  const showModal = (key) => {
    setModalKey(key);
    setModalOpen(true);
  };

  const calculatePrice = (value) => {
    if (Number(value) > Number(balanceFrom)) {
      setBalanceError(true);
    } else {
      setBalanceError(false);
    }

    if (value < 0) {
      setSellBalance("");
      setBuyBalance("");
    } else {
      setSellBalance(value);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const changeBalance = () => {
    setSellBalance(buyBalance);
    calculatePrice(buyBalance);
    setallowanceError(false);
  };

  const changeOrder = () => {
    setSellBalance(buyBalance);
    calculatePrice(buyBalance);
    setBalanceError(false);
    setEstimatedGas(0);
    setallowanceError(false);
    const oldOrder = {
      ...tradeInfo,
    };

    dispatch(setTradeFrom(oldOrder.to));
    dispatch(setTradeTo(oldOrder.from));
  };

  const getRouter = async () => {
    if (!chain) return;
    const API_URL = `https://api.1inch.io/v5.0/${chain.id}/approve/spender`;
    const response = await fetch(API_URL);
    const { address } = await response.json();
    setRouter(address);
  };

  const getQuote = async () => {
    if (sellBalance <= 0) return false;
    if (tradeInfo.to.address === "") return false;
    if (Number(sellBalance) > Number(balanceFrom)) return false;
    setLoading(true);
    const fromTokenAddress = tradeInfo.from.address;
    const toTokenAddress = tradeInfo.to.address;
    const amount = ethers.utils.parseUnits(
      sellBalance,
      tradeInfo.from.decimals
    );

    const quoteAPI = `https://api.1inch.io/v5.0/${chain.id}/swap?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${amount}&fromAddress=${address}&slippage=1`;

    const response = await fetch(quoteAPI);
    const quoteData = await response.json();
    setLoading(false);
    if (quoteData.statusCode === 400) {
      setErrorMsg(quoteData.description);
      if (quoteData.meta && quoteData.meta[1].type === "allowance")
        setallowanceError(true);
      // setLiquidityError(true)
      // setUnknownPrice(true)
      setBuyBalance(0);
      setEstimatedGas(0);
    } else {
      setLiquidityError(false);
      setUnknownPrice(false);
      const toTokenAmount = ethers.utils.formatUnits(
        quoteData.toTokenAmount,
        quoteData.toToken.decimals
      );
      setTxData(quoteData.tx);
      setBuyBalance(toTokenAmount);
      setEstimatedGas(quoteData.tx.gas);
    }
    // https://api.1inch.io/v5.0/1/quote?
    // const pathAPI = `https://pathfinder.1inch.io/v1.4/chain/${
    const pathAPI = `https://api.1inch.io/v5.0/${chain.id}/quote?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${amount}`;

    // const pathAPIv2 = `https://api.dexscreener.com/latest/dex/tokens/${fromTokenAddress},${toTokenAddress}`;
    const pathResponse = await fetch(pathAPI);
    const pathResults = await pathResponse.json();
    console.log("pathResults: ");
    console.log(pathResults);
    const bestProtocol = protocols.filter(
      (protocol) => protocol.id === pathResults.protocols[0][0][0].name
    );
    let paths = [];
    if (bestProtocol.length > 0) {
      const pathResult = {
        id: bestProtocol[0].id,
        img: bestProtocol[0].img,
        img_color: bestProtocol[0].img_color,
        title: bestProtocol[0].title,
        toTokenAmount: pathResults.toTokenAmount,
      };
      paths.push(pathResult);
    }
    const res = await fetch(
      `https://api.llama.fi/overview/dexs/${
        PROTOCOLS[chain ? chain.id : tradeInfo.chainId]
      }`
    );
    const result = await res.json();
    const dexList = result.protocols.sort((a, b) => {
      return a.change_1d - b.change_1d;
    });
    dexList.slice(0, 3).forEach((element, index) => {
      console.log(element);
      const pathResult = {
        id: element.defillamaId,
        img: element.logo,
        img_color: "red",
        title: element.displayName,
        toTokenAmount: pathResults.toTokenAmount,
      };
      paths.push(pathResult);
    });
    setPathResults(paths);
  };

  const getProtocols = async () => {
    const protocolAPI = `https://api.1inch.io/v5.0/${chain.id}/liquidity-sources`;
    const protocolResponse = await fetch(protocolAPI);
    const protocolList = await protocolResponse.json();
    setProtocols(protocolList.protocols);
  };
  const addDefaultImg = (e) => {
    e.target.src = defaultImg;
  };
  const getBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(address);
    setBalance(ethers.utils.formatEther(balance));
    if (tradeInfo.from.address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
      setBalanceFrom(ethers.utils.formatEther(balance));
  };

  const getTokenBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (
      tradeInfo.from.address !== "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
    ) {
      console.log(tradeInfo.from.address);
      const contractFrom = new ethers.Contract(
        tradeInfo.from.address,
        ABI,
        provider
      );
      const decimals1 = await contractFrom.decimals();
      const balance1 = await contractFrom.balanceOf(address);
      setBalanceFrom(ethers.utils.formatUnits(balance1, decimals1));
    }

    if (tradeInfo.to.symbol !== "")
      if (
        tradeInfo.to.address !== "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
      ) {
        const contractTo = new ethers.Contract(
          tradeInfo.to.address,
          ABI,
          provider
        );
        const decimals2 = await contractTo.decimals();
        const balance2 = await contractTo.balanceOf(address);
        setBalanceTo(ethers.utils.formatUnits(balance2, decimals2));
      }
  };

  const callApprove = async () => {
    setLoadingTx(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const tokenContract = new ethers.Contract(
      tradeInfo.from.address,
      ABI,
      provider
    );

    const walletSigner = provider.getSigner(address);
    const signer = tokenContract.connect(walletSigner);

    try {
      const tx = await signer.approve(
        router,
        ethers.utils.parseUnits(sellBalance, tradeInfo.from.decimals)
      );
      enqueueSnackbar(`Transaction has been submited. Tx hash: ${tx.hash}`, {
        variant: "info",
        autoHideDuration: 5000,
        style: {
          backgroundColor: "#202946",
        },
      });
      const receipt = await tx.wait();
      setLoadingTx(false);
      enqueueSnackbar(
        `Transaction has been confirmed. Tx hash: ${receipt.transactionHash}`,
        {
          variant: "info",
          autoHideDuration: 5000,
          style: {
            backgroundColor: "#202946",
          },
        }
      );
      getQuote();
    } catch (error) {
      console.log(error);
      setLoadingTx(false);
    }
  };

  const callSwap = async () => {
    setLoadingTx(true);
    const TxParams = {
      ...txData,
      gasLimit: txData.gas,
    };
    delete TxParams.gas;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const walletSigner = provider.getSigner(address);

    try {
      const transactionHash = await walletSigner.sendTransaction(TxParams);

      enqueueSnackbar(
        `Transaction has been submited. Tx hash: ${transactionHash.hash}`,
        {
          variant: "info",
          autoHideDuration: 5000,
          style: {
            backgroundColor: "#202946",
          },
        }
      );
      const receipt = await transactionHash.wait();
      setLoadingTx(false);
      enqueueSnackbar(
        `Transaction has been confirmed. Tx hash: ${receipt.transactionHash}`,
        {
          variant: "info",
          autoHideDuration: 5000,
          style: {
            backgroundColor: "#202946",
          },
        }
      );
      getBalance();
      getTokenBalance();
    } catch (error) {
      console.log(error);
      setLoadingTx(false);
    }
  };
  // get token list by chainId from 1inch
  const getTokenList = async (chainId) => {
    console.log('running')
    const API_URL = `https://api.1inch.dev/token/v1.2/8453?provider=1inch&country=US`;
    const response = await fetch(API_URL, {
      headers: {
        accept: "application/json",
        Authorization: "Bearer P58AYYSXh1rkbluNFDCOQpVzBoRowEyU",
      },
    });
    const { tokens } = await response.json();
    setTokenList(tokens);
  };

  useEffect(() => {
    getProtocols();
  }, []);

  useEffect(() => {
    if (correctNetwork) {
      getBalance();
      getTokenBalance();
    } else {
      setpairResult([]);
      setBalanceFrom(0);
      setBalanceTo(0);
      setBalance(0);
      setSellBalance("");
      setBuyBalance("");
    }
  }, [tradeInfo, correctNetwork]);

  useEffect(() => {
    setallowanceError(false);
    if (sellBalance > 0 && correctNetwork) getQuote();
  }, [sellBalance, tradeInfo, balanceFrom]);

  useEffect(() => {
    calculatePrice(sellBalance);
  }, [balanceFrom]);

  useEffect(() => {
    if (correctNetwork) {
      // initTradeState(chain.id);
      getTokenList(chain.id);
      // setpairResult([]);
      // setBalanceFrom(0);
      // setBalanceTo(0);
      // setBalance(0);
      // setSellBalance("");
      // setBuyBalance("");
    }
    // getRouter();
  }, [chain]);

  const initTradeState = (chainID) => {
    dispatch(initTradeInfo(chainID));
  };
  console.log(pathResults);
  return (
    <>
      <Grid className={modalOpen || slippageModalOpen ? "blur-background" : ""}>
        <Header />
        <Container maxWidth="md">
          <Grid className="main-wrapper" container justifyContent="center">
            <Grid className="swap-wrapper">
              <Grid container justifyContent={"space-between"}>
                <Typography variant="h1" className="title">
                  Swap tokens
                </Typography>
                <SettingsOutlinedIcon
                  className="setting-icon"
                  onClick={() => setSlippageModalOpen(true)}
                />
              </Grid>

              <Grid
                container
                direction="column"
                className="swap-form"
                rowSpacing={2}
              >
                <Grid item>
                  <Box className="token-box">
                    <Grid container alignItems={"center"}>
                      <Button
                        className="token-select"
                        onClick={(e) => showModal("from")}
                      >
                        <img
                          src={tradeInfo.from.logoURI}
                          alt="icon"
                          className="token-icon"
                          onError={(element) => {
                            addDefaultImg(element);
                          }}
                        />
                        {tradeInfo.from.symbol}
                        <ArrowDropDownIcon />
                      </Button>

                      <InputBase
                        type="number"
                        value={sellBalance}
                        placeholder="0.0000000"
                        className="input-box"
                        onChange={(e) => calculatePrice(e.target.value)}
                        disabled={!correctNetwork}
                      />
                    </Grid>
                    <Grid container justifyContent={"space-between"}>
                      <Grid className="balance-text">
                        Balance:{" "}
                        {tradeInfo.from.address ===
                        "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
                          ? Number(balance).toFixed(5)
                          : Number(balanceFrom).toFixed(5)}{" "}
                        {tradeInfo.from.symbol}
                      </Grid>

                      <Grid>
                        {balanceError && (
                          <Typography
                            textAlign={"right"}
                            className="balance-error"
                          >
                            Insufficient balance
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                <Grid container justifyContent={"center"}>
                  <div className="change-order">
                    <SwapCallsOutlinedIcon onClick={changeOrder} />
                  </div>
                </Grid>
                <Grid item>
                  <Box className="token-box">
                    <Grid container alignItems={"center"}>
                      <Button
                        className="token-select"
                        onClick={(e) => showModal("to")}
                      >
                        {tradeInfo.to.symbol ? (
                          <>
                            <img
                              src={tradeInfo.to.logoURI}
                              alt="icon"
                              className="token-icon"
                              onError={(element) => {
                                addDefaultImg(element);
                              }}
                            />
                            {tradeInfo.to.symbol}
                          </>
                        ) : (
                          <span className="text-blue">Select a Token</span>
                        )}

                        <ArrowDropDownIcon />
                      </Button>
                      <InputBase
                        type="number"
                        value={buyBalance}
                        placeholder="0.0000000"
                        className="input-box"
                        disabled={!correctNetwork}
                      />
                    </Grid>
                    <Grid className="balance-text">
                      Balance:{" "}
                      {tradeInfo.to.address ===
                      "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
                        ? Number(balance).toFixed(5)
                        : Number(balanceTo).toFixed(5)}{" "}
                      {tradeInfo.to.symbol}
                    </Grid>
                  </Box>
                </Grid>
                <Grid>
                  {estimatedGas ? (
                    <Typography color={"#a9b6bf"} textAlign={"right"}>
                      Estimated Gas: {estimatedGas}
                    </Typography>
                  ) : (
                    <></>
                  )}
                  {unknownPrice && (
                    <Typography className="unknown-price" textAlign={"right"}>
                      Unknown price <WarningAmberIcon></WarningAmberIcon>
                    </Typography>
                  )}
                  {errorMsg && (
                    <Typography className="unknown-price" textAlign={"right"}>
                      errorMsg <WarningAmberIcon></WarningAmberIcon>
                    </Typography>
                  )}
                  <Typography className="exchange-rate" textAlign={"right"}>
                    {pairResult.length > 0 ? (
                      <>
                        1 {pairResult[0].baseToken.symbol} ={" "}
                        {pairResult[0].priceNative}{" "}
                        {pairResult[0].quoteToken.symbol}
                      </>
                    ) : (
                      <></>
                    )}
                  </Typography>
                </Grid>
                <Grid item container justifyContent={"center"}>
                  {allowanceError ? (
                    <LoadingButton
                      loading={loadingTx}
                      variant="contained"
                      fullWidth
                      onClick={callApprove}
                    >
                      Approve
                    </LoadingButton>
                  ) : (
                    <>
                      {liquidityError ? (
                        <Button variant="contained" disabled fullWidth>
                          No liquidity for swap
                        </Button>
                      ) : (
                        <>
                          {isConnected ? (
                            <>
                              {balanceError || !Number(sellBalance) ? (
                                <Button
                                  variant="contained"
                                  disabled
                                  className="swap-button"
                                  fullWidth
                                >
                                  {!balanceError
                                    ? "SWAP"
                                    : "Insufficient balance"}
                                </Button>
                              ) : (
                                <Button
                                  component={"button"}
                                  variant="contained"
                                  className="swap-button"
                                  fullWidth
                                  target={"_blank"}
                                  disabled={loading}
                                  onClick={callSwap}
                                >
                                  SWAP
                                </Button>
                              )}
                            </>
                          ) : (
                            <Button variant="contained" disabled fullWidth>
                              Connect Wallet
                            </Button>
                          )}
                        </>
                      )}
                    </>
                  )}
                </Grid>
                {pathResults && pathResults.length > 0 ? (
                  <Grid className="exchanges">
                    <Typography variant="h6">Exchanges:</Typography>

                    <table border="0" cellSpacing="0" cellPadding="0">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>
                            {tradeInfo.from.name} / {tradeInfo.to.name}
                          </th>
                          <th>Diff</th>
                        </tr>
                      </thead>

                      <tbody>
                        {pathResults.map((element, index) => (
                          <tr className="dex-item" key={index}>
                            <td className="dex-name">
                              <img
                                src={element.img}
                                alt="icon"
                                className="dex-icon"
                                onError={(element) => {
                                  addDefaultImg(element);
                                }}
                              />
                              {element.title}
                            </td>
                            <td>
                              {(
                                Number(
                                  ethers.utils
                                    .formatUnits(
                                      element.toTokenAmount,
                                      tradeInfo.to.decimals
                                    )
                                    .toString()
                                ) /
                                  Number(sellBalance) -
                                (index * 0.1 + index * 0.01)
                              ).toFixed(4)}
                            </td>
                            <td>
                              {index === 0 ? (
                                <Typography className="badge best">
                                  Best
                                </Typography>
                              ) : (
                                <Typography className="badge">Match</Typography>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Grid>
                ) : (
                  <></>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Grid>
      {tokenList && (
        <TokenListModal
          modalOpen={modalOpen}
          closeModal={closeModal}
          modalKey={modalKey}
          changeBalance={changeBalance}
          tokenList={tokenList}
        />
      )}
      <SlippageModal
        modalOpen={slippageModalOpen}
        closeModal={() => setSlippageModalOpen(false)}
      />
    </>
  );
};

export default SwapPage;
