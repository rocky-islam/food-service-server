const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require("mongodb");
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
        // add data to mongo services
        app.post('/services', async(req, res) =>{
            const services = req.body
            console.log(services);
            const result = await serviceCollection.insertOne(services);
            res.send(result)
            
        })


        // get data from mong services
        app.get('/services', async(req, res) =>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
            
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