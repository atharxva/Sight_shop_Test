const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const assert = require("node:assert/strict");

const baseUrl = "http://localhost:8000";

async function request(driver, path, method = "GET", body = null) {
  return driver.executeAsyncScript(
    function (url, requestMethod, payload, done) {
      fetch(url, {
        method: requestMethod,
        headers: payload ? { "Content-Type": "application/json" } : {},
        body: payload ? JSON.stringify(payload) : undefined,
      })
        .then(async (response) => {
          const text = await response.text();

          let parsedBody = text;
          try {
            parsedBody = JSON.parse(text);
          } catch (error) {
            void error;
          }

          done({ status: response.status, body: parsedBody });
        })
        .catch((error) => done({ status: 0, error: error.message }));
    },
    `${baseUrl}${path}`,
    method,
    body,
  );
}

(async () => {
  const options = new chrome.Options().addArguments(
    "--headless=new",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--window-size=1280,800",
  );

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    await driver.get(`${baseUrl}/api/getkey`);

    const getKeyResult = await request(driver, "/api/getkey");
    const productsResult = await request(driver, "/products");
    const doctorsResult = await request(driver, "/api/doctors");
    const searchResult = await request(driver, "/search/eye");
    const loginResult = await request(driver, "/api/admin/login", "POST", {
      username: "admin",
      password: "admin123",
    });
    const orderResult = await request(driver, "/api/order", "POST", {
      amount: 100,
    });

    assert.equal(getKeyResult.status, 200);
    assert.ok(getKeyResult.body.keyId);

    assert.equal(productsResult.status, 200);
    assert.ok(Array.isArray(productsResult.body));

    assert.equal(doctorsResult.status, 200);
    assert.ok(Array.isArray(doctorsResult.body));

    assert.equal(searchResult.status, 200);
    assert.ok(
      Object.prototype.hasOwnProperty.call(searchResult.body, "products"),
    );

    assert.equal(loginResult.status, 200);
    assert.equal(loginResult.body.message, "Login successful");

    assert.ok([200, 404].includes(orderResult.status));
    assert.ok(
      Object.prototype.hasOwnProperty.call(orderResult.body, "success"),
    );
  } finally {
    await driver.quit();
  }
})();
