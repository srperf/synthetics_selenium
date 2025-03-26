const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const http = require("http");

async function sendToInflux(measurement, duration) {
    const data = `page_load,action=${measurement} duration=${duration}`;

    const options = {
        hostname: "localhost",
        port: 8086,
        path: "/write?db=selenium",
        method: "POST",
        headers: {
            "Content-Type": "text/plain",
            "Content-Length": Buffer.byteLength(data),
        },
    };

    const req = http.request(options, (res) => {
        if (res.statusCode === 204) {
            console.log(`✅ Successfully sent ${measurement} data to InfluxDB`);
        } else {
            console.error(`❌ Failed to send data to InfluxDB. Status: ${res.statusCode}`);
        }
    });

    req.on("error", (error) => {
        console.error("❌ Error sending data to InfluxDB:", error.message);
    });

    req.write(data);
    req.end();
}

(async function testSeleniumPage() {
    // Enable headless Chrome (corrected syntax)
    let options = new chrome.Options();
    options.addArguments("--headless=new", "--disable-gpu", "--window-size=1920,1080");

    let driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    try {
        console.log("Opening test page in headless mode...");
        await driver.get("http://localhost:4000");

        // Measure form submission time and send to InfluxDB
        try {
            console.log("Submitting form...");
            let inputField = await driver.findElement(By.id("formInput"));
            await inputField.sendKeys("Selenium Test");

            let startTime = Date.now();
            await driver.findElement(By.xpath("//button[text()='Submit Form']")).click();
            await driver.wait(until.urlContains("/result"), 5000);
            let endTime = Date.now();

            let duration = endTime - startTime;
            console.log(`✅ Form submission successful! Load time: ${duration} ms`);
            sendToInflux("form_submission", duration);
        } catch (error) {
            console.error("Form Submission Test Failed:", error.message);
        }

        // Measure navigation back time and send to InfluxDB
        try {
            let startTime = Date.now();
            await driver.findElement(By.tagName("a")).click();
            await driver.wait(until.urlIs("http://localhost:4000/"), 5000);
            let endTime = Date.now();

            let duration = endTime - startTime;
            console.log(`✅ Navigation back successful! Load time: ${duration} ms`);
            sendToInflux("navigation_back", duration);
        } catch (error) {
            console.error("Navigation Test Failed:", error.message);
        }

        console.log("✅✅✅✅ All tests Executed in Headless Mode!");
    } catch (error) {
        console.error("Test failed:", error.message);
    } finally {
        await driver.quit();
    }
})();
