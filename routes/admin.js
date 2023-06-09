var express = require('express');

var router = express.Router();
var productHelper=require('../Helpers/product-Helpers');
const productHelpers = require('../Helpers/product-Helpers');

/* GET users listing. */
router.get('/', function(req, res, next) {

  productHelpers.getAllproducts().then((products)=>{
    console.log(products);
    res.render('admin/view-products',{admin:true,products})
  })
 
});
router.get('/add-product',function(req,res){
  res.render('admin/add-product')
})
router.post('/add-product',(req,res)=>{
  
  productHelpers.addProduct(req.body,(id)=>{
    let Image = req.files.Image
    console.log(id);
    Image.mv('./public/product-images/'+id +'.jpg',(err,done)=>{
      if(!err){
        res.render('admin/add-product')
      }else{
        console.log(err);
      }
    })
    
  })
})
router.get('/delete-product/:id', (req, res) => {
  let proId = req.params.id;
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response) => {
    res.redirect('/admin/');
  });
});

router.get('/edit-product/:id',async(req,res)=>{
  let product=await productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-product',{product})
})
router.post('/edit-product/:id', (req, res) => {
  console.log(req.params.id);
  let id = req.params.id;
  productHelpers.updateProduct(req.params.id, req.body).then(() => {
    if (req.files && req.files.Image) { // Check if req.files and req.files.Image exist
      let image = req.files.image;
      image.mv('./public/product-images/' + id + '.jpg', (err, done) => {
        if (!err) {
          res.redirect('/admin');
        } else {
          console.log(err);
        }
      });
    } else {
      res.redirect('/admin');
    }
  });
});

module.exports = router;
