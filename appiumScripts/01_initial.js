const wdio = require("webdriverio");

// Appium Server Capabilities
const opts = {
  path: "/wd/hub",
  port: 4723,
  capabilities: {
    platformName: "Android", // Change to "iOS" if testing on iPhone
    deviceName: "emulator-5554", // Use 'adb devices' to check your emulator name
    app: "/path/to/your/app.apk", // Replace with the correct path for Android APK
    automationName: "UiAutomator2", // Use "XCUITest" for iOS
  },
};

async function runTest() {
  const driver = await wdio.remote(opts);

  try {
    // Validate Welcome Text
    const welcomeText = await driver.$('~welcomeText');
    console.log("Welcome text:", await welcomeText.getText());

    // Click the Button & Validate Alert
    const alertButton = await driver.$('~alertButton');
    await alertButton.click();
    console.log("Clicked alert button!");

    // Enter Text & Validate Submission
    const inputField = await driver.$('~textInput');
    await inputField.setValue("Hello, Appium!");
    console.log("Entered text in input field.");

    // Validate Submitted Text
    const submittedText = await driver.$('~submittedText');
    console.log("Submitted text:", await submittedText.getText());

    // Toggle the Switch
    const toggleSwitch = await driver.$('~toggleSwitch');
    await toggleSwitch.click();
    console.log("Toggled the switch!");

    // Select an Option from the Dropdown
    const dropdown = await driver.$('~dropdownPicker');
    await dropdown.click();
    const option2 = await driver.$('//android.widget.CheckedTextView[@text="Option 2"]'); // Change for iOS if needed
    await option2.click();
    console.log("Selected 'Option 2' from dropdown.");

    console.log("✅ Test completed successfully!");

  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await driver.deleteSession();
  }
}

runTest();
