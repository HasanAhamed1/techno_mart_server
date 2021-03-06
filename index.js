const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// //use midleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2uexv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        await client.connect();
        const itemsCollection = client.db('techno').collection('item');
       
        app.get('/item', async(req, res) => {
            const query = {};
            const cursor = itemsCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });
 
        app.get('/item/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const item = await itemsCollection.findOne(query);
            res.send(item);
        })

        //post
        app.post('/item', async(req, res) => {
            const newItem = req.body;
            const result = await itemsCollection.insertOne(newItem);
            res.send(result);
        });

        //Delete
        app.delete('/item/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await itemsCollection.deleteOne(query);
            res.send(result);
        });

        
    }
    finally{

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running Techno Server');
});

app.listen(port, () =>{
    console.log('CRUD Server is running');
});