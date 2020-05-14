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
    $('#text' + window.storyID).text(newText);
    //Select the correct success message to show
    $('#change' + storyID).show();
}

/**
 * Function to handle click when the users selects a post to edit
 */
$('.editPost').click(function() {
    showModal('editPostModal');
    //Extract ID of the text of the clicked story
    var clickID = this.id;
    window.storyID =  clickID.replace('edit', '');
    var textID = "text" + window.storyID;
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
    //Get the id of the story being deleted
    window.storyID = source.replace('del', '');
}

/**
 * Executes when the user confirms they wish to delete a post
 */
$('#confirmDelete').click(function () {
    /*** This will need to be altered to find the ID of the story to be deleted ***/
    $('#' + window.storyID).remove();
});