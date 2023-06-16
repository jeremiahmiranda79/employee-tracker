const express = require('express');
const apiRoutes = require('./routes/apiRoutes');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use api routes
app.use('/api', apiRoutes);

// Default response
app.use('*', (request, response) => {
    response.send('<h1>Application in construction. Come back soon!</h1>');
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});