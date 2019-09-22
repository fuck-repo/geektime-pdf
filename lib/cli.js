const puppeteer = require('puppeteer');

module.exports = async function geektimePdf() {
  const username = process.env.username;
  const password = process.env.password;
  const cid = process.env.cid;
  const browser = await puppeteer.launch({ headless: true, defaultViewport: { width: 1920, height: 2000} });
  let page = await browser.newPage();
  await page.goto('https://account.geekbang.org/login?redirect=https%3A%2F%2Ftime.geekbang.org%2F', {waitUntil: 'networkidle0' });
  await page.type('.nw-phone-container .nw-input', username,  {delay: 100});
  await page.type('.input-wrap .input', password,  {delay: 100});
  await page.click('.mybtn');
  await page.waitFor(1000);
  page.close();
  page = await browser.newPage();
  await page.goto(`https://time.geekbang.org/column/intro/${cid}`);
  let articleArr = [];
  let articleHtmlArr = [];
  await page.on('response', async response => {
    if ('xhr' !== response.request().resourceType()){
        return ;
    }
    if (response.url().includes('column/articles')) {
      const res = await response.text();
      
      articleArr = JSON.parse(res).data.list;
      for (let i = 1; i < articleArr.length; i++) {
        const _page = await browser.newPage()
        await _page.goto(`https://time.geekbang.org/column/article/${articleArr[i].id}`, { waitUntil: "load" });
        // articleHtmlArr.push()
        await _page.waitFor(1000);
        let html = await page.evaluate(() => document.querySelector('body').innerHTML);
        // console.log(html);
        articleHtmlArr.push(html);
        _page.close();
      }
    
    }
    htmlToPdf(articleHtmlArr, articleArr);
  });
  
  // async function htmlToPdf(arr, arr2) {
  //   // console.log(html);
  //   const _browser = await puppeteer.launch();
  //   let _page = await browser.newPage();
  //   // await page.setViewport(Object.assign(page.viewport(), {width: parseInt(width, 10), height: parseInt(height, 10)});
  //   for (let i = 1; i < arr.length; i++) {
  //     await _page.setContent(arr[i]);
  //     await _page.pdf({path: `${arr2[i].title}.pdf`});
  //   }
  //   _browser.close();
  // }

}

