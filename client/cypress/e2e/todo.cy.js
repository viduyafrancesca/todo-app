describe('To-Do App E2E Tests', () => {

    // Home Screen Tests
    describe('Home Screen Tests', () => {
        beforeEach(() => {
            cy.visit('/');
        });

        it('should display welcome message on home screen', () => {
            cy.contains('h2', 'Welcome to the Todo App') // Verify heading
                .should('exist');

            cy.contains('Please register or login to continue.') // Verify prompt
                .should('exist');
        });

        it('should navigate to registration page when Register link is clicked', () => {
            cy.getByData("registrationForm").should("exist").click()

            // Assert that the URL is now /register
            cy.location("pathname").should("equal", "/register")

            // Check if the registration form loads
            cy.getByData("registrationWindow").should("be.visible")
        });

        it('should navigate to login page when Login link is clicked', () => {
            // Click on the login link
            cy.getByData("loginForm").should("exist").click();

            // Assert that the URL is now /login
            cy.url().should('include', '/login');

            // Check if the login form loads
            cy.getByData("loginWindow").should('be.visible');
        });
    });

    // User Registration Flow
    describe('User Registration Flow', () => {
        it('should register a new user successfully', () => {
            cy.visit('/register');
            cy.getByData("registerUsername").type('test-user');
            cy.getByData("registerPassword").type('test-password');
            cy.getByData("registerButton").should("exist").click();
            cy.contains('Registration successful! You can now log in.').should('be.visible');
        });

        it('should show error when username is blank', () => {
            cy.visit('/register');
            cy.getByData("registerPassword").type('test-password');
            cy.getByData("registerButton").should("exist").click();
            cy.getByData("registerUsername")
                .then(($input) => {
                    expect($input[0].validationMessage).to.eq('Please fill out this field.');
                });
        });

        it('should show error when password is blank', () => {
            cy.visit('/register');
            cy.getByData("registerUsername").type('test-user');
            cy.getByData("registerButton").should("exist").click();
            cy.getByData("registerPassword")
                .then(($input) => {
                    expect($input[0].validationMessage).to.eq('Please fill out this field.');
                });
        });

        it('should show error when registering with an existing username', () => {
            cy.visit('/register');
            cy.getByData("registerUsername").type('test-user');
            cy.getByData("registerPassword").type('test-password');
            cy.getByData("registerButton").should("exist").click();
            cy.contains('User already exists!').should('be.visible');
        });
    });

    // Login Flow
    describe('Login Flow', () => {
        it('should show error with incorrect password', () => {
            cy.visit('/login');
            cy.getByData("loginUsername").type('test-user');
            cy.getByData("loginPassword").type('wrong-password');
            cy.getByData("loginButton").should("exist").click();
            cy.contains('Invalid credentials').should('be.visible');
        });

        it('should show error with incorrect username', () => {
            cy.visit('/login');
            cy.getByData("loginUsername").type('wrong-username');
            cy.getByData("loginPassword").type('test-password');
            cy.getByData("loginButton").should("exist").click();
            cy.contains('Invalid credentials').should('be.visible');
        });

        it('should show error when username is blank', () => {
            cy.visit('/login');
            cy.getByData("loginPassword").type('test-password');
            cy.getByData("loginButton").should("exist").click();
            cy.getByData("loginUsername")
                .then(($input) => {
                    expect($input[0].validationMessage).to.eq('Please fill out this field.');
                });
        });

        it('should show error when password is blank', () => {
            cy.visit('/login');
            cy.getByData("loginUsername").type('test-user');
            cy.getByData("loginButton").should("exist").click();
            cy.getByData("loginPassword")
                .then(($input) => {
                    expect($input[0].validationMessage).to.eq('Please fill out this field.');
                });
        });

        it('should login successfully with valid credentials', () => {
            cy.visit('/login');
            cy.getByData("loginUsername").type('test-user');
            cy.getByData("loginPassword").type('test-password');
            cy.getByData("loginButton").should("exist").click();
            cy.url().should('include', '/todos'); // Assumes redirection to the todos page
        });
    });

    // Display Tasks by User
    describe('Display Tasks by User', () => {
        beforeEach(() => {
            // Login before checking tasks
            cy.visit('/login');
            cy.getByData("loginUsername").type('test-user');
            cy.getByData("loginPassword").type('test-password');
            cy.getByData("loginButton").should("exist").click();
        });

        it('should display tasks created by the logged-in user, expected 0 since user is new', () => {
            cy.url().should('include', '/todos');
            // cy.get('[data-cy=taskList]').should('have.length.greaterThan', 0); // Assumes task items have this data-cy
        });
    });

    // Task Creation
    describe('Task Creation', () => {
        beforeEach(() => {
            cy.visit('/login');
            cy.getByData("loginUsername").type('test-user');
            cy.getByData("loginPassword").type('test-password');
            cy.getByData("loginButton").should("exist").click();
        });

        it('should add a task with Low Priority', () => {
            cy.getByData("taskInput").type('test-lowprio-task');
            cy.getByData("addTaskButton").should("exist").click();
            cy.contains('test-lowprio-task').should('be.visible');
            cy.contains('Low Priority').should('be.visible');
        });

        it('should add a task with Medium Priority', () => {
            cy.getByData("taskInput").type('test-medprio-task');
            cy.getByData("priority").select('Medium Priority');
            cy.getByData("addTaskButton").should("exist").click();
            cy.contains('test-medprio-task').should('be.visible');
            cy.contains('Medium Priority').should('be.visible');
        });

        it('should add a task with High Priority', () => {
            cy.getByData("taskInput").type('test-hiprio-task');
            cy.getByData("priority").select('High Priority');
            cy.getByData("addTaskButton").should("exist").click();
            cy.contains('test-hiprio-task').should('be.visible');
            cy.contains('High Priority').should('be.visible');
        });
    });

    // Mark Task as Complete
    describe('Mark Task as Complete', () => {
        beforeEach(() => {
            cy.visit('/login');
            cy.getByData("loginUsername").type('test-user');
            cy.getByData("loginPassword").type('test-password');
            cy.getByData("loginButton").should("exist").click();
        });

        it('should mark a task as complete', () => {
            cy.contains('test-lowprio-task').parent().find('[data-cy=completed]').click();
            cy.getByData("taskText").contains('test-lowprio-task')
                .should('have.css', 'text-decoration')
                .and((textDecoration) => {
                    expect(textDecoration).to.include('line-through');
                });
        });

        // it('should keep task marked as complete after refreshing the page', () => {
        //     cy.reload();
        //     cy.getByData("taskText").contains('test-lowprio-task')
        //         .should('have.css', 'text-decoration')
        //         .and((textDecoration) => {
        //             expect(textDecoration).to.include('line-through');
        //         });
        // });
    });

    // Delete a Task
    describe('Delete a Task', () => {
        beforeEach(() => {
            cy.visit('/login');
            cy.getByData("loginUsername").type('test-user');
            cy.getByData("loginPassword").type('test-password');
            cy.getByData("loginButton").should("exist").click();
        });

        it('should delete a task', () => {
            cy.contains('test-lowprio-task').parent().find('[data-cy=deleteButton]').click();
            cy.getByData("taskText").contains('test-lowprio-task').should('not.exist');
        });

        // it('should confirm task deletion after refreshing the page', () => {
        //     cy.reload();
        //     cy.getByData("taskText").contains('test-lowprio-task').should('not.exist');
        // });
    });
});
