const express = require('express');
const router = express.Router();

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  id: { type: String, required: true },
  description: {type: String, required: true},
  anArray: { type: Array, required: false },
  anObject: { type: Object, required: false }
})

const Product = mongoose.model('product', productSchema) 

router.get('/addProduct', (req, res, next) => {
  new Product({ id: id, name: 'widget', price: 3.95, size: 'large' })
    .save()
    .then(result => {
      console.log('saved product to database')
      res.redirect('/')
    })
    .catch(err => {
      console.log('failed to addAproduct: ' + err)
      res.redirect('/')
    })
})

router.post('/addProduct', (req, res, next) => {
  const {id, name, price, description} = req.body
  new Product({ id: id, name: name, price: price, description: description, size: 'large' })
    .save()
    .then(result => {
      console.log('saved product to database')
      res.json({ success: true })
    })
    .catch(err => {
      console.log('failed to addAproduct: ' + err)
      res.json({ success: false, theError: err })
    })
})

router.get('/', (req, res, next) => {
  console.log(req.query)
  Product.find() 
    .then(products => {
      res.send(JSON.stringify(products))
    })
    .catch(err => {
      console.log('Failed to find: ' + err)
      res.send(JSON.stringify(err))
    })
})

router.post('/', (req, res, next) => {
  console.log(req.body)
  Product.find() 
    .then(products => {
      res.json({ success: true, Products: products })
    })
    .catch(err => {
      console.log('Failed to find: ' + err)
      res.json({ success: false, theError: err })
    })
})

router.get('/getSpecificProduct', (req, res, next) => {
  Product.find({ id: req.query.id }) 
    .then(products => {
      res.send(JSON.stringify(products[0]))
    })
    .catch(err => {
      console.log('Failed to find product: ' + err)
      res.send(JSON.stringify(err))
    })
})

router.post('/getSpecificProduct', (req, res, next) => {
  Product.find({ id: req.body.id }) 
    .then(products => {
      res.json({ success: true, theProduct: products[0] })
    })
    .catch(err => {
      console.log('Failed to find product: ' + err)
      res.json({ success: false, theError: err })
    })
})

// router.get('/updateSpecificProduct', (req, res, next) => {
//   Product.find({ ourId: '1' }) 
//     .then(products => {
//       let specificProduct = products[0] 
//       specificProduct.price = 199.95
//       specificProduct.save() 
//       res.json({ productName: specificProduct.name, productPrice: specificProduct.price  })
//     })
//     .catch(err => {
//       console.log('Failed to find product: ' + err)
//       res.json({ failure: true })
//     })
// })

// router.post('/updateSpecificProduct', (req, res, next) => {
//   const {id, name, price} = req.body
//   console.log('ID', id, 'Price', price, 'Name', name)
//   Product.find({ id: id }) 
//     .then(products => {
//       let specificProduct = products[0] // pick the first match
//       console.log(products)
//       specificProduct.price = price;
//       specificProduct.name = name;
//       specificProduct.save()
//       console.log('Product', specificProduct)
//       res.json({ success: true, product: specificProduct });
//     })
//     .catch(err => {
//       console.log('Failed to find product: ' + err)
//       res.send('No product found')
//     })
// })

router.get('/deleteSpecificProduct', (req, res, next) => {
  Product.findOneAndRemove({ id: req.body.id })
    .then(resp => {
      res.redirect('/')
    })
    .catch(err => {
      console.log('Failed to find product: ' + err)
      res.send('No product found')
    })
})

router.post('/deleteSpecificProduct', (req, res, next) => {
  const {id} = req.body
  Product.findOneAndRemove({ id: id })
    .then(resp => {
      res.json({ success: true});
    })
    .catch(err => {
      console.log('Failed to find product: ' + err)
      res.send('No product found')
    })
})

exports.routes = router
