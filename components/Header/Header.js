import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Container,
  Grid,
  Button,
  Menu,
  MenuItem,
  useMediaQuery,
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

  const handleChangeLocale = (val) => {
    i18n.changeLanguage(val);
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
            <Image
              src={"/logo.png"}
              alt="XYXY logo"
              layout="fixed"
              className="site-logo"
              width={70}
              height={70}
            />
            XYXY.IO
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
                  {t("swap")}
                </Link>
                <Link
                  href={"/stats"}
                  className={
                    router.pathname === "/stats"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  {t("stats")}
                </Link>
                <a
                  href={"https://ido.xyxy.io"}
                  className={
                    router.pathname === "/ido"
                      ? "nav-link active"
                      : "nav-link image-nav"
                  }
                  target="_blank"
                >
                  {t("ido")}
                  <img src="/blank.png" alt="" />
                </a>
                <a
                  href={"https://airdrop.xyxy.io/"}
                  className={
                    router.pathname === "/ido"
                      ? "nav-link active"
                      : "nav-link image-nav"
                  }
                  target="_blank"
                >
                  {t("airdrop")}
                  <img src="/blank.png" alt="" />
                </a>
                <Link
                  href={"/nodes"}
                  className={
                    router.pathname === "/nodes"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  {t("nodes")}
                </Link>
              </Grid>
            </Grid>
          </Grid>

          <Grid xs={10} md={4} item>
            <Grid container justifyContent="flex-end" alignItems={"center"}>
              <select
                defaultValue={"es"}
                className="mr-2 p-1.5 rounded-md bg-[#010514] font-semibold text-gray-300 focus-visible:outline-none cursor-pointer"
                onChange={(e) => handleChangeLocale(e.target.value)}
              >
                <option value={"es"}>US</option>
                <option value={"ru"}>RU</option>
              </select>

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
                    {t("swap")}
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
                    {t("stats")}
                  </Link>
                </MenuItem>
                <MenuItem>
                  <a
                    href={"https://xyxy-presale.vercel.app/"}
                    className={
                      router.pathname === "/ido"
                        ? "nav-link-mobile active"
                        : "nav-link-mobile image-nav"
                    }
                    target="_blank"
                  >
                    {t("ido")}
                    <img src="/blank.png" alt="" />
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href={"https://xyxy-presale.vercel.app/airdrop"}
                    className={
                      router.pathname === "/ido"
                        ? "nav-link-mobile active"
                        : "nav-link-mobile image-nav"
                    }
                    target="_blank"
                  >
                    {t("airDrop")}
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
                    {t("nodes")}
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
