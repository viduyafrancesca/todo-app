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
            // Click on the register link
            cy.get('[data-cy=registrationForm]').click();

            // Assert that the URL is now /register
            cy.url().should('include', '/register');

            // Check if the registration form loads
            cy.get('[data-cy=registrationWindow]').should('be.visible');
        });

        it('should navigate to login page when Login link is clicked', () => {
            // Click on the login link
            cy.get('[data-cy=loginForm]').click();

            // Assert that the URL is now /login
            cy.url().should('include', '/login');

            // Check if the login form loads
            cy.get('[data-cy=loginWindow]').should('be.visible');
        });
    });

    // User Registration Flow
    describe('User Registration Flow', () => {
        it('should register a new user successfully', () => {
            cy.visit('/register');
            cy.get('[data-cy=registerUsername]').type('test-user');
            cy.get('[data-cy=registerPassword]').type('test-password');
            cy.get('[data-cy=registerButton]').click();
            cy.contains('Registration successful! You can now log in.').should('be.visible');
        });

        it('should show error when username is blank', () => {
            cy.visit('/register');
            cy.get('[data-cy=registerPassword]').type('test-password');
            cy.get('[data-cy=registerButton]').click();
            cy.get('[data-cy=registerUsername]')
                .then(($input) => {
                    expect($input[0].validationMessage).to.eq('Please fill out this field.');
                });
        });

        it('should show error when password is blank', () => {
            cy.visit('/register');
            cy.get('[data-cy=registerUsername]').type('test-user');
            cy.get('[data-cy=registerButton]').click();
            cy.get('[data-cy=registerPassword')
                .then(($input) => {
                    expect($input[0].validationMessage).to.eq('Please fill out this field.');
                });
        });

        it('should show error when registering with an existing username', () => {
            cy.visit('/register');
            cy.get('[data-cy=registerUsername]').type('test-user');
            cy.get('[data-cy=registerPassword]').type('test-password');
            cy.get('[data-cy=registerButton]').click();
            cy.contains('User already exists!').should('be.visible');
        });
    });

    // Login Flow
    describe('Login Flow', () => {
        it('should show error with incorrect password', () => {
            cy.visit('/login');
            cy.get('[data-cy=loginUsername]').type('test-user');
            cy.get('[data-cy=loginPassword]').type('wrong-password');
            cy.get('[data-cy=loginButton]').click();
            cy.contains('Invalid credentials').should('be.visible');
        });

        it('should show error with incorrect username', () => {
            cy.visit('/login');
            cy.get('[data-cy=loginUsername]').type('wrong-username');
            cy.get('[data-cy=loginPassword]').type('test-password');
            cy.get('[data-cy=loginButton]').click();
            cy.contains('Invalid credentials').should('be.visible');
        });

        it('should show error when username is blank', () => {
            cy.visit('/login');
            cy.get('[data-cy=loginPassword]').type('test-password');
            cy.get('[data-cy=loginButton]').click();
            cy.get('[data-cy=loginUsername]')
                .then(($input) => {
                    expect($input[0].validationMessage).to.eq('Please fill out this field.');
                });
        });

        it('should show error when password is blank', () => {
            cy.visit('/login');
            cy.get('[data-cy=loginUsername]').type('test-user');
            cy.get('[data-cy=loginButton]').click();
            cy.get('[data-cy=loginPassword]')
                .then(($input) => {
                    expect($input[0].validationMessage).to.eq('Please fill out this field.');
                });
        });

        it('should login successfully with valid credentials', () => {
            cy.visit('/login');
            cy.get('[data-cy=loginUsername]').type('test-user');
            cy.get('[data-cy=loginPassword]').type('test-password');
            cy.get('[data-cy=loginButton]').click();
            cy.url().should('include', '/todos'); // Assumes redirection to the todos page
        });
    });

    // Display Tasks by User
    describe('Display Tasks by User', () => {
        beforeEach(() => {
            // Login before checking tasks
            cy.visit('/login');
            cy.get('[data-cy=loginUsername]').type('test-user');
            cy.get('[data-cy=loginPassword]').type('test-password');
            cy.get('[data-cy=loginButton]').click();
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
            cy.get('[data-cy=loginUsername]').type('test-user');
            cy.get('[data-cy=loginPassword]').type('test-password');
            cy.get('[data-cy=loginButton]').click();
        });

        it('should add a task with Low Priority', () => {
            cy.get('[data-cy=taskInput]').type('test-lowprio-task');
            cy.get('[data-cy=addTaskButton]').click();
            cy.contains('test-lowprio-task').should('be.visible');
            cy.contains('Low Priority').should('be.visible');
        });

        it('should add a task with Medium Priority', () => {
            cy.get('[data-cy=taskInput]').type('test-medprio-task');
            cy.get('[data-cy=priority]').select('Medium Priority');
            cy.get('[data-cy=addTaskButton]').click();
            cy.contains('test-medprio-task').should('be.visible');
            cy.contains('Medium Priority').should('be.visible');
        });

        it('should add a task with High Priority', () => {
            cy.get('[data-cy=taskInput]').type('test-hiprio-task');
            cy.get('[data-cy=priority]').select('High Priority');
            cy.get('[data-cy=addTaskButton]').click();
            cy.contains('test-hiprio-task').should('be.visible');
            cy.contains('High Priority').should('be.visible');
        });
    });

    // Mark Task as Complete
    describe('Mark Task as Complete', () => {
        beforeEach(() => {
            cy.visit('/login');
            cy.get('[data-cy=loginUsername]').type('test-user');
            cy.get('[data-cy=loginPassword]').type('test-password');
            cy.get('[data-cy=loginButton]').click();
        });

        it('should mark a task as complete', () => {
            cy.contains('test-lowprio-task').parent().find('[data-cy=completed]').click();
            cy.get('[data-cy=taskText]').contains('test-lowprio-task')
                .should('have.css', 'text-decoration')
                .and((textDecoration) => {
                    expect(textDecoration).to.include('line-through');
                });
        });

        // it('should keep task marked as complete after refreshing the page', () => {
        //     cy.reload();
        //     cy.get('[data-cy=taskText]').contains('test-lowprio-task')
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
            cy.get('[data-cy=loginUsername]').type('test-user');
            cy.get('[data-cy=loginPassword]').type('test-password');
            cy.get('[data-cy=loginButton]').click();
        });

        it('should delete a task', () => {
            cy.contains('test-lowprio-task').parent().find('[data-cy=deleteButton]').click();
            cy.get('[data-cy=taskText]').contains('test-lowprio-task').should('not.exist');
        });

        // it('should confirm task deletion after refreshing the page', () => {
        //     cy.reload();
        //     cy.get('[data-cy=taskText]').contains('test-lowprio-task').should('not.exist');
        // });
    });
});
