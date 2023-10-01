import React from "react";
import Link from "next/link";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import {
  TwitterLink,
  DiscordLink,
  ZealyLink,
} from "./../../environment/config";
import { BsDiscord } from "react-icons/bs";

const Footer = () => {
  return (
    <>
      <footer className="footer-wrapper">
        <div>@ {new Date().getFullYear()} XYXY Finance</div>
        <div className="social-links">
          <Link href={TwitterLink} target="_blank">
            <TwitterIcon className="social-link" />
          </Link>
          <Link href={DiscordLink} target="_blank">
            <BsDiscord
              style={{ width: "28px", height: "28px" }}
              className="social-link"
            />
          </Link>
          <Link href={ZealyLink} target="_blank">
            <img src="/zealy.png" className="social-link" />
          </Link>
        </div>
      </footer>
    </>
  );
};

export default Footer;
