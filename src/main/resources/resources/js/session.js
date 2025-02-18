$.get({
    url: '/session/isLoggedIn',
    success: function(data) {
        if (!data) {
            window.location.href = '/resources/welcome.html';
        }
    }
});

function loadLeftPanel(after) {
    $('#panel').load('LeftPanel.html', function() {
        $.parser.parse('#panel'); // Re-initialize EasyUI components
        if (after !== undefined) {
            after();
        }
    });
}

function navigateTo(url){
    window.location.href = url;
}