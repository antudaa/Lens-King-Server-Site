const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// Middleware 
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.p4iytrv.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollections = client.db('lensKing').collection('services');

        // Collection for reviews...
        const reviewCollections = client.db('lensKing').collection('reviews');

        app.get('/homeServices', async (req, res) => {
            const query = {};
            const cursor = serviceCollections.find(query).limit(3);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollections.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const service = await serviceCollections.findOne(query);
            res.send(service);
        });


        // Review 
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollections.insertOne(review);
            res.send(result);
        })


    }
    finally{

    }
}

run().catch(err => console.log(err.message));




app.get('/', (req, res) => {
    res.send("HI ANTU");
});


app.listen(port, () => {
    console.log(`App running on port ${port}`);
})