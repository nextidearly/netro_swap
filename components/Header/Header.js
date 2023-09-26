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
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { setWallet } from "./../../redux/actions";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [anchorEl1, setAnchorEl1] = React.useState(null);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) dispatch(setWallet(address));
    else dispatch(setWallet(null));
  }, [isConnected]);

  const mobileMenuOpen = Boolean(anchorEl1);
  const matches = useMediaQuery("(min-width: 901px )");

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
                  Swap
                </Link>
                <Link
                  href={"/stats"}
                  className={
                    router.pathname === "/stats"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  Stats
                </Link>
                <Link
                  href={"/ido"}
                  className={
                    router.pathname === "/ido" ? "nav-link active" : "nav-link"
                  }
                >
                  IDO
                </Link>
                <Link
                  href={"/nodes"}
                  className={
                    router.pathname === "/nodes"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  Nodes
                </Link>
                {/* <Link
                  href={"/farm"}
                  className={
                    router.pathname === "/farm"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  Farm
                </Link>
                <Link
                  href={"/launchpad"}
                  className={
                    router.pathname === "/launchpad"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  Launchpad
                </Link>
                <Link
                  href={"/airdrop"}
                  className={
                    router.pathname === "/airdrop"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  Airdrop
                </Link> */}
              </Grid>
            </Grid>
          </Grid>
          <Grid xs={10} md={4} item>
            <Grid container justifyContent="flex-end" alignItems={"center"}>
              {matches && (
                <ConnectButton
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
                      router.pathname === "/" ? "nav-link active" : "nav-link"
                    }
                  >
                    Swap
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    href={"/stats"}
                    className={
                      router.pathname === "/stats"
                        ? "nav-link active"
                        : "nav-link"
                    }
                  >
                    Stats
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    href={"/donate"}
                    className={
                      router.pathname === "/donate"
                        ? "nav-link active"
                        : "nav-link"
                    }
                  >
                    Donate
                  </Link>
                </MenuItem>
                {/* <MenuItem>
                  <Link
                    href={'/launchpad'}
                    className={
                      router.pathname === '/launchpad'
                        ? 'nav-link active'
                        : 'nav-link'
                    }
                  >
                    Launchpad
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    href={'/airdrop'}
                    className={
                      router.pathname === '/airdrop'
                        ? 'nav-link active'
                        : 'nav-link'
                    }
                  >
                    Airdrop
                  </Link> 
                </MenuItem>*/}
                {!matches && (
                  <MenuItem>
                    <ConnectButton
                      showBalance={{
                        smallScreen: false,
                        largeScreen: true,
                      }}
                      className="mobile_connect_btn"
                    />
                  </MenuItem>
                )}
              </Menu>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Grid>
  );
};

export default Header;
