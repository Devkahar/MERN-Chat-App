const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.nd6mr.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,})
.then(res => console.log('db connected'))
.catch(err => console.log(err));