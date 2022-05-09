const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3eo0v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('booksWorld').collection('books');

        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/hero', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        //myitems
        app.get('/myitems', async (req, res) => {
            const email = req.query.email
            // console.log(email);
            const query = { email: email };
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });



        // POST
        app.post('/inventory', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        });

        // DELETE
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        });


        //Quantity update
        app.put("/inventory/:id", async (req, res) => {
            const id = req.params.id;
            const deliveredQuantity = req.body;
            console.log(deliveredQuantity);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    quantity: deliveredQuantity.newQuantity,
                }
            };

            const result = await serviceCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        app.put("/inventory/:id", async (req, res) => {
            const id = req.params.id;
            const setQuantity = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    quantity: setQuantity.newQuantity,
                }
            };

            const result = await serviceCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });


    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Books Server');
});

app.listen(port, () => {
    console.log('Listening to port', port);
})