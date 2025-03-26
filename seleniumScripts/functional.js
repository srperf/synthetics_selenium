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
        console.log("Clicking alert button...");
        await driver.findElement(By.xpath("//button[text()='Click me']")).click();
        let alertBox = await driver.switchTo().alert();
        let alertText = await alertBox.getText();
        if (alertText !== "Button clicked!") throw new Error("❌ Alert text does not match");
        alertBox.accept();

        // 2. Fill and submit form, then check if navigated
        console.log("Submitting form...");
        let inputField = await driver.findElement(By.id("formInput"));
        await inputField.sendKeys("Selenium Test");
        await driver.findElement(By.xpath("//button[text()='Submit Form']")).click();
        await driver.wait(until.urlContains("/result"), 5000);

        let resultText = await driver.findElement(By.tagName("p")).getText();
        //console.log(resultText);
        //await pause(20000);
        if (resultText !== "You entered: Selenium Test") throw new Error("❌ Form submission failed");

        // 3. Navigate back to home
        await driver.findElement(By.tagName("a")).click();
        await driver.wait(until.urlIs("http://localhost:4000/"), 5000);

        // 4. Toggle hidden text and check visibility
        console.log("Toggling hidden element...");
        let toggleButton = await driver.findElement(By.xpath("//button[text()='Show/Hide Text']"));
        await toggleButton.click();
        await toggleButton.click();
        let hiddenText = await driver.findElement(By.id("hiddenText"));
        let isHiddenTextVisible = await hiddenText.isDisplayed();
        if (!isHiddenTextVisible) throw new Error("❌ Hidden text did not appear");

        // 5. Wait for a dynamic element to appear
        console.log("Waiting for dynamic element...");
        await driver.findElement(By.xpath("//button[text()='Add Element After 2 Seconds']")).click();
        let dynamicText = await driver.wait(
            until.elementLocated(By.xpath("//p[text()='This is a dynamically added element!']")),
            3000
        );
        if (!(await dynamicText.isDisplayed())) throw new Error("❌ Dynamic element did not appear");

        // 6. Check live counter updates
        let counterBefore = await driver.findElement(By.id("counter")).getText();
        await driver.sleep(1100); // Wait 1 second
        let counterAfter = await driver.findElement(By.id("counter")).getText();
        if (counterBefore === counterAfter) throw new Error("❌ Counter did not update");

        // 7. Select dropdown option and verify alert
        console.log("Selecting from dropdown...");
        let dropdown = await driver.findElement(By.id("dropdown"));
        await dropdown.sendKeys("Option 2");
        await driver.findElement(By.xpath("//button[text()='Select']")).click();
        let dropdownAlert = await driver.switchTo().alert();
        let dropdownAlertText = await dropdownAlert.getText();
        if (dropdownAlertText !== "You selected: Option 2") throw new Error("❌ Dropdown selection incorrect");
        dropdownAlert.accept();

        // 8. Open pop-up and verify window switch
        console.log("Opening pop-up...");
        let mainWindow = await driver.getWindowHandle();
        await driver.findElement(By.xpath("//button[text()='Open Pop-up']")).click();
        let allWindows = await driver.getAllWindowHandles();
        let popupWindow = allWindows.find(win => win !== mainWindow);
        await driver.switchTo().window(popupWindow);
        let popupTitle = await driver.getTitle();
        console.log(popupTitle);
        if (popupTitle !== "Popup") throw new Error("❌ Incorrect pop-up title");
        await driver.close();
        await driver.switchTo().window(mainWindow);

        // 9. Check table content
        let table = await driver.findElement(By.tagName("table"));
        let rows = await table.findElements(By.tagName("tr"));
        if (rows.length <= 1) throw new Error("❌ Table does not contain expected rows");

        // 10. Navigate to About page and back
        console.log("Navigating to About page...");
        await driver.findElement(By.xpath("//a[text()='Go to About Page']")).click();
        await driver.wait(until.urlContains("/about"), 5000);
        let aboutHeading = await driver.findElement(By.tagName("h1")).getText();
        if (aboutHeading !== "About Page") throw new Error("❌ Did not navigate to About page");
        await driver.findElement(By.xpath("//a[text()='Go Back to Main Page']")).click();
        await driver.wait(until.urlIs("http://localhost:4000/"), 5000);

        console.log("✅ All tests PASSED successfully!");
    } catch (error) {
        console.error(error.message);
    } finally {
        await driver.quit();
    }
})();
