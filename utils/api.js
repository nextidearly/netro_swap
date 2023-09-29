const api_key = process.env.NEXT_PUBLIC_ONCEINCH_API_KEY;
const token_api_version = process.env.NEXT_PUBLIC_TOKEN_API_VERSION;
const swap_api_version = process.env.NEXT_PUBLIC_SWAP_API_VERSION;

const headers = {
  accept: "application/json",
  Authorization: `Bearer ${api_key}`,
};

export function token_list(chain) {
  const url = `/1inch/token/${token_api_version}/${chain}/token-list`;
  const res = fetch(url, { headers: headers });
  return res;
}

export function get_protocols(chain) {
  const url = `/1inch/swap/${swap_api_version}/${chain}/liquidity-sources`;
  const res = fetch(url, { headers: headers });
  return res;
}

export function get_router(chain) {
  const url = `/1inch/swap/${swap_api_version}/${chain}/approve/spender`;
  const res = fetch(url, { headers: headers });

  return res;
}

export function quote(from, to, amount, chain) {
  const url = `/1inch/swap/${swap_api_version}/${chain}/quote?src=${from}&dst=${to}&amount=${amount}&includeTokensInfo=true&includeProtocols=true&includeGas=true`;
  const res = fetch(url, { headers: headers });
  return res;
}

export function swap(from, to, amount, chain, address) {
  const url = `/1inch/swap/${swap_api_version}/${chain}/swap?src=${from}&dst=${to}&amount=${amount}&from=${address}&slippage=1&includeTokensInfo=true&includeProtocols=true&compatibility=true&allowPartialFill=true`;
  const res = fetch(url, { headers: headers });
  return res;
}

export function searchTokenList(chain, query) {
  const url = `/1inch/token/${token_api_version}/${chain}/search?query=${query}&ignore_listed=false&limit=10`;
  const res = fetch(url, { headers: headers });
  return res;
}