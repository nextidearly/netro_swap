import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Container,
  Grid,
  Button,
  Menu,
  MenuItem,
  useMediaQuery,
  Select,
} from "@mui/material";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { useAccount } from "wagmi";
import { setWallet } from "./../../redux/actions";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { CustomConnectButton } from "../ConnectButton/ConnectButton";
import { HeaderButton } from "../ConnectButton/HeaderButton";
import { useTranslation } from "react-i18next";

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [anchorEl1, setAnchorEl1] = React.useState(null);
  const { address, isConnected } = useAccount();
  const { t, i18n } = useTranslation();
  const mobileMenuOpen = Boolean(anchorEl1);
  const matches = useMediaQuery("(min-width: 901px )");
  const [locale, setLocale] = useState("us");

  const handleChangeLocale = (val) => {
    i18n.changeLanguage(val);
    setLocale(val);
  };

  useEffect(() => {
    if (isConnected) dispatch(setWallet(address));
    else dispatch(setWallet(null));
  }, [isConnected]);

  return (
    <Grid className="navbar">
      <Container maxWidth={"fixed"}>
        <Grid container className="header" alignItems="center">
          <Grid xs={2} sm={2} md={4} item className="header-logo">
            <Link href={"/"} className="flex items-center">
              <Image
                src={"/logo.png"}
                alt="SNOW logo"
                layout="fixed"
                className="site-logo"
                width={70}
                height={70}
              />
            </Link>
          </Grid>
          <Grid
            xs={4}
            md={4}
            sx={{ display: { xs: "none", md: "block" } }}
            item
          >
            <Grid container justifyContent={"center"}>
              <Grid className="nav-group">
                <Link
                  href={"/"}
                  className={
                    router.pathname === "/" ? "nav-link active" : "nav-link"
                  }
                >
                  {t("swap", "Swap")}
                </Link>
                <Link
                  href={"/stats"}
                  className={
                    router.pathname === "/stats"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  {t("stats", "Stats")}
                </Link>

                <Link
                  href={"/nodes"}
                  className={
                    router.pathname === "/nodes"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  {t("nodes", "Nodes")}
                </Link>
              </Grid>
            </Grid>
          </Grid>

          <Grid xs={10} md={4} item>
            <Grid container justifyContent="flex-end" alignItems={"center"}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={locale}
                label="Age"
                onChange={(e) => handleChangeLocale(e.target.value)}
                className="w-[60px] h-[38px] mt-[1px] max-w-[60px!important] mr-2 p-0 header-container-ul  text-white"
              >
                <MenuItem
                  value="us"
                  className="w-full max-w-[60px!important]  h-[30px] px-.5 sm:px-1 md:px-3 my-1 overflow-hidden p-1"
                >
                  <img
                    src="/usa.jpg"
                    className="w-full max-w-[60px!important]  h-full"
                  />
                </MenuItem>
                <MenuItem
                  value="ru"
                  className="w-full max-w-[60px!important]  h-[30px] px-.5 sm:px-1 md:px-3 my-1 overflow-hidden p-1"
                >
                  <img
                    src="/russian.png"
                    className="w-full max-w-[60px!important]  h-full"
                  />
                </MenuItem>
                <MenuItem
                  value="ch"
                  className="w-full max-w-[60px!important]  h-[30px] px-.5 sm:px-1 md:px-3 my-1 overflow-hidden p-1"
                >
                  <img
                    src="/china.png"
                    className="w-full max-w-[60px!important]  h-full"
                  />
                </MenuItem>
                <MenuItem
                  value="ar"
                  className="w-full max-w-[60px!important]  h-[30px] px-.5 sm:px-1 md:px-3 my-1 overflow-hidden p-1"
                >
                  <img
                    src="/arbic.png"
                    className="w-full max-w-[60px!important]  h-full"
                  />
                </MenuItem>
              </Select>

              {matches && (
                <HeaderButton
                  showBalance={{
                    smallScreen: false,
                    largeScreen: true,
                  }}
                />
              )}
              <Button id="dropdown">
                <MenuOutlinedIcon
                  className="mobile-menu"
                  onClick={(e) => setAnchorEl1(e.target)}
                ></MenuOutlinedIcon>
              </Button>
              <Menu
                id="dropdownMenu"
                anchorEl={anchorEl1}
                open={mobileMenuOpen}
                onClose={() => setAnchorEl1(null)}
                MenuListProps={{
                  "aria-labelledby": "dropdown",
                }}
              >
                <MenuItem>
                  <Link
                    href={"/"}
                    className={
                      router.pathname === "/"
                        ? "nav-link-mobile active"
                        : "nav-link-mobile"
                    }
                  >
                    {t("swap", "Swap")}
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    href={"/stats"}
                    className={
                      router.pathname === "/stats"
                        ? "nav-link-mobile active"
                        : "nav-link-mobile"
                    }
                  >
                    {t("stats", "Stats")}
                  </Link>
                </MenuItem>
                <MenuItem>
                  <a
                    href={"https://SNOW-presale.vercel.app/"}
                    className={
                      router.pathname === "/ido"
                        ? "nav-link-mobile active"
                        : "nav-link-mobile image-nav"
                    }
                    target="_blank"
                  >
                    {t("ido", "IDO")}
                    <img src="/blank.png" alt="" />
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href={"https://SNOW-presale.vercel.app/airdrop"}
                    className={
                      router.pathname === "/ido"
                        ? "nav-link-mobile active"
                        : "nav-link-mobile image-nav"
                    }
                    target="_blank"
                  >
                    {t("airDrop", "Airdrop")}
                    <img src="/blank.png" alt="" />
                  </a>
                </MenuItem>
                <MenuItem>
                  <Link
                    href={"/nodes"}
                    className={
                      router.pathname === "/nodes"
                        ? "nav-link-mobile active"
                        : "nav-link-mobile"
                    }
                  >
                    {t("nodes", "Nodes")}
                  </Link>
                </MenuItem>
                <hr />
                <CustomConnectButton />
              </Menu>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Grid>
  );
};

export default Header;
