
//Remove the default text display on input field
if ($('#addFile').val() === "") {
    $('#addFile').css('color', 'transparent');
}

/**
 * Takes a list image files supplied by the user and adds it to the post
 * @param fileList the list of files selected by the user
 */
function addAttachment(fileList) {
    if (fileList.files) {
        let length = fileList.files.length;
        //Check to see how many images already attached to enforce 3 image limit
        const child = $('#previewArea').children('img').length;
        if((length + child) >= 3) {
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
                    name: ('image' + i),
                    click: function(e) {
                        showImagePreview(('image' + i))
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
 * For a given image add a preview to the post
 * @param imageID the id of the image to be previewed
 */
function addImgPreview(imageID) {
    //Remove any previous images from content area
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
 * For a givenh image show the preview of the image
 * @param source the id of the image to be previewed
 */
function showImagePreview(source) {
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
 * Get all of the images that the user has currently uploaded
 * @returns {[]} An array of images uploaded by the user (maximum 4)
 */
function getImages() {
    let images = [],
        i = 0,
        currentImage,
        imageText;
    //Iterate over first 4 images, break when the element id does not exist (i.e. no image to get)
    $('#previewArea').children('img').each(function (){
        currentImage = $(this).attr('src')
        currentImage = currentImage.replace(/data:.+?,/, "");
        images[i] = currentImage
        imageText = document.getElementById('imageText' + i)
        imageText.value = currentImage
        i++;
    });
    return images;
}

/**
 * Function for submitting the post
 */
$('#submitPost').click(function() {
    const text = $('#storyContent').val();
    const images = getImages();
    //If no text and images, throw error, if no text but images then confirm submission with user
    if(text === '' && images.length === 0) {
        $('#postError').show();
    }else if(text === '') {
        $('#postWarning').show();
    }else {
        //Trigger form submission
        $('#submitStory').trigger('click');
        $('#success').show();
    }
});

// TODO: Bug here where button needs to be pressed. Either fix or remove button as a workaround.
function toggleCamera() {
    let cameraContainer = document.getElementById('submitCameraContainer'),
        toggleButton = document.getElementById('toggleCameraButton')

    if (cameraContainer.style.display === "block") {
        cameraContainer.style.display = "none"
        toggleButton.innerHTML = "Use camera"
    } else {
        cameraContainer.style.display = "block"
        toggleButton.innerHTML = "Close camera"
    }
}

(function () {
    let video = document.getElementById('video'),
        canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),
        photo = document.getElementById('photo'),
        vendorUrl = window.URL || window.webkitURL;

    navigator.getMedia =    navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;

    navigator.getMedia({
        video: true,
        audio: false
    }, function (stream) {
        video.srcObject = stream;
        video.play();
    }, function (error) {
        console.log(error.code);
        window.alert("Error getting video stream")
    });

    document.getElementById('capture').addEventListener('click', function () {
        context.drawImage(video, 0, 0, 300, 255);
        photo.setAttribute('src', canvas.toDataURL('image/png'))
    });

    document.getElementById('uploadCapturedPhoto').addEventListener('click', function () {
        const child = $('#previewArea').children('img').length;
        if (child >= 3){
            $('#tooManyImage').show();
        } else {
            $('<img />', {
                src: photo.src,
                alt: 'Images taken by user',
                width: '32%',
                height: '100%',
                id: ('image' + (child + 1)),
                class: 'uploadImages',
                name: ('image' + (child + 1)),
                click: function(e) {
                    showImagePreview('image' + (child + 1))
                },
                css: {
                    paddingBottom: '25px',
                    paddingLeft: '3%'
                }
            }).appendTo('#previewArea');
        }
    })
} ());