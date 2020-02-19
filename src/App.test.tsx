import { Builder, By, WebDriver } from 'selenium-webdriver'
import firefox from 'selenium-webdriver/firefox'
import 'geckodriver'

const url = 'http://localhost:3000'

describe('App Testing', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    const options = new firefox.Options();
    options.headless();
    options.setBinary("./browsers/firefox");

    driver = await new Builder()
      .forBrowser("firefox")
      .setFirefoxOptions(options)
      // .usingServer('http://0.0.0.0:4444/wd/hub')
      .build();

    await driver.get(url);
  })

  afterAll(async () => {
    await driver.quit();
  })

  it('Renders 1 row', async () => {
    await driver.findElement(By.id("new-phase")).click()
    {
      const dropdown = await driver.findElement(By.id("new-phase"))
      await dropdown.findElement(By.xpath("//option[. = '-- Add Phase --']")).click()
    }
    await driver.findElement(By.css("#new-phase > option:nth-child(3)")).click()
    await driver.findElement(By.name("task")).click()
    {
      const dropdown = await driver.findElement(By.name("task"))
      await dropdown.findElement(By.xpath("//option[. = 'architecture']")).click()
    }
    await driver.findElement(By.css(".task-0 > option:nth-child(3)")).click()
    await driver.findElement(By.name("blocked")).click()
  })
})