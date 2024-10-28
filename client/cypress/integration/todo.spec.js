describe('To-Do List', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000'); // React app
    });

    it('should add a new todo item', () => {
        const newTodo = 'Learn Cypress';
        cy.get('input[type="text"]').type(newTodo);
        cy.get('button').contains('Add').click();
        cy.contains(newTodo).should('be.visible');
    });

    it('should display existing todos', () => {
        cy.contains('Sample Todo').should('be.visible'); // Replace with actual sample todos from DB
    });
});
