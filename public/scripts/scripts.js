function sendAjaxQuery(url, data, redirect) {
    $.ajax({
        url: url ,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function () {
            window.location.href = redirect;
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

function send(url, redirect) {
    const formArray = $("form").serializeArray();
    let data = {};
    for (let index in formArray) {
        data[formArray[index].name] = formArray[index].value;
    }
    // data = JSON.stringify($(this).serializeArray());
    sendAjaxQuery(url, data, redirect);
    event.preventDefault();
}
