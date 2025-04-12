const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MONGODB Connected"))
    .catch((err) => console.log('MONGODB Connection failed', err));

const routesRouter = require('./routes/routes');
const busesRouter = require('./routes/buses');
const schedulesRouter = require('./routes/schedules');
const notificationsRoutes = require('./routes/notifications');
const adminUsersRouter = require('./routes/adminUsers');
const authRouter = require('./routes/auth');


app.use('/api/routes', routesRouter);
app.use('/api/buses', busesRouter);
app.use('/api/schedules', schedulesRouter);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/admin/users', adminUsersRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
    res.send("Bus tracker backend running ");
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server Running on Port ${PORT}`);
    }
});
