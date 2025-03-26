const http = require("http");

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Page</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
        button, input, select { font-size: 18px; padding: 10px; margin: 10px; width: 80%; max-width: 300px; }
        .hidden { display: none; }
        .container { max-width: 500px; margin: auto; }
    </style>
</head>
<body>

<div class="container">
    <h1>Testing Page</h1>

    <!-- 1. Alert Button -->
    <button onclick="alert('Button clicked!')">Click me</button>

    <!-- 2. Hidden Element -->
    <button onclick="toggleHidden()">Show/Hide Text</button>
    <p id="hiddenText" class="hidden">Now you see me!</p>

    <!-- 3. Form Submission -->
    <form id="testForm" onsubmit="return submitForm(event)">
        <input type="text" id="formInput" placeholder="Enter text" required>
        <button type="submit">Submit Form</button>
    </form>

    <!-- 4. Dynamic Element -->
    <button onclick="addElement()">Add Element After 2 Seconds</button>
    <div id="dynamicContainer"></div>

    <!-- 5. Live Counter -->
    <p>Live counter: <span id="counter">0</span></p>

    <!-- 6. Dropdown Test -->
    <select id="dropdown">
        <option value="Option 1">Option 1</option>
        <option value="Option 2">Option 2</option>
        <option value="Option 3">Option 3</option>
    </select>
    <button onclick="selectDropdown()">Select</button>

    <!-- 7. Navigation -->
    <a href="/about">Go to About Page</a>
</div>

<script>
    // 1. Toggle hidden text
    function toggleHidden() {
        let text = document.getElementById("hiddenText");
        text.classList.toggle("hidden");
    }

    // 2. Handle form submission
    function submitForm(event) {
        event.preventDefault();
        let inputValue = document.getElementById("formInput").value;
        window.location.href = "/result?data=" + encodeURIComponent(inputValue);
    }

    // 3. Simulate dynamically added element
    function addElement() {
        setTimeout(() => {
            let container = document.getElementById("dynamicContainer");
            let newElement = document.createElement("p");
            newElement.textContent = "This is a dynamically added element!";
            container.appendChild(newElement);
        }, 2000);
    }

    // 4. Live counter
    setInterval(() => {
        let counter = document.getElementById("counter");
        counter.textContent = parseInt(counter.textContent) + 1;
    }, 1000);

    // 5. Handle dropdown selection
    function selectDropdown() {
        let dropdown = document.getElementById("dropdown");
        alert("You selected: " + dropdown.value);
    }
</script>

</body>
</html>
`;

const aboutContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About Page</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
        button { font-size: 18px; padding: 10px; margin: 10px; width: 80%; max-width: 300px; }
    </style>
</head>
<body>
    <h1>About Page</h1>
    <a href="/">Go Back to Main Page</a>
</body>
</html>
`;

const server = http.createServer((req, res) => {
    if (req.url.startsWith("/result")) {
        let userData = new URL(req.url, `http://${req.headers.host}`).searchParams.get("data");
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Submission Result</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
                    button { font-size: 18px; padding: 10px; margin: 10px; width: 80%; max-width: 300px; }
                </style>
            </head>
            <body>
                <h1>Form Submitted</h1>
                <p>You submitted: ${userData}</p>
                <a href="/">Go Back to Main Page</a>
            </body>
            </html>
        `);
    } else if (req.url === "/about") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(aboutContent);
    } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(htmlContent);
    }
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000/");
});
