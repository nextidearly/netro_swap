import { ConnectButton } from "@rainbow-me/rainbowkit";
import { IoIosArrowDown } from "react-icons/io";

export const HeaderButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
            className="text-[#b9c0d6] font-semibold text-[16px]"
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="bg-[#010514] py-2 px-3 rounded-md hover:text-gray-400 transition ease-in-out hover:scale-105"
                  >
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="bg-[#010514] py-2 px-3 rounded-md hover:text-gray-400 transition ease-in-out hover:scale-105"
                  >
                    Wrong network
                  </button>
                );
              }
              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={openChainModal}
                    style={{ display: "flex", alignItems: "center" }}
                    type="button"
                    className="bg-[#010514] py-2 px-3 rounded-md hover:text-gray-400 transition ease-in-out hover:scale-105"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 20,
                          height: 20,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 20, height: 20 }}
                          />
                        )}
                      </div>
                    )}
                    <span className="hidden lg:flex">{chain.name}</span>
                    &nbsp;
                    <IoIosArrowDown />
                  </button>
                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="bg-[#010514] py-2 px-3 rounded-md hover:text-gray-400 transition ease-in-out hover:scale-105 flex items-center"
                  >
                    {/* <span className="hidden lg:flex">
                      {account.displayName}
                    </span> */}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                    &nbsp;
                    <IoIosArrowDown />
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
