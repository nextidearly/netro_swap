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
        chain.id === 42161 ||
        chain.id === 324);
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
    <Grid className="page">
      <Header />
      <Container className="content-wrapper-stats">
        <div className="flex flex-col gap-2 sm:hidden w-full h-full">
          <p className="text-center text-white text-2xl font-semibold">
            {PROTOCOLS[tradeInfo.chainId]} Stats
          </p>

          <div className="flex gap-3">
            <div className="w-full">
              <div className="grid-wrapper">
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
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 justify-between">
            <p className="text-white pt-1 text-right">
              TVL (USD):&nbsp;
              <span className="text-[#0006ff]">
                {TVLhistory.length && (
                  <>${convertCurrency(TVLhistory[TVLhistory.length - 1].tvl)}</>
                )}
              </span>
              &nbsp;&nbsp; Change (24h):&nbsp;
              <span className="text-[#00ff16]">
                {TVLhistory.length && calcChange()}%
              </span>
            </p>
          </div>

          <div className="grid-wrapper h-full relative mt-[0px!important] mb-[30px]">
            <div className="h-[calc(100%-32px)] absolute w-[calc(100%-32px)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-y-scroll">
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
                    <th>1D</th>
                    <th>1w</th>
                    <th>1m</th>
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
                              className="rounded-full h-[25px] w-[25px]"
                              onError={(e) => addDefaultImg(e)}
                            />
                            {/* {data.displayName} */}
                          </td>
                          <td
                            className={
                              data.change_1d > 0
                                ? "up text-[13px]"
                                : "down text-[13px]"
                            }
                          >
                            $ {convertCurrency(data.change_1d)}
                          </td>
                          <td
                            className={
                              data.change_7d > 0
                                ? "up text-[13px]"
                                : "down text-[13px]"
                            }
                          >
                            $ {convertCurrency(data.change_7d)}
                          </td>
                          <td
                            className={
                              data.change_1m > 0
                                ? "up text-[13px]"
                                : "down text-[13px]"
                            }
                          >
                            $ {convertCurrency(data.change_1m)}
                          </td>
                          <td className="text-[13px]">
                            $ {convertCurrency(data.tvl)}
                          </td>
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
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex sm:flex-col sm:gap-2 mt-10 w-full h-full">
          <p className="text-center text-white text-3xl font-semibold">
            {PROTOCOLS[tradeInfo.chainId]} Stats
          </p>
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-3 flex flex-col">
              <div className="grid-wrapper">
                <p className="text-[22px] font-semibold text-white">
                  TVL (USD)
                </p>
                <Typography variant="h4">
                  {TVLhistory.length ? (
                    <>
                      ${convertCurrency(TVLhistory[TVLhistory.length - 1].tvl)}
                    </>
                  ) : (
                    <Skeleton variant="rounded" sx={{ bgcolor: "#2a3454" }} />
                  )}
                </Typography>
              </div>

              <div className="grid-wrapper">
                <p className="text-[22px] font-semibold text-white">
                  Change (24h)
                </p>
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
              </div>
            </div>
            <div className="col-span-9">
              <div className="grid-wrapper">
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
              </div>
            </div>
          </div>
          <Typography variant="h6">TVL Rankings</Typography>
          <div className="grid-wrapper h-full relative mt-[0px!important]">
            <div className="h-[calc(100%-32px)] absolute w-[calc(100%-32px)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-y-scroll">
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
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </Grid>
  );
};

export default StatsPage;
