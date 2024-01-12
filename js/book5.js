const { Builder, By } = require('selenium-webdriver');
require('selenium-webdriver/chrome');
require('chromedriver');

//========= SELENIUM Strape ===================

async function OpenClosePage3(xUrl) {
  try {
    const driver = await GetSileniumDriver();
   
    await driver.sleep(500);

    await driver.get(xUrl); //('http://books.toscrape.com/');

    console.log('');
    console.log('Scraped BOOKS from the website:');
    console.log('');

    let cTableOut = [];
    let ni = 0;
    let ni_page = 0;
    const n_all_pages_to_read = 3;
    let bOk = false;

      do {
        bOk = false;
        const elements = await driver.findElements(By.className('product_pod'));

        for (const element of elements) { //all elements in actual page
          let r_data = await jReadElement(element); 

          r_data.json_line.gi_ind = ni;
          ni++;

          jPrintElement(r_data);
        }

        ni_page++;

        console.log('End of page.');
        await driver.sleep(100);

        let button_next = await driver.findElements(By.css('li.next > a'));

        if(n_all_pages_to_read <= ni_page)
          bOk = false;
        else if(button_next.length>0) {
            const actions = driver.actions({async: true});
            await actions.move({origin: button_next[0]}).click().perform();
            bOk = true;
        }

        await driver.sleep(100);
      }
      while(bOk);

    await driver.sleep(200);

    await driver.quit();

  } catch (error) {
      console.log('JError: '+error);
  } finally {
  } 
};


async function GetSileniumDriver() {
  //Window params
  const x = 100;
  const y =  80;
  const width = 1200
  const height = 980;

  try {
    const driver = await new Builder().forBrowser('chrome').build();

    await driver.manage().window().setRect({ width: width, height: height });
    await driver.manage().window().setRect({ x: x, y: y });

    await driver.sleep(200);

    return(driver);

  } catch (error) {
    console.log('JError: '+error);
    return(null);
  } 
};

//---------------------------------------------
async function jReadElement(x_element) {

  let json_line = getEmptyRowJson();
  let r_out = {bOk: false, sError:'Read Error', json_line}; //Struct/record to output value

  try {
    json_line.gs_image = await x_element.findElement(By.tagName('img')).getAttribute('src');
    json_line.gs_title = await x_element.findElement(By.tagName('h3')).getText();
    json_line.gs_link = await x_element.findElement(By.css('h3 > a')).getAttribute('href');
  
    const sprice = await x_element.findElement(By.css('p.price_color')).getText();
    var newStr = Number(sprice.replace(/[^0-9.-]+/g,""));

    json_line.gi_price = newStr;
    r_out.bOk = true;
    r_out.sError = 'Ok';
  }
  catch (s_error) {
    console.log('JError: '+error);
    r_out.bOk = false;
    r_out.sError = s_error;
  }

  return(r_out);
}

function jPrintElement(xr_data) {
  if(xr_data.bOk) {
    const json_line = xr_data.json_line;

    console.log('Position: '+ json_line.gi_ind);
    console.log('Image:', json_line.gs_image);
    console.log('Title:', json_line.gs_title);
    console.log('Link: ', json_line.gs_link);
    console.log('Price:', json_line.gi_price);
    console.log('');
  }
  else {
    console.log('Error line: ', xr_data.sError);
    console.log('');
  }
}

function getEmptyRowJson() {
  let json_line = {
    "gi_ind": 0,
    "gs_title": "",
    "gs_link": "",
    "gs_image": "",
    "gi_price": 1.1,
  };
  return(json_line);
}


OpenClosePage3('http://books.toscrape.com');
