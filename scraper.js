const puppeteer = require('puppeteer');

const searchLinks = async (url, page) => {
  await page.goto(url);

  // Two list representing two columns for each row.
  const allDecayModes = await page.$$eval('tr td:nth-last-of-type(5)', (t) =>
    t.map((e) => e.textContent)
  );
  const allLinks = await page.$$eval('tr th a', (allAs) =>
    allAs.map((a) => a.href)
  );

  // Loops through each Decay Mode and if it contains the alpha symbol 'a', then the corresponding href link is saved.
  const links = [];
  for (const [index, element] of allDecayModes.entries()) {
    if (element.includes('a')) {
      links.push(allLinks[index]);
    }
  }

  return links;
};

const parseDecay = async (url, page) => {
  await page.goto(url);
  // Try/Catch handles situations where there are no decay tables present because $eval selectors throw an error when no match is found.
  try {
    let alpha = await page.$$eval(
      'td center table:nth-last-of-type(1) tr td',
      (t) => t.map((e) => e.textContent.split(String.fromCharCode(160)))
    );

    // Removes first and last element which are blank from scraping page breaks
    alpha = await alpha.slice(1, alpha.length - 1);

    const ea = [];
    const ia = [];

    // Pairs Energies and Intensities in sub-lists
    for (let i = 0; i < alpha.length; i = i + 2) {
      ea.push(alpha[i][0]);
      ia.push(alpha[i + 1][0]);
    }

    return { ea: ea.reverse(), ia: ia.reverse() };
  } catch (error) {
    return null;
  }
};

const findDecay = async (z = null, a = null) => {
  const baseUrl = 'http://nucleardata.nuclear.lu.se/toi/listnuc.asp?sql=&';
  const payload = [];

  // Adjusts URL based on passed parameters.
  let url = null;
  if (!z) {
    return null;
  } // No parameters passed
  else if (!a) {
    url = `${baseUrl}Z=${z}`;
  } // Only atomic number passed
  else {
    url = `${baseUrl}A1=${a}&A2=${a}&Z=${z}`;
  } // Mass number and atomic number passed

  // For debugging: pass {headless:false} to launch() to display the automation
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  const links = await searchLinks(url, page);

  // Parses alpha energy information from each page collected
  for (let link of links) {
    let info = await parseDecay(link, page);
    if (info) {
      payload.push({ ea: info.ea, ia: info.ia });
    }
  }

  await browser.close();

  return payload;
};

module.exports = findDecay;
