This is web scraping service I built for a teammate in a Software Engineering class at OSU. 

<b>Try it here:</b> https://osu361rad.herokuapp.com/?z=95 \
z - Atomic number, required \
a - Mass number, optional \
<i>Note: This is hosted on Heroku, it may take a few extra seconds to 'spin up' if it has been inactive for too long</i>


*** EXAMPLE *** \
Request: GET https://osu361rad.herokuapp.com/?z=96&a=246 \
Response: [{ ea: ["5386.5", "5343.5", "5243"], ia: ["82.2", "17.8", "~0.04"] }] 

The scraper is built using Node and Puppeteer, a JavaScript library that allows for browser automation and scraping. It also uses this website to find nuclide information: http://nucleardata.nuclear.lu.se/toi/nucSearch.asp 

When the service receives a GET request, it parses 'z' and 'a' from above, using that information to find the correct radionuclide. It will navigate through all the sub-links (representing the different masses of the nuclide) to scrape Alpha Energy/Intensity information. Once finished, it returns the entire list of data found.

This scraper can be imported into JavaScript as a function using 'scraper.js' e.g: findDecay(96, 246) 
