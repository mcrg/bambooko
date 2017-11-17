'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  // validation
  if (typeof data.noteTitle !== 'string' || typeof data.noteText !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t update the note item.'));
    return;
  }
  
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeValues: {
      ':noteTitle': data.noteTitle,
      ':noteText': data.noteText,
      ':checked': data.checked,
      ':updatedAt': timestamp,
    },
    UpdateExpression: 'SET noteTitle = :noteTitle, noteText = :noteText, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  // update the note in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t update the note item.'));
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};