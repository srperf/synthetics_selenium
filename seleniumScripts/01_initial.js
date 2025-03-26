const { Builder, By, Key, until } = require("selenium-webdriver");

function pause(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function testSeleniumPage() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        console.log("Opening test page...");
        await driver.get("http://localhost:4000");

        // 1. Click the button that triggers an alert
        try {
            console.log("Clicking alert button...");
            await driver.findElement(By.xpath("//button[text()='Click me']")).click();
            let alertBox = await driver.switchTo().alert();
            let alertText = await alertBox.getText();
            if (alertText !== "Button clicked!") throw new Error("❌ Alert text does not match");
            else console.log("✅ Test passed!")
            alertBox.accept();
        } catch (error) {
            console.error("Alert Test Failed:", error.message);
        }

        // 2. Fill and submit form, then check if navigated
        try {
            console.log("Submitting form...");
            let inputField = await driver.findElement(By.id("formInput"));
            await inputField.sendKeys("Selenium Test");
            await driver.findElement(By.xpath("//button[text()='Submit Form']")).click();
            await driver.wait(until.urlContains("/result"), 5000);

            let resultText = await driver.findElement(By.tagName("p")).getText();
            if (resultText !== "You entered: Selenium Test") throw new Error("❌ Form submission failed");
            else console.log("✅ Test passed!")
        } catch (error) {
            console.error("Form Submission Test Failed:", error.message);
        }

        // 3. Navigate back to home
        try {
            await driver.findElement(By.tagName("a")).click();
            await driver.wait(until.urlIs("http://localhost:4000/"), 5000);
        } catch (error) {
            console.error("Navigation Test Failed:", error.message);
        }

        // 4. Toggle hidden text and check visibility
        try {
            console.log("Toggling hidden element...");
            let toggleButton = await driver.findElement(By.xpath("//button[text()='Show/Hide Text']"));
            await toggleButton.click();
            await toggleButton.click();
            let hiddenText = await driver.findElement(By.id("hiddenText"));
            let isHiddenTextVisible = await hiddenText.isDisplayed();
            if (!isHiddenTextVisible) throw new Error("❌ Hidden text did not appear");
            else console.log("✅ Test passed!")
        } catch (error) {
            console.error("Toggle Hidden Element Test Failed:", error.message);
        }

        // 5. Wait for a dynamic element to appear
        try {
            console.log("Waiting for dynamic element...");
            await driver.findElement(By.xpath("//button[text()='Add Element After 2 Seconds']")).click();
            let dynamicText = await driver.wait(
                until.elementLocated(By.xpath("//p[text()='This is a dynamically added element!']")),
                3000
            );
            if (!(await dynamicText.isDisplayed())) throw new Error("❌ Dynamic element did not appear");
            else console.log("✅ Test passed!")
        } catch (error) {
            console.error("Dynamic Element Test Failed:", error.message);
        }

        // 6. Check live counter updates
        try {
            console.log("Check live counters...");
            let counterBefore = await driver.findElement(By.id("counter")).getText();
            await driver.sleep(1100); // Wait 1 second
            let counterAfter = await driver.findElement(By.id("counter")).getText();
            if (counterBefore === counterAfter) throw new Error("❌ Counter did not update");
            else console.log("✅ Test passed!")
        } catch (error) {
            console.error("Counter Test Failed:", error.message);
        }

        // 7. Select dropdown option and verify alert
        try {
            console.log("Selecting from dropdown...");
            let dropdown = await driver.findElement(By.id("dropdown"));
            await dropdown.sendKeys("Option 2");
            await driver.findElement(By.xpath("//button[text()='Select']")).click();
            let dropdownAlert = await driver.switchTo().alert();
            let dropdownAlertText = await dropdownAlert.getText();
            if (dropdownAlertText !== "You selected: Option 2") throw new Error("❌ Dropdown selection incorrect");
            else console.log("✅ Test passed!")
            dropdownAlert.accept();
        } catch (error) {
            console.error("Dropdown Test Failed:", error.message);
        }

        // 8. Open pop-up and verify window switch
        try {
            console.log("Opening pop-up...");
            let mainWindow = await driver.getWindowHandle();
            await driver.findElement(By.xpath("//button[text()='Open Pop-up']")).click();
            let allWindows = await driver.getAllWindowHandles();
            let popupWindow = allWindows.find(win => win !== mainWindow);
            await driver.switchTo().window(popupWindow);
            let popupTitle = await driver.getTitle();
            if (popupTitle !== "Popup") throw new Error("❌ Incorrect pop-up title");
            else console.log("✅ Test passed!")
            await driver.close();
            await driver.switchTo().window(mainWindow);
        } catch (error) {
            console.error("Pop-up Test Failed:", error.message);
        }

        // 9. Check table content
        try {
            console.log("Checking table...");
            let table = await driver.findElement(By.tagName("table"));
            let rows = await table.findElements(By.tagName("tr"));
            if (rows.length <= 1) throw new Error("❌ Table does not contain expected rows");
            else console.log("✅ Test passed!")
        } catch (error) {
            console.error("Table Test Failed:", error.message);
        }

        // 10. Navigate to About page and back
        try {
            console.log("Navigating to About page...");
            await driver.findElement(By.xpath("//a[text()='Go to About Page']")).click();
            await driver.wait(until.urlContains("/about"), 5000);
            let aboutHeading = await driver.findElement(By.tagName("h1")).getText();
            if (aboutHeading !== "About Page") throw new Error("❌ Did not navigate to About page");
            else console.log("✅ Test passed!")
            await driver.findElement(By.xpath("//a[text()='Go Back to Main Page']")).click();
            await driver.wait(until.urlIs("http://localhost:4000/"), 5000);
        } catch (error) {
            console.error("About Page Test Failed:", error.message);
        }

        console.log("✅✅✅✅ All tests completed!");
    } catch (error) {
        console.error("Test failed:", error.message);
    } finally {
        await driver.quit();
    }
})();
