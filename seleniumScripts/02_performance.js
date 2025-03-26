const { Builder, By, Key, until } = require("selenium-webdriver");

function pause(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function testSeleniumPage() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        console.log("Opening test page...");
        await driver.get("http://localhost:4000");

        // Measure time for form submission
        try {
            console.log("Submitting form...");
            let inputField = await driver.findElement(By.id("formInput"));
            await inputField.sendKeys("Selenium Test");

            let startTime = Date.now(); // Start timer
            await driver.findElement(By.xpath("//button[text()='Submit Form']")).click();
            await driver.wait(until.urlContains("/result"), 5000);
            let endTime = Date.now(); // End timer

            let resultText = await driver.findElement(By.tagName("p")).getText();
            if (resultText !== "You entered: Selenium Test") throw new Error("❌ Form submission failed");
            else console.log(`✅ Form submission successful! Load time: ${endTime - startTime} ms`);
        } catch (error) {
            console.error("Form Submission Test Failed:", error.message);
        }

        // Measure time for navigating back
        try {
            let startTime = Date.now(); // Start timer
            await driver.findElement(By.tagName("a")).click();
            await driver.wait(until.urlIs("http://localhost:4000/"), 5000);
            let endTime = Date.now(); // End timer

            console.log(`✅ Navigation back successful! Load time: ${endTime - startTime} ms`);
        } catch (error) {
            console.error("Navigation Test Failed:", error.message);
        }

        console.log("✅✅✅✅ All tests Executed!");
    } catch (error) {
        console.error("Test failed:", error.message);
    } finally {
        await driver.quit();
    }
})();
