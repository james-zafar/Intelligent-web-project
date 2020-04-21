//Remove the default text display on input field
if ($('#addFile').val() === "") {
    $('#addFile').css('color', 'transparent');
}

/**
 *
 * @param fileList the list of files selected by the user
 */
function addAttachment(fileList) {
    if (fileList.files) {
        let length = fileList.files.length;
        //Check to ee how many images already attached to enforce 4 image limit
        const child = $('#previewArea').children('img').length;
        if((length + child) > 3) {
            $('#tooManyImage').show();
            length = 3 - child;
        }
        //If the list are valid files then iterate over the list...
        for (let i = 0; i < length; i++) {
            const reader = new FileReader();
            reader.onload = function (evt) {
                //Create new preview for each image in the list and append it to the preview area
                $('<img />', {
                    src: evt.target.result,
                    alt: 'Images selected by user',
                    width: '32%',
                    height: '100%',
                    id: ('image' + i),
                    class: 'uploadImages',
                    click: function(e) {
                        showImagePreviw(('image' + i))
                    },
                    css: {
                        paddingBottom: '25px',
                        paddingLeft: '3%'
                    }

                }).appendTo('#previewArea');
            };
            reader.readAsDataURL(fileList.files[i]);
        }
    }
}

$('#addFile').change(function() {
    addAttachment(this);
    addImgPreview();
});


/**
 *
 * @param imageID the id of the image to be previewed
 */
function addImgPreview(imageID) {
    // Remove any previous images from content area
    $('#previewBody').empty();
    var source =  $('#' + imageID).attr('src');
    $('<img />', {
        src: source,
        width: '100%',
        height: '100%',
        id: ('rm' + imageID)
    }).appendTo($('#previewBody'));
}


/**
 *
 * @param source the id of the image to be previewed
 */
function showImagePreviw(source) {
    addImgPreview(source);
    var img = $('#imagePreview');
    //Show modal with the image preview
    img.modal({
        backdrop: true
    });
    img.on('shown.bs.modal', function () {
        $('#imagePreview').trigger('focus')
    });
}

/**
 * Remove the picture displayed in the modal from attachment list
 */
function removePicture() {
    let toRemove = undefined;
    $('#previewBody').children('img').each(function (){
        toRemove = $(this).attr('id');
    });
    //Remove the first part of id to get actual image ref
    toRemove = toRemove.substring(2);
    $('#' + toRemove).remove();
    $('#imagePreview').modal('hide');

}

/**
 *
 * @returns {[]} An array of images uploaded by the user (maximum 4)
 */
function getImages() {
    var images = [];
    let i = 0;
    //Iterate over first 4 images, break when the element id does not exist (i.e. no image to get)
    $('#previewArea').children('img').each(function (){
        images[i] = $(this).attr('src');
        i++;
    });
    return images;
}

/**
 * Function for submitting the post
 */
$('#submitPost').click(function() {
    var text = $('#storyContent').val();
    const images = getImages();
    //If no text and images, throw error, if no text but images then confirm submission with user
    if(text === '' && images.length === 0) {
        $('#postError').show();
    }else if(text === '') {
        $('#postWarning').show();
    }
});