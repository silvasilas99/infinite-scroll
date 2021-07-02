require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const Games = require('./models/Games');
const data = require('./data');

mongoose.connect(
	process.env.MONGO_URL,
	{
		useNewUrlParser: true,
	    useUnifiedTopology: true,
	}
);

const Connection = mongoose.connection;

Connection.once('open', async() => {
  	console.log("Connected to MongoDB");
  	const gamesExist = await Games.find({});
  	if (gamesExist.length) return;

  	Games.insertMany(data).then(res => {
    	console.log("Sucessfully inserted data");
  	}).catch(err => console.log(err));
});

Connection.on('error', err => {
  	console.error('connection error:', err.message);
});

app.use(express.json());
app.use(cors());

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});

app.get('/game', async(req, res) => {
  	const count =+ req.query.count;
  	const page =+ req.query.page;
  	try {
    	const response = await Games.find().skip(count * (page - 1)).limit(count)
    	res.status(200).json({games: response})
  	} catch(err){
    	console.log(err)
  	}
});