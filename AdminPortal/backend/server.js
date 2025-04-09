const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = process.env.ATLAS_URI; // Make sure this is in your .env file

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Database Connected'))
    .catch(err => console.log('MongoDB connection Failed', err));

const routesRouter = require('./routes/routes');//check
const busesRouter = require('./routes/buses');
const schedulesRouter = require('./routes/schedules');
const notificationsRouter = require('./routes/notifications');
const adminUsersRouter = require('./routes/adminUsers');



app.use('/api/routes', routesRouter);//check
app.use('/api/buses', busesRouter);
app.use('/api/schedules', schedulesRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/admin/users', adminUsersRouter);


app.get('/', (req, res) => {
    res.send('Bus Tracker Admin Backend is running!');
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
