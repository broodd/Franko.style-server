module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.removeConstraint('CartProducts', 'PRIMARY')
			.removeConstraint('CartProducts', 'cartproducts_ibfk_1')
			.removeConstraint('CartProducts', 'cartproducts_ibfk_2');
		// logic for transforming into the new state
	},
	down: (queryInterface, Sequelize) => {
		// logic for reverting the changes
	}
}