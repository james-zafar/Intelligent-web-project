/**
 * FOr a given modal: display the modal on the page
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
 * For a given story add a text bopx that allows the data of the story to be edited
 * @param source the ID of the element containing the text of the story to be edited
 */
function addTextToEdit(source) {
    //Remove any residual content from the display area
    $('#editTextArea').empty();
    var source = $('#' + source).text();
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
$('.editPost').click(function () {
    showModal('editPostModal');
    //Extract ID of the text of the clicked story
    window.storyID = (this.id).replace('edit', '');
    var textID = "text" + window.storyID;
    addTextToEdit(textID);
});

/**
 * Generate a sharable link to a given post
 */
$('.sharePost').click(function () {
    // TODO: Implement the share post feature
    console.log("Not yet implemented");
    window.storyID = (this.id).replace('share', '');
    var newText = 'Use the following link to share this post:' +
        ' https://localhost:3000/share?direct=true&viewPostID=' +
        window.storyID;
    var displayID = 'sharePost' + window.storyID;
    $('#shareTextArea' + window.storyID).text(newText);
    $('#' + displayID).show();
});

/**
 * Handle click event on request to delete a post
 */
$('.deletePost').click(function () {
    var source = this.id;
    window.storyID = source.replace('del', '');
    showModal('deleteModal');
});

/**
 * Executes when the user confirms they wish to delete a post
 */
$('#confirmDelete').click(function () {
    var deleteID = 'rm' + window.storyID;
    $('#' + deleteID).trigger('click');
});


function sendAjaxQuery(url, data) {
    $.ajax({
        url: url,
        data: data,
        contentType: 'application/json',
        type: 'POST',
    });
}

function submitForm() {
    $("form").submit(function () {
        var button = $("input[type=submit][clicked=true]").val();
        alert(button);
        var data = {};
        var formArray = $("form").serializeArray();
        data['storyID'] = formArray[0].value;
        if (button.contains('submitEdit')) {
            data['storyText'] = formArray[1].value;
            sendAjaxQuery('/editPost', data);
        } else {
            sendAjaxQuery('/deletePost', data);
        }
    });

    $("form input[type=submit]").click(function () {
        $("input[type=submit]", $(this).parents("form")).removeAttr("clicked");
        $(this).attr("clicked", "true");
    });
}
