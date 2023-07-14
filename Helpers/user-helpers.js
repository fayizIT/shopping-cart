const db = require('../config/connection');
const collection = require('../config/collections');
const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
  doSignup: async (userData) => {
    userData.Password = await bcrypt.hash(userData.Password, 10);
    const data = await db.get().collection(collection.USER_COLLECTION).insertOne(userData);
    return data.ops[0];
  },

  doLogin: async (userData) => {
    const user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email });
    if (user) {
      const status = await bcrypt.compare(userData.Password, user.Password);
      if (status) {
        console.log("Login Success");
        return { user: user, status: true };
      } else {
        console.log("Login Failed");
        return { status: false };
      }
    } else {
      console.log("Login Failed");
      return { status: false };
    }
  },

  addToCart: async (proId, userId) => {
    const userCart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: ObjectId(userId) });
    if (userCart) {
      await db.get().collection(collection.CART_COLLECTION).updateOne(
        { user: ObjectId(userId) },
        { $push: { products: ObjectId(proId) } }
      );
    } else {
      const cartObj = { user: ObjectId(userId), products: [ObjectId(proId)] };
      await db.get().collection(collection.CART_COLLECTION).insertOne(cartObj);
    }
  },

getCartProducts: (userId) => {
  return new Promise(async (resolve, reject) => {
    const cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
      {
        $match: { user: ObjectId(userId) }
      },
      {
        $lookup: {
          from: collection.PRODUCT_COLLECTION,
          let: { prodList: '$products' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ['$_id', '$$prodList']
                }
              }
            }
          ],
          as: 'cartItems'
        }
      }
    ]).toArray();
    resolve(cartItems[0].cartItems);
  });
}

};
