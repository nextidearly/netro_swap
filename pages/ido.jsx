import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { TwitterLink, DiscordLink, TOKEN_PRICE } from "../environment/config";
import {
  END_PRESALE,
  START_PRESALE,
  USDT_ADDRESSES,
  TREASURY,
} from "../environment/config";
import moment from "moment";
import { useAccount, useBalance, useNetwork } from "wagmi";
import { ethers } from "ethers";
import { useSnackbar } from "notistack";
import ABI from "../environment/ERC20_ABI.json";
const CountDownComponent = dynamic(
  () => import("../components/CountDown/CountDown"),
  { ssr: false }
);

const Donate = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { data } = useBalance({ address: address });
  const { enqueueSnackbar } = useSnackbar();
  const [type, setType] = useState("ETH");
  const [totalRaisedETH, setTotalRaisedETH] = useState(0);
  const [totalRaisedUSDT, setTotalRaisedUSDT] = useState(0);
  const [amount, setAmount] = useState("");
  const [amount2, setAmount2] = useState("");
  const [insufficient, setInsufficient] = useState(false);
  const [eth, setEth] = useState("");
  const [xyxy, setXyxy] = useState("");
  const [loadingTx, setLoadingTx] = useState(false);
  const [allowance, setAllowance] = useState(0);
  const [balance, setBalance] = useState({
    decimals: 18,
    formatted: "0.00",
    symbol: "ETH",
    value: 0,
  });

  const getTokenBalance = async (address) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      USDT_ADDRESSES[chain.id],
      ABI,
      provider
    );
    const decimals1 = await contract.decimals();
    const balance1 = await contract.balanceOf(address);
    setBalance({
      decimals: 18,
      symbol: "USDT",
      formatted: ethers.utils.formatUnits(balance1, decimals1),
      value: 0,
    });
  };

  const handleMaxAmount = () => {
    setAmount(Number(data.formatted));
    setXyxy(Number(data.formatted));
  };

  const checkAllowance = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        USDT_ADDRESSES[chain.id],
        ABI,
        provider
      );
      const amount = (await contract.allowance(address, TREASURY)).toString();
      const decimals = await contract.decimals();
      setAllowance(ethers.utils.formatUnits(amount, decimals));
    } catch (e) {
      console.log(e);
      return 0;
    }
  };

  const approve = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const walletSigner = provider.getSigner(address);
    try {
      const token_contract = new ethers.Contract(
        USDT_ADDRESSES[chain.id],
        ABI,
        walletSigner
      );
      const decimals = await token_contract.decimals();
      const value = ethers.utils.parseUnits(eth.toString(), decimals);

      await token_contract.approve(TREASURY, value);
      setAllowance(Number(eth));
    } catch (e) {
      console.log(e);
    }
  };

  const handleChangeAmount = (amount) => {
    setEth(amount);
    setXyxy(Number(amount) * TOKEN_PRICE || "");
  };

  const handleChangeXyxy = (amount2) => {
    setEth(Number(amount2) / TOKEN_PRICE || "");
    setAmount(Number(amount2) / TOKEN_PRICE || "");
    setXyxy(amount2);
  };

  const handleBuyWithCoin = async () => {
    setLoadingTx(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const walletSigner = provider.getSigner(address);
    try {
      const transactionHash = await walletSigner.sendTransaction({
        to: TREASURY,
        value: ethers.utils.parseEther("0.05"),
      });
      console.log("asdfafd");

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
      getTokenBalance(address);
    } catch (error) {
      console.log(error);
      setLoadingTx(false);
    }
  };

  const handleBuyWithUSDT = async () => {
    setLoadingTx(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const walletSigner = provider.getSigner(address);
    try {
      const token_contract = new ethers.Contract(
        USDT_ADDRESSES[chain.id],
        ABI,
        walletSigner
      );
      const decimals = await token_contract.decimals();
      const value = ethers.utils.parseUnits(eth.toString(), decimals);

      const transactionHash = await token_contract.transferFrom(
        address,
        TREASURY,
        ethers.utils.parseUnits(eth.toString(), decimals)
      );

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
      getTokenBalance(address);
    } catch (error) {
      console.log(error);
      setLoadingTx(false);
    }
  };

  useEffect(() => {
    handleChangeAmount(amount);
  }, [amount]);

  useEffect(() => {
    handleChangeXyxy(amount2);
  }, [amount2]);

  useEffect(() => {
    if (data) {
      setBalance(data);
    } else {
      setBalance({
        decimals: 18,
        formatted: "0",
        symbol: "ETH",
        value: 0,
      });
    }
  }, [data]);

  useEffect(() => {
    if (balance?.decimals) {
      if (Number(eth) > Number(balance.formatted)) {
        setInsufficient(true);
      }
      if (Number(eth) < Number(balance.formatted)) {
        setInsufficient(false);
      }
    }
  }, [eth]);

  useEffect(() => {
    setAmount("");
    setAmount2("");
    if (type === "USDT") {
      checkAllowance();

      getTokenBalance(address);
    } else {
      setBalance(
        data || { decimals: 18, formatted: "0", symbol: "ETH", value: 0 }
      );
    }
  }, [type, chain]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        USDT_ADDRESSES[chain.id],
        ABI,
        provider
      );
      const decimals1 = await contract.decimals();
      const balance1 = await contract.balanceOf(TREASURY);
      const value1 = ethers.utils.formatUnits(balance1, decimals1);
      setTotalRaisedETH(value1);
      const balance2 = await provider?.getBalance(TREASURY);
      const value2 = ethers.utils.formatUnits(balance2, 18);
      setTotalRaisedUSDT(value2);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className="page"
    >
      <Header />
      <Head>
        <title>Presale | XYXY Finance</title>
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
        <link rel="manifest" href="/site.webmanifest" />
        <meta
          name="description"
          content="XYXY is the leading swap platform on Base"
        />
        <meta
          name="keywords"
          content="Defi, Base, Dex, Dex Aggregator, XYXY "
        />
        <meta property="og:title" content={`XYXY | XYXY Finance`} />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content={`XYXY is the Dex aggregator on Base network`}
        />
        <meta
          property="og:url"
          content={`https://xyxybase-swap.netlify.app/`}
        />
        <meta property="og:site_name" content="XYXY Swap Base"></meta>
        <meta
          property="og:image"
          content="https://xyxybase-swap.netlify.app/logo_new.png"
        ></meta>
        <meta property="og:image:type" content="image/png"></meta>
        <meta property="og:image:width" content="2000"></meta>
        <meta property="og:image:height" content="2000"></meta>
        <meta property="og:image:alt" content="Logo"></meta>
      </Head>
      <div className="presale">
        <div spacing={2} className="default-container page-layout">
          <div spacing={2} className="presale-wrapper">
            <div className="presale-card">
              <div className="presale-card-info">
                <div className="presale-image-container">
                  <img
                    src="/XYXY1--800X800.png"
                    className="presale-img"
                    layout="fixed"
                    width={150}
                    height="150"
                    alt="presale-logo"
                  />
                </div>
                <div className="presale-card-info-content">
                  <div className="presale-card-info-content-title">
                    <h1>XYXY swap</h1>
                    <div className="presale-card-info-content-tags">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={TwitterLink}
                      >
                        <img
                          alt=""
                          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAZCAYAAAArK+5dAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAF2SURBVHgB7ZW9UcNAEIXfCTICXIJLMBXYVICpAHvGZsigA8sVIDKPTSBXgOjAVAAdoBJEQMKPlidpNJbQ3UkiwYG/mVOwd7tvd7U6AXv+G4W/MpEbOOhD0OF6xL3yUvuVdLFQoVlgKiM6hHTYGINPxaPn9S/rC20RYvqu1Dg3OhVnB2c8+IBLGWqDJ/Zq8IQeExvQP2J1A7MAeECxbFBkIq5mvw8b3/QvVF8ViFnqdnfGjF+5XLall9oycT2CDYPPi6aqwAFfGAoiQJdrxsDPFBImMEQLHE0Wt3yas1TWvaheIGaZWdbtkdS3RmCl7lBuUXM+0/bWCGTWc1ayZkYRmiJMyt9+YDmHhuNdilygDQqezqyvYJHOsYumCHws1bq5QMKS8yw4YWY+7ITs/dy06cBO9vnbgn/gVNf7nPJll9yEcdr7LLBt5mME+MKYwa2DoL+ukxs1eckxhcoiIVdA8YDj/IQG1P8PRtLBEY7xjre6bPfsJj/ZH23rHhE0kwAAAABJRU5ErkJggg=="
                        />
                      </a>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={DiscordLink}
                      >
                        <img
                          alt=""
                          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAZCAYAAAArK+5dAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGFSURBVHgB7VRLUsJAFOyXQtc5QrgBnkBugDcQq5RiJ55AvAFswUWOwA3UE8gRhhuwBzP2DAmZTD5YceFCuiowef3m9Xw6DzjjryGN7IPu8feazweWsi5wYx3hC4NK7qTASE+h8Ug2TCNrjt0iW/J9/vfSd4UEc7zK7LSAKQ48ow0SPPkiRQGz7QRvHEVoA82d7dBFLNssFHgrGLYubmCOtMOjdRB4Kbf4LQSTaoGx7qN69cpu3cchpioEQtzbWp5AYi3nF5lgIV2e65UnomzMcBp3pXlBXitwlHulFS5lbsexKPKxw65szGApMfyd6LxW4AQj+Bjq0FlA6DCRVzAsvEvO5zYdaY0yVpz8wqwb+N+G8XyH/B5TLrNsjoXITwTaIxUIahOqnFOX15DbccZT65rsrMVOmjG24di4IuLj3sk7OQXTlw7eD4+CptYxzcWQreKCZy32izZQ1op1MCa4xCeyS9d02o53ljkMdd30IDQgu6HACk0wLV0zd89u6vSgM/4RvgFObXsa/4iJSQAAAABJRU5ErkJggg=="
                        />
                      </a>
                    </div>
                  </div>
                  <div className="presale-card-info-content-para">
                    Introducing the Basetrade Token Sale, offering a total of
                    150,000,000 $XYXY for purchase. The distinctive sale
                    includes overflow farming, granting users additional XYXY as
                    a bonus tied to their commitment. This presents you with an
                    early opportunity to participate in the top notch
                    decentralized perpetual exchange on Base.
                  </div>
                </div>
              </div>
            </div>

            <div className="presale-cards">
              <div className="presale-cards-left">
                <div className="presale-card">
                  <div className="tap-block">
                    <button
                      className={
                        type === "ETH"
                          ? "tap-option muted active"
                          : "tap-option muted"
                      }
                      onClick={() => setType("ETH")}
                    >
                      ETH
                    </button>
                    <button
                      className={
                        type === "USDT"
                          ? "tap-option muted active"
                          : "tap-option muted"
                      }
                      onClick={() => setType("USDT")}
                    >
                      USDT
                    </button>
                  </div>
                  {type === "ETH" ? (
                    <div className="presale-card-progress">
                      <div className="presale-progress">
                        <div>
                          <CountDownComponent
                            targetBlockTime={"2023-11-29T07:00:00-08:00"}
                          />
                        </div>
                        <div className="presale-progress-info">
                          <h1>{totalRaisedETH}/100 ETH</h1>
                          <h1>0%</h1>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-bar-inner"
                            style={{ width: `${Number(totalRaisedETH)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="presale-card-input-right">
                        <h1>
                          Balance: {Number(balance.formatted).toFixed(6)}
                          {balance.symbol}
                        </h1>
                        <a
                          className={
                            balance.formatted === "0"
                              ? "disable-anchor"
                              : "active"
                          }
                          onClick={() =>
                            balance.formatted !== "0" && handleMaxAmount()
                          }
                        >
                          MAX
                        </a>
                      </div>
                      <div className="prasale-card-label">
                        <p>You pay {balance.symbol}</p>
                        <p>You Receive XYXY</p>
                      </div>
                      <div className="presale-card-inner">
                        <div className="presale-card-input">
                          {balance?.symbol === "MATIC" ? (
                            <img src="/assets/matic.webp" alt="" />
                          ) : (
                            <img src="/assets/eth.png" alt="" />
                          )}
                          <input
                            type="number"
                            value={amount}
                            onKeyPress={(e) => {
                              if (e.key === "-" || e.key === "e") {
                                e.preventDefault();
                              }
                            }}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.0"
                            min={0}
                          />
                        </div>
                        <div className="presale-card-input">
                          <img src="/assets/XYXY.PNG" alt="" />
                          <input
                            type="number"
                            value={xyxy}
                            onKeyPress={(e) => {
                              if (e.key === "-" || e.key === "e") {
                                e.preventDefault();
                              }
                            }}
                            onChange={(e) => setAmount2(e.target.value)}
                            placeholder="0.0"
                            min={0}
                          />
                        </div>
                      </div>
                      <div className="presale-card-progress-button">
                        <button
                          disabled={
                            balance?.formatted === "0" ||
                            !isConnected ||
                            insufficient ||
                            amount === ""
                          }
                          onClick={handleBuyWithCoin}
                        >
                          {!insufficient ? "Buy" : "Insufficient Balance"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="presale-card-progress">
                      <div className="presale-progress">
                        <div>
                          <CountDownComponent
                            targetBlockTime={"2023-11-29T07:00:00-08:00"}
                          />
                        </div>
                        <div className="presale-progress-info">
                          <h1>{totalRaisedUSDT}/10000 USDT</h1>
                          <h1>0%</h1>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-bar-inner"
                            style={{ width: `${Number(totalRaisedUSDT)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="presale-card-input-right">
                        <h1>
                          Balance: {Number(balance.formatted).toFixed(6)}
                          {balance.symbol}
                        </h1>
                        <a
                          className={
                            balance.formatted === "0"
                              ? "disable-anchor"
                              : "active"
                          }
                          onClick={() =>
                            balance.formatted !== "0" && handleMaxAmount()
                          }
                        >
                          MAX
                        </a>
                      </div>
                      <div className="prasale-card-label">
                        <p>You pay {balance.symbol}</p>
                        <p>You Receive XYXY</p>
                      </div>
                      <div className="presale-card-inner">
                        <div className="presale-card-input">
                          <img src="/assets/usdt.png" alt="" />
                          <input
                            type="number"
                            value={amount}
                            onKeyPress={(e) => {
                              if (e.key === "-" || e.key === "e") {
                                e.preventDefault();
                              }
                            }}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.0"
                            min={0}
                          />
                        </div>
                        <div className="presale-card-input">
                          <img src="/assets/XYXY.PNG" alt="" />
                          <input
                            type="number"
                            value={xyxy}
                            onKeyPress={(e) => {
                              if (e.key === "-" || e.key === "e") {
                                e.preventDefault();
                              }
                            }}
                            onChange={(e) => setAmount2(e.target.value)}
                            placeholder="0.0"
                            min={0}
                          />
                        </div>
                      </div>
                      <div className="presale-card-progress-button">
                        {allowance === 0 || allowance < Number(eth) ? (
                          <button
                            disabled={
                              balance?.formatted === "0.0" ||
                              !isConnected ||
                              insufficient ||
                              amount === ""
                            }
                            onClick={approve}
                          >
                            {!insufficient ? "Approve" : "Insufficient Balance"}
                          </button>
                        ) : (
                          <button
                            disabled={
                              balance?.formatted === "0.0" ||
                              !isConnected ||
                              insufficient ||
                              amount === ""
                            }
                            onClick={handleBuyWithUSDT}
                          >
                            {!insufficient ? "Buy" : "Insufficient Balance"}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="presale-cards-right">
                <div className="presale-card">
                  <div className="presale-card-right-main-info">
                    <div className="main-info-card">
                      <h1>USDT</h1>
                      <h2>{totalRaisedUSDT} USDT</h2>
                    </div>
                    <div className="main-info-card">
                      <h1>Total Raised</h1>
                      <h2>{totalRaisedETH} ETH</h2>
                    </div>
                  </div>
                  <div className="presale-card-right-info">
                    <h1>Main Details</h1>
                    <div className="app-card-divider"></div>
                    <div className="presale-card-right-col">
                      <h1>Softcap</h1>
                      <p>5 $</p>
                    </div>
                    <div className="app-card-divider"></div>
                    <div className="presale-card-right-col">
                      <h1>Minimum Raise</h1>
                      <p>20 ETH</p>
                    </div>
                    <div className="app-card-divider"></div>
                    <div className="presale-card-right-col">
                      <h1>Hardcap</h1>
                      <p>10,000 $</p>
                    </div>
                    <div className="app-card-divider"></div>
                    <div className="presale-card-right-col">
                      <h1>Sale Price</h1>
                      <p>0.00000067 ETH</p>
                    </div>
                    <div className="app-card-divider"></div>
                    <div className="presale-card-right-col">
                      <h1>Listing Price</h1>
                      <p>0.0000008 ETH</p>
                    </div>
                    <div className="app-card-divider"></div>
                    <div className="presale-card-right-col">
                      <h1>Total Token Sale</h1>
                      <p>4,000,000 XYXY</p>
                    </div>
                    <div className="app-card-divider"></div>
                    <div className="presale-card-right-col">
                      <h1>Farming bonus</h1>
                      <p className="bonus-info">5,480,000 $esXYXY</p>
                    </div>
                    <div className="app-card-divider"></div>
                    <div className="presale-card-right-col">
                      <h1> Start Time</h1>
                      {moment.unix(Number(START_PRESALE)).format()}
                    </div>
                    <div className="app-card-divider"></div>
                    <div className="presale-card-right-col">
                      <h1>End Time</h1>
                      {moment.unix(Number(END_PRESALE)).format()}
                    </div>
                    {/* <div className="app-card-divider"></div>
                    <div className="presale-card-right-col">
                      <h1>Minimum / Maximum Committed</h1>
                      <p>0.01 ETH / 1 ETH</p>
                    </div>
                    <div className="app-card-divider"></div>
                    <div className="presale-card-right-col">
                      <h1>Minimum Committed</h1>
                      <p>0.01 ETH</p>
                    </div> */}
                    {/* <div className="app-card-divider"></div>
                    <div className="presale-card-right-col">
                      <h1>Sale Method</h1>
                      <p>Farming Overflow</p>
                    </div> */}
                    {/* <div className="app-card-divider"></div>
                    <div className="presale-card-right-col">
                      <h1>Vesting</h1>
                      <p>100% released on TGE</p>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Donate;
