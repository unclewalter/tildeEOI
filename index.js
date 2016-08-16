// Loading Dependencies
var aws    = require('aws-sdk'),
    crypto = require('crypto'),
    fs     = require('fs'),
    pdf    = require('pdfkit'),
    spindrift = require('spindrift');

// Loading in the secret stuff
aws.config.loadFromPath('./aws-config.json');

// Amazon services
// var s3  = new aws.S3({});
var ses = new aws.SES({});

// TODO: Move to utility functions file.
var getFilesizeInBytes = function(filename) {
  var stats = fs.statSync(filename)
  var fileSizeInBytes = stats["size"]
  return fileSizeInBytes
}

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
  var hash        = crypto.createHash('md5').update(submissionDetails.email).digest("hex");
  var filename    = hash + '_' + submissionDetails.timestamp + '.pdf';
  var filepath    = '/tmp/' + filename;

  // Initializing objects
  var myDoc       = new pdf({
    size: 'A4',
    margins: {
      top:    50,
      bottom: 50,
      left:   72,
      right:  72
    }
  });
  var writeStream = fs.createWriteStream(filepath);
  var s3obj       = new aws.S3(
        {
    params: {
      Bucket: 'tilde-submissions',
      Key: 'eoi/' + filename
    }
  });

  // Generate PDF file
  myDoc.pipe(writeStream);

  myDoc.image('./images/tilde-logo.png', myDoc.page.width-80, 30, {
    width: 50
  });
  myDoc.font('./fonts/Sanchez-Regular.ttf').fontSize(35);

  myDoc.text('EOI: '+submissionDetails.project_title, {
    align: 'center',
    width: (myDoc.page.width-72-90)
  });

  myDoc.moveDown();

  // Short Description

  myDoc.font('./fonts/Sanchez-Italic.ttf').fontSize(20);
  myDoc.text('Short Description: ', {
    align: 'left'
  });
  myDoc.font('./fonts/Questrial-Regular.ttf').fontSize(12);
  myDoc.text(submissionDetails.short_description, {
    align: 'justify'
  });
  myDoc.moveDown(0.5);

  // Long Description

  myDoc.font('./fonts/Sanchez-Italic.ttf').fontSize(20);
  myDoc.text('Long Description: ', {
    align: 'left'
  });
  myDoc.font('./fonts/Questrial-Regular.ttf').fontSize(12);
  myDoc.text(submissionDetails.long_description, {
    align: 'justify'
  });
  myDoc.moveDown(0.5);

  // Technical Requirements

  myDoc.font('./fonts/Sanchez-Italic.ttf').fontSize(20);
  myDoc.text('Technical Requirements: ', {
    align: 'left'
  });
  myDoc.font('./fonts/Questrial-Regular.ttf').fontSize(12);
  myDoc.text(submissionDetails.technical_requirements, {
    align: 'justify'
  });
  myDoc.moveDown(0.5);

  // Instrumentation

  myDoc.font('./fonts/Sanchez-Italic.ttf').fontSize(20);
  myDoc.text('Instrumentation (if applicable): ', {
    align: 'left'
  });
  myDoc.font('./fonts/Questrial-Regular.ttf').fontSize(12);
  myDoc.text(submissionDetails.instrumentation, {
    align: 'justify'
  });
  myDoc.moveDown(0.5);

  // Funding

  myDoc.font('./fonts/Sanchez-Italic.ttf').fontSize(20);
  myDoc.text('Funding:', {
    align: 'left'
  });
  myDoc.moveDown(0.5);

  myDoc.font('./fonts/Questrial-Regular.ttf').fontSize(12);
  myDoc.text(submissionDetails.funding, {
    align: 'justify'
  });
  myDoc.moveDown(0.5);

  // Focus Areas

  myDoc.font('./fonts/Sanchez-Italic.ttf').fontSize(20);
  myDoc.text('Focus Areas:', {
    align: 'left'
  });
  myDoc.moveDown(0.5);

  myDoc.font('./fonts/Questrial-Regular.ttf').fontSize(12);
  myDoc.text(submissionDetails.focus_areas, {
    align: 'justify'
  });
  myDoc.moveDown(0.5);

  // Comments

  myDoc.font('./fonts/Sanchez-Italic.ttf').fontSize(20);
  myDoc.text('Comments: ', {
    align: 'left'
  });
  myDoc.moveDown(0.5);

  myDoc.font('./fonts/Questrial-Regular.ttf').fontSize(12);
  myDoc.text(submissionDetails.comments, {
    align: 'justify'
  });
  myDoc.moveDown(0.5);

  // ============
  myDoc.addPage();

  // Project Title
  myDoc.font('./fonts/Sanchez-Italic.ttf').fontSize(20);
  myDoc.text('Project Title: ', {
    align: 'left'
  });
  myDoc.moveDown(0.5);

  myDoc.font('./fonts/Questrial-Regular.ttf').fontSize(12);
  myDoc.text(submissionDetails.project_title, {
    align: 'justify'
  });
  myDoc.moveDown(0.5);

  // Bio
  myDoc.font('./fonts/Sanchez-Italic.ttf').fontSize(20);
  myDoc.text('Bio: ', {
    align: 'left'
  });
  myDoc.moveDown(0.5);

  myDoc.font('./fonts/Questrial-Regular.ttf').fontSize(12);
  myDoc.text(submissionDetails.bio, {
    align: 'justify'
  });
  myDoc.moveDown(0.5);

  // Contact Details:
  myDoc.font('./fonts/Sanchez-Italic.ttf').fontSize(20);
  myDoc.text('Contact Details:', {
    align: 'left'
  });

  myDoc.font('./fonts/Questrial-Regular.ttf').fontSize(12);
  myDoc.text('Name: '+submissionDetails.name, {
    align: 'left'
  });
  myDoc.moveDown(0.5);
  myDoc.text('Email: '+submissionDetails.email, {
    align: 'left'
  });
  myDoc.moveDown(0.5);
  myDoc.text('Phone: '+submissionDetails.phone, {
    align: 'left'
  });
  myDoc.moveDown(0.5);

  myDoc.end();


  writeStream.on('finish', function () {
    var body = fs.createReadStream(filepath);
    s3obj.upload({Body: body}).
      on('httpUploadProgress', function(evt) { console.log(evt); }).
      send(function(err, data) { console.log(err, data) });
    console.log('Output file size:' + getFilesizeInBytes(filepath) + ' bytes');
  });
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

module.exports.eoi = function(event, context) {
  datetime  = new Date();
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
