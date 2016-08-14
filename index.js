// Loading Dependencies
var aws = require('aws-sdk'),
    crypto = require('crypto'),
    fs = require('fs'),
    pdf = require('pdfkit');

// Loading in the secret stuff
aws.config.loadFromPath('./aws-config.json');

// Amazon services
var s3 = new aws.S3({});
var ses = new aws.SES({});

/*
Function Name: processSubmission

Process:
1. Receives Expression of Interest submission details.
2. Generates hash from email address.
3. Generates PDF file named <hash>-<timestamp>.pdf using the submission details
4. Concatinates CV from submission
5. Pushes the PDF file to S3.
*/
var processSubmission = function(submissionDetails, context) {
  var hash = crypto.createHash('md5').update(submissionDetails.email).digest("hex");
  var filename = './tmp/' + hash + '_' + submissionDetails.timestamp + '.pdf';

  var myDoc = new pdf;

  myDoc.pipe(fs.createWriteStream(filename));
  myDoc.font('Times-Roman')
      .fontSize(50)
      .text('PDF Test', 100, 100);
  myDoc.end();


  // Stream contents to a file
  // TODO: Fix issue with blank stream. End event is not firing. Generated file is blank.

}

/*
Function Name: confirmEmail

Process:
1. Takes submission details
2. Formats a summary of them as an email.
3. Sends confirmation email to artist
4. Sends notification message to Slack #Submissions channel

*/

var confirmEmail = function(submissionDetails, context) {
  // TODO: All of this. Duh.
}

/*
Function: exports.handler

Process:
1. Takes API request from Amazon API Gateway service.
2. Generates a timestamp for the submission
3. Checks if emails match
4. Creates an object from the request with all the details.
5. Forwards submission details to processSubmission and confirmEmail functions
*/

exports.handler = function(event, context) {
  datetime = new Date();
  timestamp = datetime.getTime(); // Generate timestamp for server time

  // console.log("Incoming: ", event);

  console.log("email address =", event.email);
  console.log("time stamp =", datetime.getTime());

  if (!event.email) {
    context.fail("No email address provided");
  } else if (event.email != event.confirm_email) {
    context.fail("Email address and confirmation do not match!");
  }
  /*
  TODO: Add proper email validation
        Add responses for user feedback
  */

  var submissionDetails = {
    "timestamp":              timestamp,
    "name":                   event.name,
    "email":                  event.email,
    "confirm_email":          event.confirm_email,
    "phone":                  event.phone,
    "discipline":             event.discipline,
    "bio":                    event.bio,
    "cv":                     event.cv,
    "project_title":          event.project_title,
    "short_description":      event.short_description,
    "long_description":       event.long_description,
    "technical_requirements": event.technical_requirements,
    "instrumentation":        event.instrumentation,
    "funding":                event.funding,
    "focus_areas":            event.focus_areas,
    "comments":               event.comments
  };

  processSubmission(submissionDetails, context);
  confirmEmail(submissionDetails, context);
};
