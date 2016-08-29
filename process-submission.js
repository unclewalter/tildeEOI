var crypto = require('crypto'),
  fs = require('fs'),
  AWS = require('aws-sdk');

var getFilesizeInBytes = function(filename) {
  var stats = fs.statSync(filename)
  var fileSizeInBytes = stats["size"]
  return fileSizeInBytes
}

var removeEmptyStringElements = function(obj) {
  for (var prop in obj) {
    if (typeof obj[prop] === 'object') {// dive deeper in
      removeEmptyStringElements(obj[prop]);
    } else if(obj[prop] === '') {// delete elements that are empty strings
      delete obj[prop];
    }
  }
  return obj;
}

/*
Function Name: processSubmission

Process:
1. Receives Expression of Interest submission details.
2. Generates hash from email address.
3. Generates PDF file named <hash>-<timestamp>.pdf using the submission details
   - TODO: Possibly move this process into another module.
4. Concatinates CV from submission
5. Pushes the PDF file to S3.
*/

module.exports.processSubmission = function(submissionDetails, context) {
  var hash = crypto.createHash('md5').update(submissionDetails.email).digest("hex");
  var identifier = hash + '_' + submissionDetails.timestamp;
  var filename = identifier + '.pdf';

  if (submissionDetails.cv.fname) {
    var cvFileExt = submissionDetails.cv.fname.split('.').pop();
  }
  var cvfilename = identifier + '-cv.' + cvFileExt;

  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: "tilde-submissions",
    Item: removeEmptyStringElements(submissionDetails)
  };

  params.Item.submissionID = identifier;

  console.log("Adding a new item...");
  docClient.put(params, function(err, data) {
    if (err) {
      context.fail("Unable to add item. Error JSON: "+JSON.stringify(err, null, 2));
    } else {
      console.log("Added item:", JSON.stringify(data, null, 2));
    }
    returnPayload = {
      cvfilename: cvfilename,
      message: err
    }
    context.succeed(returnPayload);
  });
};
