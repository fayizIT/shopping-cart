var db = require('../config/connection');
var collection=require('../config/collections')
const fs = require('fs');
const { resolve } = require('path');
const { response } = require('express');
var ObjectId = require('mongodb').ObjectId;


module.exports = {

  addProduct: (product, callback) => {
    
    db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data) => {
        console.log(data);
      callback(data.ops[0]._id);
    });
  },

  getAllproducts:()=>{
    return new Promise(async(resolve,reject)=>{
        let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
    resolve(products)
    })
  },
  deleteProduct:(prodId)=>{
    return new Promise ((resolve,reject)=>{
      console.log(prodId);
      console.log(ObjectId(prodId));
      db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:ObjectId(prodId)}).then((response)=>{
        console.log(response);
        resolve(response)
      })
    })
  },
  getProductDetails:(proId)=>{
    return new Promise((resolve,reject)=>{      db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectId(proId)}).then((product)=>{
        resolve(product)
      })
    })
  },
  updateProduct:(proId,proDetails)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.PRODUCT_COLLECTION)
      .updateOne({_id:ObjectId(proId)},{
        $set:{
          name:proDetails.name,
          description:proDetails.description,
          price:proDetails.price,
          category:proDetails.category
        }
      }).then((response)=>{
        resolve()
      })
    })
  }
}
