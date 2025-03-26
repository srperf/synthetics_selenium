const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const http = require("http");

async function sendToInflux(measurement, duration, status) {
    const data = `page_load,action=${measurement} duration=${duration},status=${status}`;

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
            console.log(`✅ Sent ${measurement} data to InfluxDB (Status: ${status})`);
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

(async function checkPageAvailability() {
    let options = new chrome.Options();
    options.addArguments("--headless=new", "--disable-gpu", "--window-size=1920,1080");

    let driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    let startTime = Date.now();
    let status = 1; // Assume success

    try {
        console.log("Checking if the main page is up...");

        await driver.get("http://localhost:4000");
        let loadTime = Date.now() - startTime;

        console.log(`✅ Page is up! Load time: ${loadTime} ms`);
        sendToInflux("page_availability", loadTime, status);
    } catch (error) {
        console.error("❌ Page is DOWN:", error.message);
        status = 0; // Mark failure
        sendToInflux("page_availability", 0, status); // Send failure status with 0ms
    } finally {
        await driver.quit();
    }
})();
