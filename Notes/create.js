'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.noteTitle !== 'string' || typeof data.noteText !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t create the note item.'));
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      noteTitle: data.noteTitle,
      noteText: data.noteText,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  // write the note to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t create the note item.'));
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};