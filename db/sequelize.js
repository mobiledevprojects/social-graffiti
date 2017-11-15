'use strict';
// Exports a singleton, connected, synced Sequelize instance using sqlite

const path = require('path');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite')
});

const db = {
	sequelize: sequelize
}

db.User = sequelize.import(path.join(__dirname, 'user.js'));

db.Content = sequelize.import(path.join(__dirname, 'content.js'));
db.Content.belongsTo(db.User, { as: 'owner' })

db.Anchor = sequelize.import(path.join(__dirname, 'anchor.js'));
db.Anchor.belongsTo(db.User, { as: 'owner' })

db.AnchoredContent = sequelize.import(path.join(__dirname, 'anchoredContent.js'));
db.AnchoredContent.belongsTo(db.Anchor)
db.AnchoredContent.belongsTo(db.Content)

db.User.sync().then(() => {
	db.Content.sync().then(() => {
		db.Anchor.sync().then(() => {
			db.AnchoredContent.sync().then(() => {
				//createTestData()
			})
		})
	})
})

module.exports = { db };

function createTestData(){
	const user1 = db.User.build({ email: 'foo@example.com' })
	user1.save().then(user => {
		const anchor1 = db.Anchor.build({
			latitude: 123,
			longitude: 321,
			altitude: 111,
			positionAccuracy: 100,
			altitudeAccuracy: 200,
			orientation: [0,0,0,1]
		})
		anchor1.save().then(anchor => {
			anchor.setOwner(user)
		})
	})
}