const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const app = express();

// Clear the console
console.clear();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Sign in / Sign up validation
app.post('/login', (req, res) => {
	const user_list = require('./users.json');
	const user = user_list.find(user => user.email === req.body.email);

	// Sign in
	if (req.body.type === 'in') {
		res.send(user?.password === req.body.password ? 'ok' : 'Mot de passe incorrect ou compte inexistant');
	}

	// Sign up
	else {
		// If user already exists, send error
		if (user) res.send('Ce compte existe déjà');
		// Else add user to user list
		else {
			user_list.push({ email: req.body.email, password: req.body.password });
			fs.writeFileSync('./users.json', JSON.stringify(user_list));
			res.send('ok');
		}
	}
});

// File upload
app.post('/upload', (req, res) => {
	const user_list = require('./users.json');
	const user = user_list.find(user => user.email === req.body.email);

	// Return error if user doesn't exist
	if (!user) res.send('Compte inexistant');

	// User folder
	const user_folder = `./userfiles/${req.body.email}`;

	// If user has a file, delete it
	if (user.file) fs.unlinkSync(`${user_folder}/${user.file}`);
	// Else create user folder
	else fs.mkdirSync(user_folder);

	// Get uploaded file
	const file = req.files.file;

	// Save file
	fs.writeFileSync(`${user_folder}/${file.name}`, file.data);

	// Add file name to user
	user.file = file.name;

	// Save user list
	fs.writeFileSync('./users.json', JSON.stringify(user_list));

	res.send('ok');
});

// File download
app.get('/download/:email', (req, res) => {
	const user_list = require('./users.json');
	const user = user_list.find(user => user.email === req.params.email);

	// Return error if user doesn't exist or doesn't have a file
	if (!user?.file) res.send('Compte inexistant ou coffre fort vide');

	// Send file
	res.sendFile(`./userfiles/${req.params.email}/${user.file}`, { root: __dirname });
});

// Routage global
app.use(express.static(__dirname + '/public'));

// Page 404
app.get('*', (req, res) => res.status(404).send('404'));

// Run server
app.listen(80, () => console.log('Server is running on port 80'));
