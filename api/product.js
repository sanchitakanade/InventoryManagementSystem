/* Author: Sanchita Kanade
   File: products.js
*/

const { getDb, getNextSequence } = require('./db.js');

async function get(_, { id }) {
  const db = getDb();
  const product = await db.collection('inventory').findOne({ id });
  return product;
}

// API to retrieve product
async function list(_, { Category }) {
  const db = getDb();
  const filter = {};
  if (Category) filter.Category = Category;
  const products = await db.collection('inventory').find(filter).toArray();
  return products;
}

// API to add product
async function add(_, { product }) {
  const db = getDb();
  const newProduct = Object.assign({}, product);
  newProduct.id = await getNextSequence('productsConter');
  const result = await db.collection('inventory').insertOne(newProduct);
  const savedProduct = await db.collection('inventory')
    .findOne({ _id: result.insertedId });
  return savedProduct;
}

async function update(_, { id, changes }) {
  const db = getDb();
  console.log(id);
  await db.collection('inventory').updateOne({ id }, { $set: changes });
  const savedIssue = await db.collection('inventory').findOne({ id });
  return savedIssue;
}

async function remove(_, { id }) {
  const db = getDb();
  const product = await db.collection('inventory').findOne({ id });
  if (!product) return false;
  product.deleted = new Date();
  let result = await db.collection('deleted_products').insertOne(product);
  if (result.insertedId) {
    result = await db.collection('inventory').removeOne({ id });
    return result.deletedCount === 1;
  }
  return false;
}

module.exports = {
  add, list, get, update, delete: remove,
};
