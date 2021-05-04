const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();


 

const app = express();
app.use(bodyParser.json());
app.use(cors());
  

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r1u3u.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
  const productCollection = client.db("ema-john-simple-server").collection("products");
  const orderCollection = client.db("ema-john-simple-server").collection("orders");
   
  app.post('/addProduct', (req, res) => {
      const products = req.body;
    productCollection.insertOne(products)
    .then(result => {
         res.send(result.insertedCount);
    })
  })


  app.get('/getProduct', (req, res) => {
    const search = req.query.search;
    productCollection.find({name: {$regex: search}})
    .toArray( (err, document) => {
        res.send(document);
    })
  })


  app.get('/getSingleProduct/:key', (req, res) => {
    productCollection.find({key: req.params.key})
    .toArray( (err, document) => {
        res.send(document[0]);
    })
  })

  app.post('/productByKeys', (req, res) => {
      const productKeys = req.body;
      productCollection.find({key: { $in: productKeys}})
      .toArray( (err, document) => {
          res.send(document);
      })
  })

  app.post('/addOrder', (req, res) => {
    const orderInfo = req.body;
    orderCollection.insertOne(orderInfo)
  .then(result => {
       res.send(result.insertedCount > 0);
  })
})
   
});








app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || 5000, () => console.log(`this port is running`));