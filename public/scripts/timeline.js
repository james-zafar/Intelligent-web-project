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
    $('#storyText').text(newText);
    //Select the correct success message to show
    $('#change' + storyID).show();
    var submitID = 'submitEdit' + window.storyID;
    $(('#' + submitID)).trigger('click');
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
    // TODO: Implement the share post feature
    console.log("To be implemented...");
    $('#submitShare').trigger('click');
});

/**
 * Handle click event on request to delete a post
 */
$('.deletePost').click(function () {
    var source = this.id;
    window.storyID = source.replace('del', '');
    console.log(window.storyID);

    showModal('deleteModal');
});

/**
 * Executes when the user confirms they wish to delete a post
 */

function clickDelete() {
    var theButton = 'Rm' + window.storyID;
    console.log("Button: " + theButton);
    setTimeout(function(){
        $(("#" + theButton)).click();
    }, 1);
}

$('#confirmDelete').click(function () {
    $('#' + window.storyID).remove();
    clickDelete();
});