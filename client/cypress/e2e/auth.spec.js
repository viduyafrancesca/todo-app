// cypress/e2e/auth.spec.js

describe('Authentication API', () => {
  
    const backendUrl = 'http://localhost:5001/auth'; // Ensure this matches your backend server URL
  
    // Test registration
    it('Registers a new user', () => {
      cy.request('POST', `${backendUrl}/register`, {
        username: 'testuser',
        password: 'password123'
      }).then((response) => {
        expect(response.status).to.eq(201); // Created
        expect(response.body).to.have.property('message', 'User registered successfully');
      });
    });
  
    // Test login
    it('Logs in a registered user', () => {
      cy.request('POST', `${backendUrl}/login`, {
        username: 'testuser',
        password: 'password123'
      }).then((response) => {
        expect(response.status).to.eq(200); // OK
        expect(response.body).to.have.property('token');
        cy.wrap(response.body.token).as('authToken'); // Save token for later use
      });
    });
  
    // Test access to a protected route
    it('Accesses a protected route with valid token', function () {
      cy.get('@authToken').then((token) => {
        cy.request({
          method: 'GET',
          url: `${backendUrl}/todos`, // Assuming `/todos` requires authentication
          headers: { Authorization: `Bearer ${token}` }
        }).then((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });
  });
  