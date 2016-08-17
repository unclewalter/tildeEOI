"use strict";

var aws           = require('aws-sdk');
var util          = require('util');
var nodemailer    = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var sesTransport  = require('nodemailer-ses-transport');
var mustache      = require('mustache');
var fs            = require('fs');
var mailConf      = require('./ses-config');

aws.config.loadFromPath('./aws-config.json');


module.exports.confirmationEmail = function(submissionDetails, context) {
  var view = {
    name: submissionDetails.artistName
  };
  var htmlTemplate = fs.readFileSync('./confirmation-email.html.mustache', 'utf8');
  var emailHtml    = mustache.render(htmlTemplate, view);

  var textTemplate = fs.readFileSync('./confirmation-email.txt.mustache', 'utf8');
  var emailText    = mustache.render(htmlTemplate, view);

  var defaultMailOptions = {
        "from":    mailConf.defaultEmailFrom,
        "to":      mailConf.defaultEmailTo,
        "bcc":     mailConf.defaultEmailBCC,
        "subject": mailConf.defaultEmailSubject,
        "text":    mailConf.defaultEmailText
    };

    var sesOptions = {
        accessKeyId:     mailConf.SES_STMP_USERNAME,
        secretAccessKey: mailConf.SES_SMTP_PASSWORD,
        region:          mailConf.AWS_REGION
    };

    var mailOptions = {
            "from":    defaultMailOptions.from,
            "to":      submissionDetails.email,
            "bcc":     defaultMailOptions.bcc,
            "subject": "Tilde Expression of Interest Submission",
            "text":    emailText,
            "html":    emailHtml
        };

    var transporter = nodemailer.createTransport(sesTransport(sesOptions));
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            context.fail(err);
        } else {
            console.log('Sending message.. info:' + info);
            context.succeed(info);
        }
    });
}
