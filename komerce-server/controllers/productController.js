const multer = require('multer');
const Product = require('./../models/productModel');
const path = require('path');
const catchAsync = require('./../utils/catchAsync');
const isAuth = require('../middleware/is-auth');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {

//   },
// })

// const upload = multer({dest: 'public/images/products'});

// exports.uploadProductPhoto = upload.single('photo');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, './../komerce-react/public/images/product')
  },
  filename: (req, file, cb) => {
    console.log(file)
    cb(null, `${new Date().getDate()}-${file.originalname}`)
    // const ext = file.mimetype.split('/')[1];
    // cb(null, `files/admin-${file.fieldname}-${Date.now()}.${ext}`)
  }
})

const upload = multer({storage: multerStorage})

exports.uploadProductPhoto = upload.single('file'), async(req, res) => {
  console.log("entered")
  const { filename: file } = req.file;
       
       await sharp(req.file.path)
        .resize(200, 200)
        .jpeg({ quality: 90 })
        .toFile(
            path.resolve(req.file.destination,'resized',file)
        )
        fs.unlinkSync(req.file.path)
};

exports.getAllProducts = catchAsync(async(req, res, next) => {
  console.log("allproduct",req.session, req.session)
    const products = await Product.find();

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: products.length,
      data: {
        products
      }
    });
});

exports.getProduct = catchAsync(async(req, res, next) => {
  console.log("product",req.session, req.session)
  const product = await Product.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data:{
      product
    }
  })
});


exports.createProduct = catchAsync(async(req, res, next) => {
  console.log("entered")
  // console.log(req.session.user)
  // console.log(req.file)
  const newProduct = await Product.create({
      product_name: req.body.product_name,
      sku: req.body.sku,
      price: req.body.price,
      description: req.body.description,
      image: req.body.image,
      inventory: req.body.inventory,
      product_status: req.body.product_status
  }).catch(err => {
    if (err.name === 'ValidationError'){
      error = Object.values(err.errors).map(val => val.message)
      console.log(error)
      res.status(400).json({
        status: error,
      })
    }
    if (err.name === 'MongoError'){
      res.status(400).json({
        status: 'This SKU is already Exists!',
      })
    }
  });

  if(newProduct){
    res.status(201).json({
      status: 'success',
      data: {
        product: newProduct
      }
    })
  }
});

exports.updateProduct = catchAsync(async(req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body,{
    new: true,
    runValidators: true
  }).catch(err => {
    if (err.name === 'ValidationError'){
      error = Object.values(err.errors).map(val => val.message)
      console.log(error)
      res.status(400).json({
        status: error,
      })
    }
    if (err.name === 'MongoError'){
      res.status(400).json({
        status: 'This SKU is already Exists!',
      })
    }
  });


  if(!product){
    res.status(404).json({
      status: 'Fail'
    })
  }

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  })
});