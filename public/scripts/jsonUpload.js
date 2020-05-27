/**
 * JSON upload handling
 */
const file = document.getElementById('json_upload');
const reader = new FileReader();
reader.readAsText(file, 'UTF-8');
reader.onload = uploadJsonToDB;

/**
 * Makes Ajax request to upload file
 */
function uploadJsonToDB() {
    $.ajax({
        url: '/uploadJson' ,
        data: file,
        contentType: 'application/json',
        type: 'POST',
        success: function () {
            alert('Successfully uploaded file');
        },
        error: function (xhr, status, error) {
            alert('Error uploading file. With error:' + error);
        }
    });
}