$(document).ready(function() {
  var cvFile;
  $("#cvUpload").on('change', function() {
    readPDF($(this)).done(function(base64Data) {
      cvFile = base64Data;
    });
  });
  $("#submitEOI").click(function() {
    var submissionDetails = $("form").serializeObject();
    $("#submitEOI").html("Submitting...");
    submissionDetails.cv = [{
      type: "",
      filename: "",
      body: ""
    }];
    if (cvFile){
      var fname = $('#cvUpload').val().replace("C:\\fakepath\\", "");
      submissionDetails.cv = {
        type: base64MimeType(cvFile),
        fname: fname,
        body: cvFile.split(',')[1]
      };
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
        var cvFile = document.getElementById('cvUpload').files[0]
        uploadFile(cvFile, data.cvfilename)
        console.log(data);
      },
      error: function(xhr, ajaxOptions, thrownError) {
        alert(thrownError);
      }
    });
  });
});
