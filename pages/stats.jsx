import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header/Header";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Container, Grid, Typography } from "@mui/material";
import { useNetwork } from "wagmi";
import { initTradeInfo } from "../redux/actions";

import Skeleton from "@mui/material/Skeleton";
import moment from "moment";
import { PROTOCOLS, DEX_TVL_RANKINGS } from "../environment/config";
import Footer from "@/components/Footer/Footer";

const StatsPage = () => {
  const dispatch = useDispatch();
  const { chain } = useNetwork();
  let tradeInfo = useSelector((RootState) => RootState.trade);

  const [TVLhistory, setTVLhistory] = useState([]);
  const [dexTVLData, setDexTVLData] = useState([]);

  const addDefaultImg = (e) => {
    e.target.src = "/default.png";
  };

  const getTVL = async (protocol) => {
    const response = await fetch(
      `/api-llama/v2/historicalChainTvl/${protocol}`
    );
    const result = await response.json();
    setTVLhistory(result);
  };

  const getDexTVL = async (protocol) => {
    const response = await fetch(`/api-llama/overview/dexs/${protocol}`);
    const result = await response.json();
    let tvlList = [];
    for (let i = 0; i < result.protocols.length; i++) {
      try {
        const res = await fetch(`/api-llama/tvl/${result.protocols[i].module}`);
        const tvl = await res.json();
        if (tvl && !tvl.message) {
          const data = {
            logo: result.protocols[i].logo,
            displayName: result.protocols[i].displayName,
            change_1d: result.protocols[i].change_1d,
            change_7d: result.protocols[i].change_7d,
            change_1m: result.protocols[i].change_1m,
            tvl: Number(tvl) !== NaN ? tvl : 0,
          };
          tvlList.push(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    const dexList = tvlList.sort((a, b) => {
      return b.tvl - a.tvl;
    });
    setDexTVLData(dexList);
    sessionStorage.setItem("asdfasdf", JSON.stringify(dexList));
  };

  const convertCurrency = (labelValue) => {
    return Number(labelValue) >= 1.0e9
      ? (Number(labelValue) / 1.0e9).toFixed(2) + "B"
      : Number(labelValue) >= 1.0e6
      ? (Number(labelValue) / 1.0e6).toFixed(2) + "M"
      : Number(labelValue) >= 1.0e3
      ? (Number(labelValue) / 1.0e3).toFixed(2) + "K"
      : Number(labelValue);
  };

  const dateFormatter = (time) => {
    var d = new Date(0);
    d.setUTCSeconds(time);
    return moment(d).format("DD/MM");
  };

  const calcChange = () => {
    return (
      1 -
      Number(TVLhistory[TVLhistory.length - 2].tvl) /
        Number(TVLhistory[TVLhistory.length - 1].tvl)
    ).toFixed(3);
  };

  const initTradeState = (chainID) => {
    dispatch(initTradeInfo(chainID));
  };

  useEffect(() => {
    const network =
      chain &&
      (chain.id === 1 ||
        chain.id === 137 ||
        chain.id === 10 ||
        chain.id === 8453 ||
        chain.id === 42161);
    if (network) {
      setDexTVLData(DEX_TVL_RANKINGS[chain.id]);
      getTVL(PROTOCOLS[chain ? chain.id : tradeInfo.chainId]);
      getDexTVL(PROTOCOLS[chain ? chain.id : tradeInfo.chainId].toLowerCase());
      if (chain) {
        initTradeState(chain.id);
      }
    } else {
      getTVL(PROTOCOLS[1]);
      getDexTVL(PROTOCOLS[1].toLowerCase());
      if (chain) {
        initTradeState(1);
      }
    }
  }, [chain]);

  return (
    <div className="page">
      <Header />
      <Container className="content-wrapper-stats">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h3">
              {PROTOCOLS[tradeInfo.chainId]} Stats
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Grid container direction={"column"}>
              <Grid className="grid-wrapper">
                <Typography variant="h6">TVL (USD)</Typography>
                <Typography variant="h4">
                  {TVLhistory.length ? (
                    <>
                      ${convertCurrency(TVLhistory[TVLhistory.length - 1].tvl)}
                    </>
                  ) : (
                    <Skeleton variant="rounded" sx={{ bgcolor: "#2a3454" }} />
                  )}
                </Typography>
              </Grid>

              <Grid className="grid-wrapper">
                <Typography variant="h6">Change (24h)</Typography>
                {TVLhistory.length ? (
                  <Typography
                    variant="h4"
                    className={calcChange() < 0 ? "down" : "up"}
                  >
                    {calcChange()}%
                  </Typography>
                ) : (
                  <Typography variant="h4">
                    <Skeleton variant="rounded" sx={{ bgcolor: "#2a3454" }} />
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={9}>
            <Grid className="grid-wrapper">
              {TVLhistory.length ? (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart
                    width={500}
                    height={200}
                    data={TVLhistory}
                    syncId="anyId"
                    margin={{
                      top: 0,
                      right: 5,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <XAxis
                      dataKey="date"
                      tickFormatter={dateFormatter}
                      tick={{ fill: "white" }}
                      tickLine={{ stroke: "white" }}
                    />
                    <YAxis
                      tickFormatter={convertCurrency}
                      orientation="right"
                      tick={{ fill: "white" }}
                      tickLine={{ stroke: "white" }}
                    />
                    <Tooltip
                      formatter={convertCurrency}
                      labelFormatter={dateFormatter}
                    />
                    <Area
                      type="monotone"
                      dataKey="tvl"
                      stroke="#279778"
                      fill="#234b56"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton
                  variant="rounded"
                  sx={{ bgcolor: "#2a3454" }}
                  height={200}
                />
              )}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">TVL Rankings</Typography>
            <Grid className="grid-wrapper dex-ranking">
              <table
                className="dex-table"
                border="0"
                cellSpacing="0"
                cellPadding="0"
              >
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>1D change</th>
                    <th>1w change</th>
                    <th>1m change</th>
                    <th>TVL</th>
                  </tr>
                </thead>

                {dexTVLData.length > 0 ? (
                  <tbody>
                    {dexTVLData.map((data, index) => {
                      return (
                        <tr
                          key={index}
                          className={index % 2 === 0 ? "table-hover" : ""}
                        >
                          <td>{index + 1}</td>
                          <td className="dex-name">
                            <img
                              src={data.logo}
                              alt="dex icon"
                              className="dex-icon"
                              onError={(e) => addDefaultImg(e)}
                            />
                            {data.displayName}
                          </td>
                          <td className={data.change_1d > 0 ? "up" : "down"}>
                            $ {convertCurrency(data.change_1d)}
                          </td>
                          <td className={data.change_7d > 0 ? "up" : "down"}>
                            $ {convertCurrency(data.change_7d)}
                          </td>
                          <td className={data.change_1m > 0 ? "up" : "down"}>
                            $ {convertCurrency(data.change_1m)}
                          </td>
                          <td>$ {convertCurrency(data.tvl)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                ) : (
                  <tbody className="skeleton-table">
                    <tr>
                      <td colSpan={6}>
                        <Skeleton
                          variant="rounded"
                          sx={{ bgcolor: "#2a3454" }}
                          height={30}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={6}>
                        <Skeleton
                          variant="rounded"
                          sx={{ bgcolor: "#2a3454" }}
                          height={30}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={6}>
                        <Skeleton
                          variant="rounded"
                          sx={{ bgcolor: "#2a3454" }}
                          height={30}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={6}>
                        <Skeleton
                          variant="rounded"
                          sx={{ bgcolor: "#2a3454" }}
                          height={30}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={6}>
                        <Skeleton
                          variant="rounded"
                          sx={{ bgcolor: "#2a3454" }}
                          height={30}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={6}>
                        <Skeleton
                          variant="rounded"
                          sx={{ bgcolor: "#2a3454" }}
                          height={30}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={6}>
                        <Skeleton
                          variant="rounded"
                          sx={{ bgcolor: "#2a3454" }}
                          height={30}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={6}>
                        <Skeleton
                          variant="rounded"
                          sx={{ bgcolor: "#2a3454" }}
                          height={30}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={6}>
                        <Skeleton
                          variant="rounded"
                          sx={{ bgcolor: "#2a3454" }}
                          height={30}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={6}>
                        <Skeleton
                          variant="rounded"
                          sx={{ bgcolor: "#2a3454" }}
                          height={30}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={6}>
                        <Skeleton
                          variant="rounded"
                          sx={{ bgcolor: "#2a3454" }}
                          height={30}
                        />
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </div>
  );
};

export default StatsPage;