var express = require('express');
var router = express.Router();
var puppeteer = require('puppeteer');

/* POST users listing. */
router.post('/', function(req, res, next) {

  console.log('POST request for translate', req.body.text, req.body.lang);

  try {
    (async () => {
      const querySourceLang = req.body.lang === 'ru' ? 'en' : 'ru';

      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      await page.setViewport({ width: 1280, height: 800 })
      const uri = `https://translate.google.com/#view=home&op=translate&sl=${querySourceLang}&tl=${req.body.lang}&text=${req.body.text}`;

      console.log('Search uri: ', uri);
      await page.goto(encodeURI(uri));
      await page.waitForSelector('.tlid-translation.translation');

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
