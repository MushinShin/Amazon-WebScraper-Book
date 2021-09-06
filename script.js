const puppeteer = require("puppeteer");

(async () => {
  //all puppeteer methods return promises
  //headless opens the browser to see live
  const browser = await puppeteer.launch({ headless: true });
  //createas new page
  const page = await browser.newPage();
  //in the new page goes to the link
  await page.goto("http://www.amazon.es");
  //#-> searchs for an element of html with that id //, -> is the input to write inside
  await page.type("#twotabsearchtextbox", "libros de javascript");

  //Clicks in the search button with that method
  await page.click(".nav-search-submit input");
  await page.waitForSelector("[data-component-type=s-search-result]");
  await page.screenshot({ path: "amazon2.jpg" });

  const filteredLinks = await page.evaluate(() => {
    const elements = document.querySelectorAll(
      "[data-component-type=s-search-result] h2 a"
    );

    // empty array for the links
    const links = [];
    // stores all the links inside the links empty array
    // element is the 'a' element in the querySelector
    for (let element of elements) {
      links.push(element.href);
    }
    // the links stored in the array are return to the const filteredLinks
    return links;
  });

  console.log(filteredLinks.length);

  const books = [];
  //goes to each stored link inside the array (filtered links)
  for (let link of filteredLinks) {
    await page.goto(link);

    //Waits for the product title to load (html element)
    await page.waitForSelector("#productTitle");

    const book = await page.evaluate(() => {
      //Create a empty object to store the data
      const tmp = {};
      //saves the title of the product inside the tmp object const
      tmp.title = document.querySelector("#productTitle").innerText;
      tmp.author = document.querySelector(".author a").innerText;
      //returns everything to the const book
      return tmp;
    });
    books.push(book);
  }
  console.log(books);

  await browser.close();
})();
