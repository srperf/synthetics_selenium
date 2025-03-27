const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const http = require("http");

async function sendToInflux(measurement, status) {
    const data = `functional_test,action=${measurement} status=${status}`;

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
            console.log(`✅ Successfully sent ${measurement} test result to InfluxDB`);
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
    // Enable headless Chrome
    let options = new chrome.Options();
    options.addArguments("--headless=new", "--disable-gpu", "--window-size=1920,1080");

    let driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    try {
        console.log("Opening test page in headless mode...");
        await driver.get("http://localhost:4000");

        // Functional Test: Form Submission
        try {
            console.log("Testing form submission...");
            let inputField = await driver.findElement(By.id("formInput"));
            await inputField.sendKeys("Selenium Test");
            await driver.findElement(By.xpath("//button[text()='Submit Form']")).click();
            await driver.wait(until.urlContains("/result"), 5000);

            let resultText = await driver.findElement(By.tagName("p")).getText();
            if (resultText === "You entered: Selenium Test") {
                console.log("✅ Form submission test passed!");
                sendToInflux("form_submission", 1); // 1 = Pass
            } else {
                throw new Error("Incorrect result text");
            }
        } catch (error) {
            console.error("❌ Form submission test failed:", error.message);
            sendToInflux("form_submission", 0); // 0 = Fail
        }

        // Functional Test: Navigation Back
        try {
            console.log("Testing navigation back...");
            await driver.findElement(By.tagName("a")).click();
            await driver.wait(until.urlIs("http://localhost:4000/"), 5000);

            console.log("✅ Navigation back test passed!");
            sendToInflux("navigation_back", 1); // 1 = Pass
        } catch (error) {
            console.error("❌ Navigation test failed:", error.message);
            sendToInflux("navigation_back", 0); // 0 = Fail
        }

        console.log("✅✅✅✅ All functional tests executed in headless mode!");
    } catch (error) {
        console.error("Test failed:", error.message);
    } finally {
        await driver.quit();
    }
})();
