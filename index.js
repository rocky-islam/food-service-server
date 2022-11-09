const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

// connect mongodb
// username: foodServiceDB
// password: HnC7LWGWGMi2x7uv
const uri =
  "mongodb+srv://<username>:<password>@cluster0.bhp2qs5.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});


app.get('/', (req, res) =>{
    res.send('Food-Service Server is running')
});

app.listen(port, ()=>{
    console.log(` Food Server Running on ${port}`);
    
})