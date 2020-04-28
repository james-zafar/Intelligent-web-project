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
    //Create editable text area for the user to edit
    $('<textarea />', {
        text: source,
        id: 'editArea',
        width: '100%',
        rows: '10'
    }).appendTo($('#editTextArea'));
}

/**
 * Handle click event in edit post modal
 */
function saveChanges() {
    var newText = $('#editArea').val();
    $('#' + window.textID).text(newText);
    //Select the correct success message to show
    var successID =  window.textID.replace( /^\D+/g, '');
    $('#changeSuccess' + successID).show();
}

/**
 * Function to handle click when the users selects a post to edit
 */
$('.editPost').click(function() {
    showModal('editPostModal');
    //Extract ID of the text of the clicked story
    var clickID = this.id;
    var textID = clickID.replace('edit', '');
    window.textID = "text" + textID;
    addTextToEdit(window.textID);

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
    //Get the id of the story being deleted
    var storyID = source.replace('delete', '');
    window.storyID = "story" + storyID;
}

/**
 * Executes when the user confirms they wish to delete a post
 */
$('#confirmDelete').click(function () {
    /*** This will need to be altered to find the ID of the story to be deleted ***/
    $('#' + window.storyID).remove();
});