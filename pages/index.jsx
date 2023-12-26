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
import { setTradeFrom, setTradeTo, initTradeInfo } from "../redux/actions";
import TokenListModal from "../components/TokenListModal";
import ABI from "../environment/ERC20_ABI.json";
import Header from "../components/Header/Header";
import SlippageModal from "../components/Slippage/SlippageModal";
import { PROTOCOLS, ROUTER } from "../environment/config";
import { TOKEN_LIST } from "../environment/tokenList";
import {
  get_protocols,
  // get_router,
  quote,
  swap,
  // token_list,
} from "@/utils/api";
import Head from "next/head";
import Footer from "@/components/Footer/Footer";
import { useTranslation } from "react-i18next";
import Skeleton from "@mui/material/Skeleton";

const SwapPage = () => {
  const dispatch = useDispatch();
  let tradeInfo = useSelector((RootState) => RootState.trade);
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { t } = useTranslation();

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
  const [loading, setLoading] = useState(false);
  const [txData, setTxData] = useState(null);
  const [loadingTx, setLoadingTx] = useState(false);
  const [allowanceError, setallowanceError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [pathResults, setPathResults] = useState(null);
  const [protocols, setProtocols] = useState([]);
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const [router, setRouter] = useState(ROUTER);
  const [timer, setTimer] = useState();
  const [loadingPrice, setLodadingPrice] = useState(false);

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
    const oldOrder = {
      ...tradeInfo,
    };

    if (oldOrder.to.address) {
      setSellBalance(buyBalance);
      calculatePrice(buyBalance);
      setBalanceError(false);
      setEstimatedGas(0);
      setallowanceError(false);
      dispatch(setTradeFrom(oldOrder.to));
      dispatch(setTradeTo(oldOrder.from));
    }
  };

  const clearTimer = () => {
    clearTimeout(timer);
  };

  const fetchingPrice = async (
    fromTokenAddress,
    toTokenAddress,
    amount,
    chain
  ) => {
    const pathResponse = await quote(
      fromTokenAddress,
      toTokenAddress,
      amount,
      chain
    );

    if (pathResponse.status === 429) {
      fetchingPrice(fromTokenAddress, toTokenAddress, amount, chain);
    }

    if (!pathResponse.ok) return;

    const pathResults = await pathResponse.json();

    const toTokenAmount = ethers.utils.formatUnits(
      pathResults.toAmount,
      pathResults.toToken.decimals
    );

    setBuyBalance(toTokenAmount);
    setEstimatedGas(pathResults.gas);

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
        toTokenAmount: pathResults.toAmount,
      };
      paths.push(pathResult);
    }

    const res = await fetch(
      `https://api.llama.fi/overview/dexs/${
        PROTOCOLS[chain ? chain : tradeInfo.chainId]
      }`
    );
    const result = await res.json();
    const dexList = result.protocols.sort((a, b) => {
      return a.change_1d - b.change_1d;
    });
    dexList.slice(0, 3).forEach((element, index) => {
      const pathResult = {
        id: element.defillamaId,
        img: element.logo,
        img_color: "red",
        title: element.displayName,
        toTokenAmount: pathResults.toAmount,
      };
      paths.push(pathResult);
    });
    setPathResults(paths);
    setLodadingPrice(false);
  };

  // const getRouter = async () => {
  //   if (!chain) return;
  //   const response = await get_router(chain.id);
  //   if (response.status !== 429) {
  //     const { address } = await response.json();
  //     setRouter(address);
  //     console.log(address, "router");
  //   } else {
  //     setTimeout(() => {
  //       getRouter();
  //     }, 100);
  //   }
  // };

  const getQuote = () => {
    clearTimer(timer);
    setLodadingPrice(true);
    const timeDuration = setTimeout(async () => {
      if (sellBalance <= 0) return false;
      if (tradeInfo.to.address === "") return false;
      setLoading(true);
      const fromTokenAddress = tradeInfo.from.address;
      const toTokenAddress = tradeInfo.to.address;
      const amount = ethers.utils.parseUnits(
        sellBalance,
        tradeInfo.from.decimals
      );

      const response = await swap(
        fromTokenAddress,
        toTokenAddress,
        amount,
        chain.id,
        address
      );

      if (response.status === 429) {
        getQuote();
      } else {
        const quoteData = await response.json();
        setLoading(false);
        if (quoteData.statusCode === 400) {
          setErrorMsg(quoteData.description);
          if (quoteData.meta && quoteData?.meta[1]?.type === "allowance")
            setallowanceError(true);
          setBuyBalance(0);
          setEstimatedGas(0);
        } else {
          setErrorMsg("");
          setLiquidityError(false);
          setUnknownPrice(false);
          const toTokenAmount = ethers.utils.formatUnits(
            quoteData.toAmount,
            quoteData.toToken.decimals
          );
          setTxData(quoteData.tx);
          setBuyBalance(toTokenAmount);
          setEstimatedGas(quoteData.tx.gas);
        }
      }
      fetchingPrice(fromTokenAddress, toTokenAddress, amount, chain.id);
    }, 1000);
    setTimer(timeDuration);
  };

  const getProtocols = async () => {
    const protocolResponse = await get_protocols(chain.id);
    if (protocolResponse.status !== 429) {
      const protocolList = await protocolResponse.json();
      setProtocols(protocolList.protocols);
    }
  };

  const addDefaultImg = (e) => {
    e.target.src = "/default.png";
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
      setallowanceError(false);
      getQuote();
      setErrorMsg("");
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
            backgroundColor: "#203a48",
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
            backgroundColor: "#203a48",
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

  const getTokenList = async (chainId) => {
    const res = await token_list(chainId);
    if (res.status !== 429) {
      const response = await res.json();
      setTokenList(response.tokens);
    } else {
      setTimeout(() => {
        getTokenList(chainId);
      }, 100);
    }
  };

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
    setErrorMsg("");
    if (sellBalance > 0 && correctNetwork) getQuote();
  }, [sellBalance, tradeInfo, balanceFrom]);

  useEffect(() => {
    calculatePrice(sellBalance);
  }, [balanceFrom]);

  useEffect(() => {
    const network =
      chain &&
      (chain.id === 1 ||
        chain.id === 137 ||
        chain.id === 10 ||
        chain.id === 8453 ||
        chain.id === 42161 ||
        chain.id === 56 ||
        chain.id === 324);
    if (network) {
      // getTokenList(chain.id);
      setTokenList(TOKEN_LIST[chain.id]);
      getProtocols();
      // getRouter(chain.id);
      // getTokenList(chain.id)
      setCorrectNetwork(network);
      initTradeState(chain.id);
      setpairResult([]);
      setBalanceFrom(0);
      setBalanceTo(0);
      setBalance(0);
      setSellBalance("");
      setBuyBalance("");
    } else {
      setCorrectNetwork(false);
      setTokenList(TOKEN_LIST[1]);
    }

    if (chain?.id === 137) {
      dispatch(
        setTradeFrom({
          symbol: "MATIC",
          name: "MATIC",
          address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
          logoURI: "/assets/matic.webp",
          decimals: 18,
        })
      );
    }
  }, [chain]);

  const initTradeState = (chainID) => {
    dispatch(initTradeInfo(chainID));
  };

  return (
    <>
      <div className="page">
        <Grid
          className={modalOpen || slippageModalOpen ? "blur-background" : ""}
        >
          <Header />
          <Head>
            <title>Swap | SNOW Finance</title>
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="/apple-touch-icon.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/favicon-32x32.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/favicon-16x16.png"
            />
            <link rel="manifest" href="/site.webmanifest" />{" "}
            <meta
              name="description"
              content="SNOW is the leading swap platform on Base"
            />
            <meta
              name="keywords"
              content="Defi, Base, Dex, Dex Aggregator, SNOW "
            />
            <meta property="og:title" content={`SNOW | SNOW Finance`} />
            <meta property="og:type" content="website" />
            <meta
              property="og:description"
              content={`SNOW is the Dex aggregator on Base network`}
            />
            <meta
              property="og:url"
              content={`https://SNOWbase-swap.netlify.app/`}
            />
            <meta property="og:site_name" content="SNOW Swap Base"></meta>
            <meta
              property="og:image"
              content="https://SNOWbase-swap.netlify.app/logo_new.png"
            ></meta>
            <meta property="og:image:type" content="image/png"></meta>
            <meta property="og:image:width" content="2000"></meta>
            <meta property="og:image:height" content="2000"></meta>
            <meta property="og:image:alt" content="Logo"></meta>
          </Head>

          <Container maxWidth="lg">
            <Grid className="main-wrapper" container justifyContent="center">
              <Grid className="swap-wrapper">
                <Grid
                  container
                  justifyContent={"space-between"}
                  className="mb-6"
                >
                  <Typography variant="h1" className="title">
                    {t("spt", "Swap Tokens")}
                  </Typography>
                  <SettingsOutlinedIcon
                    className="setting-icon text-white"
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
                          {t("balance", "Balance")}:{" "}
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
                            <span className="text-blue">
                              {t("sat", "Select a Token")}
                            </span>
                          )}

                          <ArrowDropDownIcon />
                        </Button>
                        {loadingPrice ? (
                          <div className="w-full">
                            <Skeleton
                              variant="rounded"
                              sx={{ bgcolor: "#203a48" }}
                              height={28}
                              className="w-[150px] rounded-lg  absolute right-3 top-2"
                            />
                          </div>
                        ) : (
                          <InputBase
                            type="number"
                            value={buyBalance}
                            placeholder="0.0000000"
                            className="input-box"
                            disabled={loadingPrice}
                          />
                        )}
                      </Grid>
                      <Grid className="balance-text">
                        {t("balance", "Balance")}:{" "}
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
                        {t("estg", "Estimated Gas")} {estimatedGas}
                      </Typography>
                    ) : (
                      <></>
                    )}
                    {unknownPrice && (
                      <div className="rounded-lg break-words bg-[#ffc70017] mt-2 p-3 text-center mx-auto  text-[#ffc700]">
                        Unknown price <WarningAmberIcon />
                      </div>
                    )}
                    {errorMsg && (
                      <div className="rounded-lg break-words bg-[#ffc70017] mt-2 p-3 text-center mx-auto  text-[#ffc700]">
                        {errorMsg} <WarningAmberIcon />
                      </div>
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
                        className="bg-blue-600 mb-2"
                        onClick={callApprove}
                      >
                        {t("approve", "Approve")}
                      </LoadingButton>
                    ) : (
                      <>
                        {liquidityError ? (
                          <Button variant="contained" disabled fullWidth>
                            {t("nlfs", "No liquidity for swap")}
                          </Button>
                        ) : (
                          <>
                            {isConnected || !loadingPrice ? (
                              <>
                                {balanceError || !Number(sellBalance) ? (
                                  <Button
                                    variant="contained"
                                    disabled
                                    className="swap-button"
                                    fullWidth
                                  >
                                    {!balanceError ? (
                                      <>{t("swap")}</>
                                    ) : (
                                      <>{t("iffb", "Insufficient balance")}</>
                                    )}
                                  </Button>
                                ) : (
                                  <Button
                                    component={"button"}
                                    variant="contained"
                                    className="swap-button bg-blue-600"
                                    fullWidth
                                    target={"_blank"}
                                    disabled={loading || loadingPrice}
                                    onClick={callSwap}
                                  >
                                    {t("swap")}
                                  </Button>
                                )}
                              </>
                            ) : (
                              <>
                                <Button
                                  className="swap-button"
                                  variant="contained"
                                  fullWidth
                                  disabled={true}
                                >
                                  {t("swap")}
                                </Button>
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </Grid>
                  {pathResults && pathResults.length > 0 && tradeInfo.to && (
                    <Grid className="exchanges">
                      <Typography variant="h6">
                        {t("exchanges", "Exchanges")}:
                      </Typography>

                      <table border="0" cellSpacing="0" cellPadding="0">
                        <thead>
                          <tr>
                            <th>{t("name", "Name")}</th>
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
                                {tradeInfo?.to?.decimals && element && (
                                  <>
                                    {(
                                      Number(
                                        ethers.utils
                                          .formatUnits(
                                            element?.toTokenAmount,
                                            tradeInfo?.to?.decimals
                                          )
                                          .toString()
                                      ) /
                                        Number(sellBalance) -
                                      (index * 0.1 + index * 0.01)
                                    ).toFixed(4)}
                                  </>
                                )}
                              </td>
                              <td>
                                {index === 0 ? (
                                  <Typography className="badge best">
                                    {t("best", "Best")}
                                  </Typography>
                                ) : (
                                  <Typography className="badge">
                                    {t("match", "Match")}
                                  </Typography>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Grid>
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
        <Footer />
      </div>
    </>
  );
};

export default SwapPage;
