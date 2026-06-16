const baseUrl = "http://localhost:8000";

describe("Backend API smoke tests", () => {
  it("checks the key endpoint", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/api/getkey`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("keyId");
    });
  });

  it("checks the products endpoint", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/products`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
    });
  });

  it("checks the doctors endpoint", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/api/doctors`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
    });
  });

  it("checks the search endpoint", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/search/eye`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("products");
    });
  });

  it("checks admin login", () => {
    cy.request({
      method: "POST",
      url: `${baseUrl}/api/admin/login`,
      body: {
        username: "admin",
        password: "admin123",
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("message", "Login successful");
    });
  });

  it("checks order creation", () => {
    cy.request({
      method: "POST",
      url: `${baseUrl}/api/order`,
      body: {
        amount: 100,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 404]);
      expect(response.body).to.have.property("success");
    });
  });
});
