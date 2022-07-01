const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2fuz6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        await client.connect();
        const taskCollection = client.db("task-list").collection("task");
        // get task
        app.get('/task', async (req, res) => {
            const email = req.query.email;
            const filter = { email };
            const tasks = await taskCollection.find(filter).toArray();
            res.send(tasks)
        });
        // post task
        app.post('/task', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        });
        // update task
        app.put('/task/:id', async (req, res) => {
            const taskData = req.body;
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const update = {
                $set: taskData
            };
            const result = await taskCollection.updateOne(filter, update, option);
            res.send(result);
        });
        // delete task
        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(filter);
            res.send(result);
        })
    }
    finally {
    }
}
run().catch(console.dir);

app.get('/', async (req, res) => {
    res.send("start")
})

app.listen(port, () => {
    console.log('task server running');
})