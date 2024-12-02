const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Perform a search on Google for GFG results
const search = async (query, proxy) => {
  try {
    const proxyUrl = `http://${proxy}`;
    
    const googleResponse = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(query)}+geeksforgeeks`, {
      proxy: {
        host: proxy.split(':')[0],
        port: proxy.split(':')[1],
      },
    });

    const $ = cheerio.load(googleResponse.data);
    const linkElement = $('h3').parent('a');
    const link = linkElement.attr('href');
    const gfgUrl = new URL(link).searchParams.get('q');

    if (!gfgUrl.includes('geeksforgeeks')) throw new Error('GFG link not found');

    const gfgResponse = await axios.get(gfgUrl, {
      proxy: {
        host: proxy.split(':')[0],
        port: proxy.split(':')[1],
      },
    });

    return parseGFGContent(gfgResponse.data, query);

  } catch (error) {
    console.error('Error in search:', error.message);
    return null;
  }
};

// Parse GFG content
const parseGFGContent = (html, query) => {
  const $ = cheerio.load(html);
  const title = $('h1').first().text().trim();
  const data = [title];

  $('article').first().children().each((_, element) => {
    if (element.name === 'p' || element.name === 'ul') {
      data.push($(element).text().trim());
    } else if (element.name === 'table') {
      const tableData = parseTable($, element);
      saveTableAsCSV(query, tableData);
    }
  });

  return data.join('\n');
};

// Parse tables into arrays
const parseTable = ($, table) => {
  const rows = [];
  $(table).find('tr').each((_, row) => {
    const cells = $(row).find('th, td').map((_, cell) => $(cell).text().trim()).get();
    rows.push(cells);
  });
  return rows;
};

// Save table data as CSV
const saveTableAsCSV = (query, tableData) => {
  const filePath = path.join(__dirname, 'data', `${query.split(' ')[0]}.csv`);
  const csvContent = tableData.map(row => row.join('\t')).join('\n');
  fs.writeFileSync(filePath, csvContent);
};

module.exports = { search };
