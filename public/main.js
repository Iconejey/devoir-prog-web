// Sections
const login_section = document.querySelector('section#login');
const file_section = document.querySelector('section#file');

async function sign(type) {
	// Get form
	const login_form = login_section.querySelector('form');

	// Check if form is valid
	if (!login_form.checkValidity()) return alert('Veuillez remplir tous les champs');

	// Get form data
	const form_data = new FormData(login_form);

	// Add login type to form data
	form_data.append('type', type);

	console.log(form_data.get('email'), form_data.get('password'));

	// Fetch response
	const res = await fetch('/login', { method: 'POST', body: form_data });

	const message = await res.text();

	// Success
	if (message === 'ok') {
		// Show file section
		document.body.classList.add('logged');

		// Set file href
		file_section.querySelector('a').href = `/download/${form_data.get('email')}`;
	}

	// Error
	else alert(message);
}

// Sign in validation
login_section.querySelector('#sign-in').onclick = e => sign('in');

// Sign up validation
login_section.querySelector('#sign-up').onclick = e => sign('up');

// Upload file
file_section.querySelector('input').onchange = async e => {
	document.body.classList.add('upload');

	const file_form = file_section.querySelector('form');

	// Get form data
	const form_data = new FormData(file_form);

	// Add user email to form data
	form_data.append('email', login_section.querySelector('input').value);

	// Send file
	await fetch('/upload', { method: 'POST', body: form_data });

	document.body.classList.remove('upload');
};
