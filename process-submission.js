var crypto = require('crypto'),
    pdf    = require('pdfkit'),
    fs     = require('fs'),
    aws    = require('aws-sdk');

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
   - TODO: Possibly move this process into another module.
4. Concatinates CV from submission
5. Pushes the PDF file to S3.
*/

module.exports.processSubmission = function(submissionDetails, context) {
  var hash              = crypto.createHash('md5').update(submissionDetails.email).digest("hex");
  var fileExtensionPatt = /\.([0-9a-z]+)(?:[\?#]|$)/i;

  var filename          = hash + '_' + submissionDetails.timestamp + '.pdf';

  if (submissionDetails.cv.fname) {
    var cvFileExt       = submissionDetails.cv.fname.split('.').pop();
  }
  // var cvFileExt         = ".png"; // Temporary
  var cvfilename        = hash + '_' + submissionDetails.timestamp + '-cv.' + cvFileExt;
  var subFilePath       = '/tmp/' + filename;
  var cvFilePath        = '/tmp/' + cvfilename;
  var s3obj             = new aws.S3({});

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
  var writeStream = fs.createWriteStream(subFilePath);

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
  // myDoc.addPage();

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
  myDoc.text('Name: '+submissionDetails.artistName, {
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

  // Date
  myDoc.font('./fonts/Sanchez-Italic.ttf').fontSize(20);
  myDoc.text('Date: ', {
    align: 'left'
  });
  myDoc.moveDown(0.5);

  var datetime = new Date();
  datetime.setTime(submissionDetails.timestamp);

  myDoc.font('./fonts/Questrial-Regular.ttf').fontSize(12);
  myDoc.text(datetime.toDateString(), {
    align: 'justify'
  });
  myDoc.moveDown(0.5);

  myDoc.end();


  writeStream.on('finish', function () {
    var body = fs.createReadStream(subFilePath);
    s3obj.upload({
      Bucket: 'tilde-submissions',
      Key: 'eoi/'+filename,
      Body: body
    }).
      on('httpUploadProgress', function(evt) { console.log(evt); }).
      send(function(err, data) {
        var returnPayload;
        if (submissionDetails.cv.fname) {
          returnPayload = {
            cvfilename: cvfilename,
            message: err
          }
        } else {
          returnPayload = {
            message: err
          }
        }
        context.succeed(returnPayload);
      });
    console.log('Output file size:' + getFilesizeInBytes(subFilePath) + ' bytes');
  });
};
