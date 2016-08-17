var readPDF = function(inputElement) {
  var deferred = $.Deferred();

  var files = inputElement.get(0).files;
  if (files && files[0]) {
    var fr = new FileReader();
    fr.onload = function(e) {
      deferred.resolve(e.target.result);
    };
    fr.readAsDataURL(files[0]);
  } else {
    deferred.resolve(undefined);
  }

  return deferred.promise();
}

var base64MimeType = function(encoded) {
  var result = null;

  if (typeof encoded !== 'string') {
    return result;
  }

  var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

  if (mime && mime.length) {
    result = mime[1];
  }

  return result;
}

$(document).ready(function() {
  var pdfFile;
  $("#cvUpload").on('change', function() {
    readPDF($(this)).done(function(base64Data) {
      pdfFile = base64Data;
    });
  });
  $("#submitEOI").click(function() {
    var submissionDetails = $("form").serializeObject();
    submissionDetails.cv = [{
      type: "",
      name: "",
      body: ""
    }];
    if (pdfFile){
      submissionDetails.cv = [{
        type: base64MimeType(pdfFile),
        name: $('#cvUpload').val().replace("C:\\fakepath\\", ""),
        body: pdfFile.split(',')[1]
      }];
    }

    $.ajax({
      data: JSON.stringify(submissionDetails),
      url: 'https://u7zjgs87ed.execute-api.eu-west-1.amazonaws.com/dev/eoi/submit',
      type: 'POST',
      processData: false,
      crossDomain: true,
      contentType: 'application/json; charset=UTF-8',
      dataType: 'json',
      success: function(data) {
        alert(data);
      },
      error: function(xhr, ajaxOptions, thrownError) {
        alert(thrownError);
      }
    });
  });
});
