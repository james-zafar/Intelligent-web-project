function submitRating(data) {
    $.ajax({
        url: '/addLikeRating' ,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            var ret = dataR;
            console.log("Complete");
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

$('.likeButtons').on('click', function () {
    var likeRating = this.id;
    var numericRating = likeRating.match(/\d+/)[0];
    var storyLiked = $(this).closest('div').attr('id').replace('like', '');

    var datatToSend ={};
    datatToSend['vote'] = numericRating;
    datatToSend['story_id'] = storyLiked;
    datatToSend['currentUser'] = $('#currentUser').text().trim();;

    $('#likeDropDown'+ storyLiked).text($('#' + likeRating).text());
    submitRating(datatToSend);
});