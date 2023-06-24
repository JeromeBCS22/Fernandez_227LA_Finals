const express = require('express');

const app = express();
const port = 4000;

app.use(express.json());

const date = new Date().toJSON().slice(0, 10);

let users = [
	{
		email: "VanDerLinde@eyefind.com",
		username: "DutchVDL",
		password: "Tahiti",
		isAdmin: false
	},
	{
		email: "CCassidy@blizzard.com",
		username: "BAMF",
		password: "Blackwatch",
		isAdmin: false
	},
	{
		email: "Callahan1899@eyefind.com",
		username: "L_Cornwall",
		password: "Arthur",
		isAdmin: false
	}
];

let products = [
	{
		name: "Cattleman revolver",
		description: "Six shots, more than enough to kill anything that moves.",
		price: 500,
		isActive: true,
		createdOn: `${date}`
	},
	{
		name: "Double-barreled shotgun",
		description: "Ol' reliable",
		price: 800,
		isActive: true,
		createdOn: `${date}`
	},
	{
		name: "Leather boots",
		description: "Stylish and rugged.",
		price: 300,
		isActive: true,
		createdOn: `${date}`
	},
	{
		name: "Bowie knife",
		description: "For hunting, crafting, cutting, stabbing.",
		price: 200,
		isActive: true,
		createdOn: `${date}`
	}
];

let orders = [
	{
		userId: 1,
		product: products[0],
		totalAmount: 4,
		purchasedOn: `${date}` 
	},
	{
		userId: 2,
		product: products[1],
		totalAmount: 3,
		purchasedOn: `${date}`
	},
	{
		userId: 3,
		product: products[2],
		totalAmount: 10,
		purchasedOn: `${date}`
	},
	{
		userId: 4,
		product: products[3],
		totalAmount: 6,
		purchasedOn: `${date}`
	}

];

let loggedUser;

// Shows all users
app.get('/users', (req, res) => {
	res.send(users)
});

// Creates new user/user registration
app.post('/users', (req, res) =>{
	
	console.log(req.body);

	let newUser = {
		email: req.body.email,
		username: req.body.username,
		password: req.body.password,
		isAdmin: req.body.isAdmin
	};
	users.push(newUser);
	console.log(users);

	res.send('Registered Successfully.')
});

// Authenticates/verifies user
app.post('/users/login', (req, res) => {

	console.log(req.body);

	let foundUser = users.find((user) => {
		return user.username === req.body.username && user.password === req.body.password;
	});

	if(foundUser !== undefined){
		let foundUserIndex = users.findIndex((user) => {
			return user.username === foundUser.username
		});
		foundUser.index = foundUserIndex;

		loggedUser = foundUser;
		console.log(loggedUser);
		res.send('Thank you for logging in.')
	} else {
		loggedUser = foundUser;
		res.send('Login failed. Wrong credentials')
	}
});

// Sets user as admin
app.put('/users/admin_promotion/:index', (req,res) => {
	console.log(req.params);
	console.log(req.params.index);
	let userIndex = parseInt(req.params.index);
	if(loggedUser.isAdmin === true){
		users[userIndex].isAdmin = true;
		res.send(`User ${users[userIndex].username} is now an admin.`)
	} else {
		res.status(401).send('401 - Unauthorized');
	}
});

// Creates new products
app.post('/products', (req, res) => {
	console.log(loggedUser);
	console.log(req.body);

	if(loggedUser.isAdmin === true){
		if(!Array.isArray(req.body)){
		let newProduct = {
			name: req.body.name,
			description: req.body.description,
			price: req.body.price,
			isActive: req.body.isActive,
			createdOn: `${date}`
		}
		products.push(newProduct);
		console.log(products);
		res.send('You have added a new product.');
	} else if(Array.isArray(req.body)){
		let newProducts = req.body.map((products) => {
			return {
			name: products.name,
			description: products.description,
			price: products.price,
			isActive: products.isActive,
			createdOn: `${date}`
			}
		})
		products.push(...newProducts);
		console.log(products);
		res.send('You have added new products');
	} else {
		res.status(401).send('401 - Unauthorized');
	}
	}
});

// Shows all products
app.get('/products', (req,res) => {
	console.log(loggedUser);

	res.send(products);
});

// Shows only active products
app.get('/products/active', (req,res) => {
	console.log(loggedUser);
	let active = products.filter((products) => products.isActive === true);

		res.send(active);
		res.status(401).send('401 - Unauthorized');

});

// Shows a product based on its index
app.get('/products/:productId', (req, res) => {
	console.log(req.params);
	console.log(req.params.productId);
	let index = parseInt(req.params.productId);
	let product = products[index];
	res.send(product);
});

// Updates product information
app.put('/products/update/:productId', (req,res) => {
	console.log(req.params);
	console.log(req.params.productId);
	let productIndex = parseInt(req.params.productId);
	if(loggedUser.isAdmin === true){
		products[productIndex].name = req.body.name;
		products[productIndex].description = req.body.description;
		products[productIndex].price = req.body.price;
		products[productIndex].isActive = req.body.isActive;
		console.log(products[productIndex]);
		res.send('Item updated.')
	} else {
		res.status(401).send('401 - Unauthorized');
	}
});

// Archiving a product based on index
app.put('/products/archive/:productId', (req,res) => {
	console.log(req.params);
	console.log(req.params.productId);
	let productIndex = parseInt(req.params.productId);
	if(loggedUser.isAdmin === true){
		products[productIndex].isActive = false;
		console.log(products[productIndex]);
		res.send('Item archived.')
	} else {
		res.status(401).send('401 - Unauthorized');
	}
});

// Shows all orders
app.get('/users/orders', (req,res) => {
	console.log(loggedUser);

	if(loggedUser.isAdmin === true){
		res.send(orders);
	} else {
		res.status(401).send('401 - Unauthorized');
	}
});

// Creates new order
app.post('/users/orders', (req,res) => {
	
	console.log(req.body);

	let newOrder = {
		userId: req.body.userId,
		product: req.body.product,
		totalAmount: req.body.totalAmount,
		purchasedOn: `${date}`
	};

	orders.push(newOrder);
	console.log(orders);

	res.send('Added to cart')
});

// Deletes an order based on index
app.delete('/orders/delete/:index', (req,res) =>{
	let orderIndex = parseInt(req.params.index);
	delete orders[orderIndex];
	res.send(`Order has been deleted`)
});

app.listen(port, () => console.log(`Server is running at port ${port}`));
