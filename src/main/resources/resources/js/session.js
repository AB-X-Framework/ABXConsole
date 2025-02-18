$.get({
    url: '/session/isLoggedIn',
    success: function(data) {
        if (!data) {
            window.location.href = '/resources/welcome.html';
        }
    }
});

function loadLeftPanel() {
    $('#panel').load('leftpanel.html', function() {
        $.parser.parse('#panel'); // Re-initialize EasyUI components
    });
}

function navigateTo(url){
    window.location.href = url;
}