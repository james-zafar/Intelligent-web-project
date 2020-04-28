/**
 *
 * @param modalID the ID of the modal to be displayed
 */
function showModal(modalID) {
    var modal = $('#' + modalID);
    //Show the modal
    modal.modal({
        backdrop: true
    });
    modal.on('shown.bs.modal', function () {
        $('#' + modalID).trigger('focus')
    });
}

/**
 *
 * @param source the ID of the element containing the text of the story to be edited
 */
function addTextToEdit(source) {
    //Remove any residual content from the display area
    $('#editTextArea').empty();
    var source =  $('#' + source).text();
    $('<textarea />', {
        text: source,
        id: 'editArea',
        width: '100%',
        rows: '10'
    }).appendTo($('#editTextArea'));
    $('#editArea').height( $(this)[0].scrollHeight );
}

/**
 * Handle click event in edit post modal
 */
function saveChanges() {
    var newText = $('#editArea').val();
    $('#textID1').text(newText);
    $('#changeSuccess').show();
}

/**
 * Function to handle click when the users selects a post to edit
 */
$('.editPost').click(function() {
    showModal('editPostModal');
    //Extract ID of the text of the clicked story
    var clickID = this.id;
    var textID = clickID.replace('edit', '');
    textID = "text" + textID;
    addTextToEdit(textID);

});

/**
 * Generate a sharable link to a given post
 */
$('.sharePost').click(function () {
    console.log("To be implemented...");
});

/**
 * Handle click event on request to delete a post
 */
function deletePost(source) {
    showModal('deleteModal');
        console.log(source);
    var storyID = source.replace('delete', '');
    storyID = "story" + storyID;
    if(!confirmed) {
        window.setTimeout(deletePost.bind(null), 100); /* this checks the flag every 100 milliseconds*/
    }else {
        console.log("Can continue");
    }
}

/**
 * Executes when the user confirms they wish to delete a post
 */
var confirmed = false;
$('#confirmDelete').click(function () {
    confirmed = true;
    /*** This will need to be altered to find the ID of the story to be deleted ***/
    //Get the ID of the story to be deleted
});