const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASSWORD);


// connect mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bhp2qs5.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// connect mongo function
async function run(){
    try{
        const serviceCollection = client.db('foodService').collection('services');
        const reviewCollection = client.db("foodService").collection('reviews');


        // add data to mongo services
        app.post('/services', async(req, res) =>{
            const services = req.body
            console.log(services);
            const result = await serviceCollection.insertOne(services);
            res.send(result)
            
        });


        // get data from mongo services
        app.get('/services', async(req, res) =>{
            const query = {};
            const cursor = serviceCollection.find(query).sort({ _id: -1 });
            const services = await cursor.toArray();
            res.send(services);
            
        });

        // get single service data from mongodb
        app.get('/services/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });


        // review ApI
        // review add to database
        app.post('/reviews', async(req, res) =>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });

        // get review data form database
        app.get('/reviews', async(req, res) =>{
            let query ={};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            else if(req.query.service){
                query ={
                    service: req.query.service
                }
            }
            const cursor = reviewCollection.find(query).sort({_id: -1});
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        // update reviews
        app.get('/reviews/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const review = await reviewCollection.findOne(query);
            res.send(review);
        });
        app.put('/reviews/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const review =req.body;
            const option = {upsert: true}
            const updateReview ={
                $set:{
                    rating: review.rating,
                    message: review.message
                }
            }
            // console.log(review);
            const result = await reviewCollection.updateOne(filter, updateReview, option)
            res.send(result);
        })



        // delete review
        app.delete('/reviews/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally{

    }
}
run().catch(err => console.error(err));


app.get('/', (req, res) =>{
    res.send('Food-Service Server is running')
});

app.listen(port, ()=>{
    console.log(` Food Server Running on ${port}`);
    
})