/**
 * Handles reading of JSON file to be uploaded to DB
 */
$(function() {
    const fileSelector = document.getElementById('json_upload');
    const uploadButton = document.getElementById('uploadButton');

    fileSelector.addEventListener('change', () => {
        let selectedFile = document.getElementById('selectedFile');
        selectedFile.innerHTML = 'Selected file: ' + fileSelector.value.split(/(\\|\/)/g).pop()
    });

    uploadButton.addEventListener('click', (event) => {
        const fileList = fileSelector.files;
        const reader = new FileReader();
        reader.readAsText(fileList[0], 'UTF-8');
        reader.addEventListener('load', (event) => {
            const data = JSON.parse(event.target.result);
            try {
                for (let user of data.users) {
                    upload(user, 'user');
                }
                for (let story of data.stories) {
                    upload(story, 'story');
                }
                alert('Successfully uploaded JSON');
            } catch (e) {
                alert(e);
            }
        });
    });
});

/**
 * Send Ajax request for a story or user to be uploaded to db
 * @param  data - story or user object
 * @param modelType - 'story' or 'user'
 */
function upload(data, modelType) {
    $.ajax({
        url: '/upload' + modelType.toUpperCase(),
        data: JSON.stringify(data),
        contentType: 'application/json',
        type: 'POST',
        success: function () {
            console.log('Successfully uploaded ' + modelType);
        },
        error: function (xhr, status, error) {
            console.log('Error uploading file. Error Message: ' + error);
        }
    });
}
