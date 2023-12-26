import { useState } from "react";
import Head from "next/head";
import { Button, Grid, Typography, Container } from "@mui/material";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Slide } from "react-slideshow-image";
import { useTranslation } from "react-i18next";
import "react-slideshow-image/dist/styles.css";

const LaunchPad = () => {
  const [type, setType] = useState("node1");
  const [mintValue1, setMintValue1] = useState(0);
  const [mintValue2, setMintValue2] = useState(0);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const handleBuy = async () => {};

  const handleClaim = async () => {};

  const setMaxWallet = (index) => {
    if (index == 1) setMintValue1(100);
    else setMintValue2(100);
  };

  const countUp = (index) => {
    if (index == 1) {
      setMintValue1((preState) => {
        ++preState;
        return preState <= 100 ? preState : 100;
      });
    } else {
      setMintValue2((preState) => {
        ++preState;
        return preState <= 100 ? preState : 100;
      });
    }
  };

  const countDown = (index) => {
    if (index == 1) {
      setMintValue1((preState) => {
        --preState;
        return preState <= 0 ? 0 : preState;
      });
    } else {
      setMintValue2((preState) => {
        --preState;
        return preState <= 0 ? 0 : preState;
      });
    }
  };

  // useEffect(() => {
  //   if (provider) getSNOWPresaleStatus();
  // }, [provider]);

  return (
    <Grid className="page">
      <Header />
      <Head>
        <title>NodeSale | SNOW Finance</title>
        <link rel="icon" href="/favicon.ico" />{" "}
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
      <Grid
        className={
          open ? "blur-background airdrop nodesale" : "airdrop nodesale"
        }
      >
        <p className="text-center text-white text-3xl font-semibold mt-8">
          {t("nds", " Node Sales")}
        </p>
        <Grid>
          <Container className="nodesale-container">
            <Grid container>
              <Grid xs={12} sm={8} md={6} className="tap-block">
                <button
                  className={
                    type === "node1"
                      ? "tap-option muted active"
                      : "tap-option muted"
                  }
                  onClick={() => setType("node1")}
                >
                  {t("mint", "Mint")}
                </button>
                <button
                  className={
                    type === "node2"
                      ? "tap-option muted active"
                      : "tap-option muted"
                  }
                  onClick={() => setType("node2")}
                >
                  {t("manage", "Manage")}
                </button>
              </Grid>
            </Grid>

            <div className="hidden md:block">
              {type === "node1" ? (
                <div className="grid grid-cols-2 max-w-[700px] mx-auto gap-16 mt-6 pt-8">
                  <div className="wrapper">
                    <img
                      src="/assets/mint1.png"
                      alt="SNOW logo"
                      className="rounded-lg w-full mx-auto mb-4"
                    />

                    <Grid
                      item
                      mt={1}
                      container
                      justifyContent={"space-between"}
                    >
                      <Typography>{t("nn", "Node Name:")}</Typography>
                      <Typography>SNOW1</Typography>
                    </Grid>

                    <Grid
                      item
                      mt={1}
                      container
                      justifyContent={"space-between"}
                    >
                      <Typography>APY:</Typography>
                      <Typography>9.2%</Typography>
                    </Grid>

                    <Grid
                      item
                      mt={1}
                      container
                      justifyContent={"space-between"}
                    >
                      <Typography>{t("mp", "Mint Price:")}</Typography>
                      <Typography>
                        400 <span style={{ fontSize: "12px" }}>SNOW</span>{" "}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      mt={1}
                      container
                      justifyContent={"space-between"}
                    >
                      <Typography>{t("mpw", "Max per Wallet:")}</Typography>
                      <Typography>
                        100 &nbsp;
                        <span
                          onClick={() => setMaxWallet(1)}
                          style={{
                            color: "#2A80FF",
                            fontSize: "12px",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                        >
                          {t("max", "MAX")}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      mt={1}
                      container
                      justifyContent={"space-between"}
                    >
                      <div className="updown-input">
                        <div className="input-wrapper">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            placeholder="0"
                            value={mintValue1}
                            onChange={(e) =>
                              setMintValue1(() =>
                                e.target.value <= 100 ? e.target.value : 100
                              )
                            }
                          />
                          <div className="btn-group">
                            <Button
                              fullWidth
                              variant="text"
                              onClick={() => countUp(1)}
                            >
                              <KeyboardArrowUpIcon />
                            </Button>
                            <Button
                              fullWidth
                              variant="text"
                              onClick={() => countDown(1)}
                            >
                              <KeyboardArrowDownIcon />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Grid>
                    <Grid
                      mt={2}
                      mb={5}
                      item
                      container
                      justifyContent={"space-around"}
                      className="form-actions"
                    >
                      <Grid sm={12} item className="action-group">
                        <Button
                          fullWidth
                          variant="contained"
                          className="action-button bg-blue-600"
                          onClick={handleBuy}
                        >
                          {t("approve", "Approve")}
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                  <div className="wrapper">
                    <img
                      src="/assets/mint2.png"
                      alt="SNOW logo"
                      className="rounded-lg w-full mx-auto mb-4"
                    />

                    <Grid
                      item
                      mt={1}
                      container
                      justifyContent={"space-between"}
                    >
                      <Typography>{t("nn", "Node Name:")}</Typography>
                      <Typography>SNOW2</Typography>
                    </Grid>

                    <Grid
                      item
                      mt={1}
                      container
                      justifyContent={"space-between"}
                    >
                      <Typography>APY:</Typography>
                      <Typography>115%</Typography>
                    </Grid>

                    <Grid
                      item
                      mt={1}
                      container
                      justifyContent={"space-between"}
                    >
                      <Typography>{t("mp", "Mint Price:")}</Typography>
                      <Typography>
                        250 <span style={{ fontSize: "12px" }}>SNOW</span>{" "}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      mt={1}
                      container
                      justifyContent={"space-between"}
                    >
                      <Typography>{t("mpw", "Max per Wallet:")}</Typography>
                      <Typography>
                        100 &nbsp;
                        <span
                          onClick={() => setMaxWallet(2)}
                          style={{
                            color: "#2A80FF",
                            fontSize: "12px",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                        >
                          {t("max", "MAX")}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      mt={1}
                      container
                      justifyContent={"space-between"}
                    >
                      <div className="updown-input">
                        <div className="input-wrapper">
                          <input
                            type="number"
                            min={0}
                            placeholder="0"
                            value={mintValue2}
                            onChange={(e) =>
                              setMintValue2(() =>
                                e.target.value <= 100 ? e.target.value : 100
                              )
                            }
                          />
                          <div className="btn-group">
                            <Button
                              fullWidth
                              variant="text"
                              onClick={() => countUp(2)}
                            >
                              <KeyboardArrowUpIcon />
                            </Button>
                            <Button
                              fullWidth
                              variant="text"
                              onClick={() => countDown(2)}
                            >
                              <KeyboardArrowDownIcon />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Grid>
                    <Grid
                      mt={2}
                      mb={5}
                      item
                      container
                      justifyContent={"space-around"}
                      className="form-actions"
                    >
                      <Grid sm={12} item className="action-group">
                        <Button
                          fullWidth
                          variant="contained"
                          className="action-button bg-blue-600"
                          onClick={handleBuy}
                        >
                          {t("approve", "Approve")}
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 max-w-[700px] mx-auto gap-16 mt-6 pt-8">
                  <Grid className="wrapper" padding={2}>
                    <Grid className="header" padding={2}>
                      <Typography variant="h6">
                        {t("rte", "Register to Earn")}
                      </Typography>
                      <img
                        src={"/logo.png"}
                        alt="SNOW logo"
                        className="project-logo"
                      />
                    </Grid>

                    <Grid
                      item
                      mt={5}
                      pr={2}
                      pl={2}
                      container
                      justifyContent={"space-between"}
                    >
                      <Typography variant="h6">APY:</Typography>
                      <Typography variant="h6">9.2%</Typography>
                    </Grid>

                    <Grid
                      item
                      mt={5}
                      pr={2}
                      pl={2}
                      container
                      justifyContent={"space-between"}
                    >
                      <Typography variant="h6">
                        {t("ttr", "Total Registered:")}
                      </Typography>
                      <Typography variant="h6">0 /100</Typography>
                    </Grid>
                    <Grid
                      item
                      mt={5}
                      pr={2}
                      pl={2}
                      container
                      justifyContent={"space-between"}
                    >
                      <Typography variant="h6">
                        {t("ulr", "Unclaimed Rewards:")}
                      </Typography>
                      <Typography variant="h6">
                        0<span style={{ fontSize: "12px" }}>ETH</span>{" "}
                      </Typography>
                    </Grid>
                    <Grid
                      mt={2}
                      mb={5}
                      item
                      container
                      justifyContent={"space-around"}
                      className="form-actions"
                    >
                      <Grid item mt={2} className="action-group">
                        <Button
                          fullWidth
                          variant="contained"
                          className="action-button bg-blue-600"
                          onClick={handleBuy}
                        >
                          {t("register", "REGISTER")}
                        </Button>
                      </Grid>
                      <Grid item mt={2} className="action-group">
                        <Button
                          fullWidth
                          variant="contained"
                          className="action-button bg-blue-600"
                          onClick={handleClaim}
                        >
                          {t("claim", "CLAIM")}
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid className="wrapper" padding={2}>
                    <Grid className="header" padding={2}>
                      <Typography variant="h6">
                        {t("rte", "Register to Earn")}
                      </Typography>

                      <img
                        src={"/logo.png"}
                        alt="SNOW logo"
                        className="project-logo"
                      />
                    </Grid>

                    <Grid
                      item
                      mt={5}
                      pr={2}
                      pl={2}
                      container
                      justifyContent={"space-between"}
                    >
                      <Typography variant="h6">APY:</Typography>
                      <Typography variant="h6">115%</Typography>
                    </Grid>
                    <Grid
                      item
                      mt={5}
                      pr={2}
                      pl={2}
                      container
                      justifyContent={"space-between"}
                    >
                      <Typography variant="h6">
                        {t("ttr", "Total Registered:")}
                      </Typography>
                      <Typography variant="h6">0 /100</Typography>
                    </Grid>
                    <Grid
                      item
                      mt={5}
                      pr={2}
                      pl={2}
                      container
                      justifyContent={"space-between"}
                    >
                      <Typography variant="h6">
                        {t("ulr", "Unclaimed Rewards:")}
                      </Typography>
                      <Typography variant="h6">
                        0<span style={{ fontSize: "12px" }}>SNOW</span>{" "}
                      </Typography>
                    </Grid>
                    <Grid
                      mt={2}
                      mb={5}
                      item
                      container
                      justifyContent={"space-around"}
                      className="form-actions"
                    >
                      <Grid item mt={2} className="action-group">
                        <Button
                          fullWidth
                          variant="contained"
                          className="action-button bg-blue-600"
                          onClick={handleBuy}
                        >
                          {t("register", "REGISTER")}
                        </Button>
                      </Grid>
                      <Grid item mt={2} className="action-group">
                        <Button
                          fullWidth
                          variant="contained"
                          className="action-button bg-blue-600"
                          onClick={handleClaim}
                        >
                          {t("claim", "CLAIM")}
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
              )}
            </div>

            <div className="inline-flex w-full md:hidden">
              {type === "node1" ? (
                <div className="w-full mx-auto gap-16 mt-6 pt-8">
                  <Slide>
                    <div className="p-6">
                      <div className="wrapper max-w-[350px] mx-auto each-slide-effect">
                        <img
                          src="/assets/mint1.png"
                          alt="SNOW logo"
                          className="rounded-lg w-full mx-auto mb-4"
                        />

                        <Grid
                          item
                          mt={1}
                          container
                          justifyContent={"space-between"}
                        >
                          <Typography>{t("nn", "Node Name:")}</Typography>
                          <Typography>SNOW1</Typography>
                        </Grid>

                        <Grid
                          item
                          mt={1}
                          container
                          justifyContent={"space-between"}
                        >
                          <Typography>APY:</Typography>
                          <Typography>9.2%</Typography>
                        </Grid>

                        <Grid
                          item
                          mt={1}
                          container
                          justifyContent={"space-between"}
                        >
                          <Typography>{t("mp", "Mint Price:")}</Typography>
                          <Typography>
                            500 <span style={{ fontSize: "12px" }}>SNOW</span>{" "}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          mt={1}
                          container
                          justifyContent={"space-between"}
                        >
                          <Typography>{t("mpw", "Max per Wallet:")}</Typography>
                          <Typography>
                            100 &nbsp;
                            <span
                              onClick={() => setMaxWallet(1)}
                              style={{
                                color: "#2A80FF",
                                fontSize: "12px",
                                fontWeight: "bold",
                                cursor: "pointer",
                              }}
                            >
                              MAX
                            </span>
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          mt={1}
                          container
                          justifyContent={"space-between"}
                        >
                          <div className="updown-input">
                            <div className="input-wrapper">
                              <input
                                type="number"
                                min={0}
                                max={100}
                                placeholder="0"
                                value={mintValue1}
                                onChange={(e) =>
                                  setMintValue1(() =>
                                    e.target.value <= 100 ? e.target.value : 100
                                  )
                                }
                              />
                              <div className="btn-group">
                                <Button
                                  fullWidth
                                  variant="text"
                                  onClick={() => countUp(1)}
                                >
                                  <KeyboardArrowUpIcon />
                                </Button>
                                <Button
                                  fullWidth
                                  variant="text"
                                  onClick={() => countDown(1)}
                                >
                                  <KeyboardArrowDownIcon />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Grid>
                        <Grid
                          mt={2}
                          mb={5}
                          item
                          container
                          justifyContent={"space-around"}
                          className="form-actions"
                        >
                          <Grid sm={12} item className="action-group">
                            <Button
                              fullWidth
                              variant="contained"
                              className="action-button bg-blue-600"
                              onClick={handleBuy}
                            >
                              {t("approve", "Approve")}
                            </Button>
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="wrapper max-w-[350px] mx-auto each-slide-effect">
                        <img
                          src="/assets/mint2.png"
                          alt="SNOW logo"
                          className="rounded-lg w-full mx-auto mb-4"
                        />

                        <Grid
                          item
                          mt={1}
                          container
                          justifyContent={"space-between"}
                        >
                          <Typography>{t("nn", "Node Name:")}</Typography>
                          <Typography>SNOW2</Typography>
                        </Grid>

                        <Grid
                          item
                          mt={1}
                          container
                          justifyContent={"space-between"}
                        >
                          <Typography>APY:</Typography>
                          <Typography>115%</Typography>
                        </Grid>

                        <Grid
                          item
                          mt={1}
                          container
                          justifyContent={"space-between"}
                        >
                          <Typography>{t("mp", "Mint Price:")}</Typography>
                          <Typography>
                            500 <span style={{ fontSize: "12px" }}>SNOW</span>{" "}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          mt={1}
                          container
                          justifyContent={"space-between"}
                        >
                          <Typography>{t("mpw", "Max per Wallet:")}</Typography>
                          <Typography>
                            100 &nbsp;
                            <span
                              onClick={() => setMaxWallet(2)}
                              style={{
                                color: "#2A80FF",
                                fontSize: "12px",
                                fontWeight: "bold",
                                cursor: "pointer",
                              }}
                            >
                              MAX
                            </span>
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          mt={1}
                          container
                          justifyContent={"space-between"}
                        >
                          <div className="updown-input">
                            <div className="input-wrapper">
                              <input
                                type="number"
                                min={0}
                                placeholder="0"
                                value={mintValue2}
                                onChange={(e) =>
                                  setMintValue2(() =>
                                    e.target.value <= 100 ? e.target.value : 100
                                  )
                                }
                              />
                              <div className="btn-group">
                                <Button
                                  fullWidth
                                  variant="text"
                                  onClick={() => countUp(2)}
                                >
                                  <KeyboardArrowUpIcon />
                                </Button>
                                <Button
                                  fullWidth
                                  variant="text"
                                  onClick={() => countDown(2)}
                                >
                                  <KeyboardArrowDownIcon />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Grid>
                        <Grid
                          mt={2}
                          mb={5}
                          item
                          container
                          justifyContent={"space-around"}
                          className="form-actions"
                        >
                          <Grid sm={12} item className="action-group">
                            <Button
                              fullWidth
                              variant="contained"
                              className="action-button bg-blue-600"
                              onClick={handleBuy}
                            >
                              {t("approve", "Approve")}
                            </Button>
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                  </Slide>
                </div>
              ) : (
                <div className="w-full mx-auto gap-16 mt-6 pt-8">
                  <Slide>
                    <div className="p-6">
                      <Grid
                        className="wrapper max-w-[350px] mx-auto each-slide-effect"
                        padding={2}
                      >
                        <Grid className="header" padding={2}>
                          <Typography variant="h6">
                            {t("rte", "Register to Earn")}
                          </Typography>
                          <img
                            src={"/logo.png"}
                            alt="SNOW logo"
                            className="project-logo"
                          />
                        </Grid>

                        <Grid
                          item
                          mt={5}
                          pr={2}
                          pl={2}
                          container
                          justifyContent={"space-between"}
                        >
                          <Typography variant="h6">APY:</Typography>
                          <Typography variant="h6">7.4%</Typography>
                        </Grid>

                        <Grid
                          item
                          mt={5}
                          pr={2}
                          pl={2}
                          container
                          justifyContent={"space-between"}
                        >
                          <Typography variant="h6">
                            {t("ttr", "Total Registered:")}
                          </Typography>
                          <Typography variant="h6">0 /100</Typography>
                        </Grid>
                        <Grid
                          item
                          mt={5}
                          pr={2}
                          pl={2}
                          container
                          justifyContent={"space-between"}
                        >
                          <Typography variant="h6">
                            {t("ulr", "Unclaimed Rewards:")}
                          </Typography>
                          <Typography variant="h6">1</Typography>
                        </Grid>
                        <Grid
                          mt={2}
                          mb={5}
                          item
                          container
                          justifyContent={"space-around"}
                          className="form-actions"
                        >
                          <Grid item mt={2} className="action-group">
                            <Button
                              fullWidth
                              variant="contained"
                              className="action-button bg-blue-600"
                              onClick={handleBuy}
                            >
                              {t("buy", "BUY")}
                            </Button>
                          </Grid>
                          <Grid item mt={2} className="action-group">
                            <Button
                              fullWidth
                              variant="contained"
                              className="action-button bg-blue-600"
                              onClick={handleClaim}
                            >
                              {t("claim", "CLAIM")}
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </div>
                    <div className="p-6">
                      <Grid
                        className="wrapper max-w-[350px] mx-auto each-slide-effect"
                        padding={2}
                      >
                        <Grid className="header" padding={2}>
                          <Typography variant="h6">
                            {t("rte", "Register to Earn")}
                          </Typography>

                          <img
                            src={"/logo.png"}
                            alt="SNOW logo"
                            className="project-logo"
                          />
                        </Grid>

                        <Grid
                          item
                          mt={5}
                          pr={2}
                          pl={2}
                          container
                          justifyContent={"space-between"}
                        >
                          <Typography variant="h6">APY:</Typography>
                          <Typography variant="h6">7.4%</Typography>
                        </Grid>
                        <Grid
                          item
                          mt={5}
                          pr={2}
                          pl={2}
                          container
                          justifyContent={"space-between"}
                        >
                          <Typography variant="h6">
                            {t("ttr", "Total Registered:")}
                          </Typography>
                          <Typography variant="h6">0 /100</Typography>
                        </Grid>
                        <Grid
                          item
                          mt={5}
                          pr={2}
                          pl={2}
                          container
                          justifyContent={"space-between"}
                        >
                          <Typography variant="h6">
                            {t("ulr", "Unclaimed Rewards:")}
                          </Typography>
                          <Typography variant="h6">1</Typography>
                        </Grid>
                        <Grid
                          mt={2}
                          mb={5}
                          item
                          container
                          justifyContent={"space-around"}
                          className="form-actions"
                        >
                          <Grid item mt={2} className="action-group">
                            <Button
                              fullWidth
                              variant="contained"
                              className="action-button bg-blue-600"
                              onClick={handleBuy}
                            >
                              {t("buy", "BUY")}
                            </Button>
                          </Grid>
                          <Grid item mt={2} className="action-group">
                            <Button
                              fullWidth
                              variant="contained"
                              className="action-button bg-blue-600"
                              onClick={handleClaim}
                            >
                              {t("claim", "CLAIM")}
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </div>
                  </Slide>
                </div>
              )}
            </div>
          </Container>
        </Grid>
      </Grid>
      <Footer />
    </Grid>
  );
};

export default LaunchPad;
