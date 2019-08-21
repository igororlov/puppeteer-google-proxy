var express = require('express');
var router = express.Router();
var puppeteer = require('puppeteer');
var url = require('url');
var querystring = require('querystring');


/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');

  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  console.log(query.query, query.page);

  try {
    (async () => {
      //const queryText = querystring.escape(query.query);
      const queryText = query.query;
      const queryPage = query.page > 1 ? `start=${(10*query.page-1)}` : '';

      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      await page.setViewport({ width: 1280, height: 800 })
      const uri = `https://www.google.com/search?q=${queryText}&${queryPage}`;

      //console.log('Search uri: ', uri);
      await page.goto(encodeURI(uri));
      await page.waitForSelector('h3.LC20lb');
      await page.waitForSelector('cite.iUh30');
      await page.waitForSelector('span.st');

      //const queryResults = await page.$$('div.rc');
      //console.log('queryResults', queryResults.length);
      // console.log('queryResults', await queryResults.$('h3.LC20lb'));

      // const titles = await page.$$('h3.LC20lb');
      // const links = await page.$$('cite.iUh30');
      // const snippets = await page.$$('span.st');

      const titles = await page.evaluate(
        () => [...document.querySelectorAll('h3.LC20lb')].map(elem => elem.innerText)
      );
      // const links = await page.evaluate(
      //   () => [...document.querySelectorAll('cite.iUh30')].map(elem => elem.innerText)
      // );
      const links = await page.evaluate(
        () => [...document.querySelectorAll('.rc .r a:first-child')].map(elem => elem.href)
      );

      const snippets = await page.evaluate(
        () => [...document.querySelectorAll('span.st')].map(elem => elem.innerText)
      );

      //const titles = await page.evaluate(() => document.querySelectorAll('h3.LC20lb').forEach()textContent);
      //const links = await page.evaluate(() => document.querySelector('cite.iUh30').textContent);
     // const snippets = await page.evaluate(() => document.querySelector('span.st').textContent);

      console.log('results ', titles.length, links.length, snippets.length);

      console.log('titles ', titles);
      console.log('links ', links);
      console.log('snippets ', snippets);

      const results = [];
      for (var i = 0; i < 9; i++) {
        //const titleValue = await (await titles[i].getProperty('innerHTML')).jsonValue();
        //const linkValue = await (await links[i].getProperty('innerHTML')).jsonValue();
        //const snippetValue = await (await snippets[i].getProperty('innerHTML')).jsonValue();
        //console.log(titleValue, linkValue, snippetValue);
        // const result = { title: titleValue, URL: linkValue, snippet: snippetValue };
        //results.push(result);

        results.push({ title: titles[i], URL: links[i], snippet: snippets[i] });
      }
      //console.log(titles.length, links.length, snippets.length);

      await browser.close()

      res.json(results);
    })()
  } catch (err) {
    console.error(err)
  }
});

module.exports = router;

