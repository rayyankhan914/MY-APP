const fs = require('fs')
const path = require('path')

const file = path.join(__dirname, 'users.json')
let users = []
try {
	if (fs.existsSync(file)) {
		users = JSON.parse(fs.readFileSync(file, 'utf8') || '[]')
	}
} catch (err) {
	console.error('Failed to load users.json', err.message)
	users = []
}

function saveUsers() {
	try {
		fs.writeFileSync(file, JSON.stringify(users, null, 2))
	} catch (err) {
		console.error('Failed to save users.json', err.message)
	}
}

module.exports = { users, saveUsers }
