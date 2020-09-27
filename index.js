const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const assert = require('assert');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const uri = "mongodb+srv://organicUser:Iifaz123@cluster0.dvdk4.mongodb.net/organicDb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true });


app.get('/' , (req , res) => {
    res.sendFile(__dirname + '/index.html');
})

client.connect(err => {
  const productCollection = client.db("organicDb").collection("products")

  app.get('/products' , (req , res) => [
    productCollection.find({})
    .toArray((err , documents) => {
      res.send(documents);
    })
  ])

  app.get('/product/:id' , (req , res) => {
    productCollection.find({_id : ObjectId(req.params.id)})
    .toArray((err , documents) => {
      res.send(documents[0]);
    })
  })
  
  app.post("/addProduct" , (req , res) => {
    const product = req.body;
    productCollection.insertOne(product)
    .then(result => {
      console.log(product);
      res.redirect('/')
      console.log(err);
    })
  })

  app.patch('update/:id' , (req , res) => {
    productCollection.updateOne({_id : ObjectId(req.params.id)} , 
    {
      $set : {price: req.body.price , quantity: req.body.quantity}
    })
    .then(result => {
      res.send(result.modifiedCount > 0)
    })
  })

  app.delete('/delete/:id' , (req , res) => {
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0);
    })
  })
})

app.listen(3000);