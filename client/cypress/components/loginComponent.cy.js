import { mount } from '@cypress/react18';
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter
import Login from '../../src/components/Login';
import { MockUserProvider } from '../support/MockUserProvider';

describe('Security Test for Login', () => {
    describe('Manual Security Testing', () => {
        beforeEach(() => {
            mount(
                <BrowserRouter>
                    <MockUserProvider>
                        <Login />
                    </MockUserProvider>
                </BrowserRouter>
            );
        });

        it('should allow login for valid credentials', () => {
            // Input correct username and password
            cy.getByData('loginUsername').type('test-user');
            cy.getByData('loginPassword').type('test-password');
            cy.getByData('loginButton').should('exist').click();

            // Validate correct redirection
            cy.url().should('include', '/todos');
        });

        it('should not allow login for invalid credentials', () => {
            // Input incorrect username and password
            cy.getByData('loginUsername').type('test');
            cy.getByData('loginPassword').type('test');
            cy.getByData('loginButton').should('exist').click();

            // Validate error message
            cy.contains('Invalid credentials').should('be.visible');
        });

        it('should show generic error when logging in with one incorrect field - correct username, incorrect password', () => {
            // Input correct username but incorrect password
            cy.getByData('loginUsername').type('test-user');
            cy.getByData('loginPassword').type('test');
            cy.getByData('loginButton').should('exist').click();

            // Validate error message
            cy.contains('Invalid credentials').should('be.visible');
        });

        it('should show generic error when logging in with one incorrect field - incorrect username, correct password', () => {
            // Input correct username but incorrect password
            cy.getByData('loginUsername').type('test');
            cy.getByData('loginPassword').type('test-password');
            cy.getByData('loginButton').should('exist').click();

            // Validate error message
            cy.contains('Invalid credentials').should('be.visible');
        });
    });

    describe('NoSQL Injection Test', () => {
        beforeEach(() => {
            mount(
                <BrowserRouter>
                    <MockUserProvider>
                        <Login />
                    </MockUserProvider>
                </BrowserRouter>
            );
        });

        it('should show error when logging in with NoSQL injection in username', () => {
            // Use $ne: null - not equal to null, and use correct password
            cy.getByData('loginUsername').clear().invoke('val', '{"$ne": null}').trigger('input');
            cy.getByData('loginPassword').type('test-password');
            cy.getByData('loginButton').should('exist').click();

            // Validate error message shows and does not allow login
            cy.contains('Invalid credentials').should('be.visible');
            cy.url().should('not.include', '\todos');
        });

        it('should show error when logging in with NoSQL injection in password', () => {
            // Use $ne: null - not equal to null, and use correct username
            cy.getByData('loginUsername').type('test-user');
            cy.getByData('loginPassword').clear().invoke('val', '{"$ne": null}').trigger('input');
            cy.getByData('loginButton').should('exist').click();

            // Validate error message shows and does not allow login
            cy.contains('Invalid credentials').should('be.visible');
            cy.url().should('not.include', '\todos');
        });
    });

    describe('XSS Test', () => {
        beforeEach(() => {
            mount(
                <BrowserRouter>
                    <MockUserProvider>
                        <Login />
                    </MockUserProvider>
                </BrowserRouter>
            );
        });

        it('should show error when logging in with XSS scripting in username', () => {
            // Use <script>alert("XSS")</script>, and verify correct error shows
            cy.getByData('loginUsername').type('<script>alert("XSS")</script>');
            cy.getByData('loginPassword').type('test-password');
            cy.getByData('loginButton').should('exist').click();

            // Validate error message shows and does not allow login
            cy.contains('Invalid credentials').should('be.visible');
            cy.url().should('not.include', '\todos');
            cy.on('window:alert', (str) => {
                // This should not be called if sanitization works
                throw new Error('XSS vulnerability detected');
            });
        });

    });
});