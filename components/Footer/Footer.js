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
import { useTranslation } from "react-i18next";
import { IoBook } from "react-icons/io5";
import { FaDiscord } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";

const socials = [
  {
    icon: () => <IoBook />,
    name: "",
    href: "https://snowbank.gitbook.io/snow-bank",
  },
  {
    icon: () => <FaDiscord />,
    name: "",
    href: "https://discord.gg/KUwRXGdp",
  },
  // {
  //   icon: () => <FaYoutube />,
  //   name: "",
  //   href: "https://youtube.com/@lodgecapital",
  // },
  {
    icon: () => <FaTwitter />,
    name: "",
    href: "https://twitter.com/SnowBank_io",
  },
  {
    icon: () => <FaTelegramPlane />,
    name: "",
    href: " https://t.me/snowbanketh",
  },
];

const Footer = () => {
  const { t } = useTranslation();

  return (
    <>
      <footer className="footer-wrapper">
        <div className="grid gird-cols-1 sm:grid-cols-2 gap-2 items-center ">
          <div className="text-black font-bold">
            @ {new Date().getFullYear()} SNOW {t("finance", "Finance")}
          </div>
          <div className="gap-4 flex justify-center items-center">
            {socials.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  href={item.href}
                  key={index}
                  className={`p-1 flex items-center snow_effect justify-center h-[35px!important] w-[35px!important] main_btn_footer hover:scale-[100%!important]`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
