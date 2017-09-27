// Get the template HTML and remove it from the doument
var previewNode = document.querySelector("#preview-template");
previewNode.id = "";
var previewTemplate = previewNode.parentNode.innerHTML;
previewNode.parentNode.removeChild(previewNode);

var myDropzone = new Dropzone(document.body, { // Make the whole body a dropzone
  url: "/upload", // Set the url
  paramName: "upl",
  parallelUploads: 20,
  previewTemplate: previewTemplate,
  autoQueue: false, // Make sure the files aren't queued until manually added
  previewsContainer: "#previews", // Define the container to display the previews
  clickable: ".js-upload-files" // Define the element that should be used as click trigger to select files.
});

myDropzone.on("addedfile", function(file) {
  // Hookup the start button
  file.previewElement.querySelector(".js-upload-start").onclick = function() { myDropzone.enqueueFile(file); };
  // Enable the optimize all and remove all buttons
  document.querySelector("#actions .js-upload-start").removeAttribute("disabled");
  document.querySelector("#actions .js-upload-clear").removeAttribute("disabled");
});

// Update the total progress bar
myDropzone.on("totaluploadprogress", function(progress) {
  document.querySelector(".js-upload-total-progress .progress-bar").style.width = progress + "%";
});

myDropzone.on("sending", function(file) {
  // Show the total progress bar when upload starts
  document.querySelector(".js-upload-total-progress").style.opacity = "1";
  // And disable the start buttons
  file.previewElement.querySelector(".js-upload-start").setAttribute("disabled", "disabled");
});

// Hide the total progress bar when nothing's uploading anymore
myDropzone.on("queuecomplete", function(progress) {
  document.querySelector(".js-upload-total-progress").style.opacity = "0";
});

// Setup the buttons for all transfers
// The "add files" button doesn't need to be setup because the config
// `clickable` has already been specified.
document.querySelector("#actions .js-upload-start").onclick = function() {
  myDropzone.enqueueFiles(myDropzone.getFilesWithStatus(Dropzone.ADDED));
};
document.querySelector("#actions .js-upload-clear").onclick = function() {
  myDropzone.removeAllFiles(true);
  document.querySelector("#actions .js-upload-start").setAttribute("disabled", "disabled");
  document.querySelector("#actions .js-upload-clear").setAttribute("disabled", "disabled");
};

