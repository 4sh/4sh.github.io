var baseUrl = 'https://mailservice.4sh.fr';

var config = {
    withCredentials: false,
    headers: {
        'Authorization': 'Basic ' + btoa('4shWebsite:67c8e0fb94054c4b09831d55e45eb02e'),
        'Content-Type' : 'application/x-www-form-urlencoded'
    },
    subject : '[4SH - Website] Nouvelle demande de contact'
};

$('#contactForm').submit(function (event) {

    var body = 'Prénom Nom : ' + $('#firstName').val() + ' ' + $('#lastname').val() + '.\n \n'
        + 'Email : ' + $('#email').val() + '.\n \n'
        + 'Téléphone : ' + $('#phone').val() + '.\n \n'
        + 'Société : ' + ($('#company').val() != ''?$('#company').val():'Non spécifiée') + '.\n \n'
        + 'Raison de la demande : ' + $('#reason').val() + '.\n \n'
        + 'Message : \n' + $('#message').val();

    $.ajax({
        url : baseUrl + '/api/messages',
        method: 'POST',
        data: JSON.stringify({
            subject: config.subject,
            body: body
        }),
        headers: config.headers,
        xhrFields: {
            withCredentials: config.withCredentials
        },
        dataType: 'json',
        success: function () {
            alertify.success('Votre demande a bien été envoyée');
            $('#contactForm').trigger("reset");
        },
        error : function () {
            alertify.error('Une erreur s\'est produite');
        }
    });

    event.preventDefault();
});