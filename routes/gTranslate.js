var express = require('express');
var router = express.Router();
var puppeteer = require('puppeteer');
var url = require('url');



/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');

  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  console.log(query.text, query.lang);

  try {
    (async () => {
      const querySourceLang = query.lang === 'ru' ? 'en' : 'ru';

      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      await page.setViewport({ width: 1280, height: 800 })
      const uri = `https://translate.google.com/#view=home&op=translate&sl=${querySourceLang}&tl=${query.lang}&text=${query.text}`;

      console.log('Search uri: ', uri);
      await page.goto(encodeURI(uri));
      await page.waitForSelector('.tlid-translation.translation');

      //const translation = await page.$('.tlid-translation.translation');
      const translation = await page.evaluate(() => document.querySelector('.tlid-translation.translation').textContent);

      console.log('translation ', translation);

      await browser.close()

      res.json({ translation });
    })()
  } catch (err) {
    console.error(err)
  }
});

module.exports = router;
