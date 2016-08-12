var aws = require('aws-sdk');
aws.config.loadFromPath('./aws-config.json');

var ses = new aws.SES({
});

exports.handler = function(event, context) {
    datetime = new Date();
    timestamp = datetime.getTime();
    console.log("Incoming: ", event);


    console.log("email address =",event.email);

    if(!event.email) context.fail("No email address provided");
    if(event.email != event.confirm_email) context.fail("Email address and confirmation do not match!");

    console.log("time stamp =",datetime.getTime());
    var emailDetails = {
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
};
