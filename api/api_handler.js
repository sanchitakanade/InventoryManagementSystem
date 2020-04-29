/* Author: Sanchita Kanade
   File: api_handler.js
*/


const fs = require('fs');
require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');
const product = require('./product.js');

const resolvers = {
  Query: {
    productList: product.list,
    product: product.get,
  },
  Mutation: {
    addProduct: product.add,
    updateProduct: product.update,
    deleteProduct: product.delete,
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
});

function installHandler(app) {
  const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
  console.log('CORS setting:', enableCors);
  server.applyMiddleware({ app, path: '/graphql' });
}

module.exports = { installHandler };
