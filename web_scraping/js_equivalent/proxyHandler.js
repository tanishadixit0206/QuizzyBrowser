const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const FETCH_PROXY_URL = process.env.FETCH_PROXY_URL;
const DATA_DIR = path.join(__dirname, 'data');
const FILE_PATH = path.join(DATA_DIR, 'free-proxy-list.txt');
const TIME_PATH = path.join(DATA_DIR, 'time.txt');

// Ensure the data directory exists
const ensureDataDirExists = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

let proxyList = [];

// Fetch proxy data and write to file
const generateFile = async () => {
  try {
    const response = await axios.get(FETCH_PROXY_URL);
    await console.log(response.data)
    await fs.writeFileSync(FILE_PATH, response.data);
  } catch (error) {
    console.error('Error fetching proxies:', error.message || 'Invalid FETCH_PROXY_URL');
  }
};

// Populate proxyList from file
const createProxyList = () => {
  if (!fs.existsSync(FILE_PATH)) {
    console.error('Proxy file not found. Generating...');
    return [];
  }

  const fileContent = fs.readFileSync(FILE_PATH, 'utf-8');
  proxyList = fileContent.split('\n').filter(line => line.trim());
  return proxyList;
};

// Check if 10 minutes have passed since the last update
const shouldUpdateProxies = () => {
  if (!fs.existsSync(TIME_PATH)) return true;

  const lastUpdate = new Date(fs.readFileSync(TIME_PATH, 'utf-8'));
  const now = new Date();
  return ((now - lastUpdate) / (1000 * 60)) > 10;
};

// Get a random proxy
const randomProxyPicker = async () => {
  ensureDataDirExists();

  if (shouldUpdateProxies()) {
    await generateFile();
    fs.writeFileSync(TIME_PATH, new Date().toISOString());
  }

  const proxies = createProxyList();
  if (proxies.length === 0) {
    console.error('No proxies found in the list.');
    return null;
  }

  return proxies[Math.floor(Math.random() * proxies.length)];
};

module.exports = { randomProxyPicker };
