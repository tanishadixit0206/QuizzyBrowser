const { randomProxyPicker } = require('./proxyHandler');
const { search } = require('./gfgScraper');
const axios = require('axios');

(async () => {
    
// const FETCH_PROXY_URL = process.env.FETCH_PROXY_URL;
//     const response = await axios.get(FETCH_PROXY_URL);
//     await console.log(response.data)
  const proxy = await randomProxyPicker();
  const result = await search('binary search', proxy);
  console.log(result);
})();
