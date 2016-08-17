// Loading Dependencies
var proc   = require('./process-submission'),
    email  = require('./confirmation-email'),
    aws    = require('aws-sdk');

// Loading in the secret stuff
aws.config.loadFromPath('./aws-config.json');

// var ses = new aws.SES({});

/*
Function: exports.handler

Process:
1. Takes API request from Amazon API Gateway service.
2. Generates a timestamp for the submission
3. Checks if emails match
4. Creates an object from the request with all the details.
5. Forwards submission details to processSubmission and confirmEmail functions
*/

module.exports.eoi = function(evt, context) {
  event = evt.body; // Temporary fix...
  datetime  = new Date();
  timestamp = datetime.getTime(); // Generate timestamp for server time

  console.log("Incoming: ", event);

  console.log("email address =", event.email);
  console.log("time stamp =", timestamp);

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
    "artistName":             event.artistName,
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

  proc.processSubmission(submissionDetails, context);
  email.confirmationEmail(submissionDetails, context);
};
