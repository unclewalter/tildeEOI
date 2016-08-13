var aws = require('aws-sdk');
var logger  = require('morgan');

aws.config.loadFromPath('./aws-config.json');

var debug = function() {
  if (config.debug) {
    console.log.apply(console, arguments);
  }
};

// log all the things
app.use(logger('dev'));

var s3 = new aws.S3({});
var ses = new aws.SES({});

var processSubmission = function(submissionDetails, context) {

}

var confirmEmail = function(submissionsDetails, context) {

}

exports.handler = function(event, context) {
  datetime = new Date();
  timestamp = datetime.getTime(); // Generate timestamp for server time

  console.log("Incoming: ", event);

  console.log("email address =", event.email);

  if (!event.email) {
    context.fail("No email address provided");
  }
  else if (event.email != event.confirm_email) {
    context.fail("Email address and confirmation do not match!");
  }

  console.log("time stamp =", datetime.getTime());
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
