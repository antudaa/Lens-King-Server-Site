const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// Middleware 
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.p4iytrv.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// function verifyJWT(req, res, next){
//     const authHeader = req.headers.authorization;
//     if(!authHeader){
//         return res.status(401).send({message : 'unauthorized access'})
//     }
//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function( err, decoded){
//         if(err){
//             return res.status(401).send({message : 'unauthorized access'})
//         }
//         req.decoded = decoded;
//         next();
//     })
// }


async function run(){
    try{
        const serviceCollections = client.db('lensKing').collection('services');

        // Collection for reviews...
        const reviewCollections = client.db('lensKing').collection('reviews');

        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn : '10h'
            })
            res.send({token})
        })

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

        app.post('/services', async (req, res) => {
            const review = req.body;
            const result = await serviceCollections.insertOne(review);
            res.send(result);
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
        });


        app.get('/reviews', async (req, res) => {
            const query = {};
            const cursor = reviewCollections.find(query);
            const review = await cursor.toArray();
            res.send(review);
        });


        app.get('/reviewsUid', async (req, res) => {

            let query = {};
            if(req.query.user){
                query = {
                    user : req.query.user
                }
            }
            // const query = {};
            const cursor = reviewCollections.find(query);
            const review = await cursor.toArray();
            res.send(review);
        });


        app.get('/reviewsId', async (req, res) => {
            
            let query = {};
            if(req.query.serviceId){
                query = {
                    serviceId : req.query.serviceId
                }
            }
            const cursor = reviewCollections.find(query);
            const review = await cursor.toArray();
            res.send(review);
        });


        app.delete('/reviews/:id' , async (req, res) => {
            const id = req.params.id;
            const query = { _id : ObjectId(id)};
            const result = await reviewCollections.deleteOne(query);
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