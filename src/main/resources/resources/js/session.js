$.get({
    url: '/session/isLoggedIn',
    success: function (data) {
        if (!data) {
            window.location.href = '/resources/Welcome.html';
        }
    }
});

function loadLeftPanel(after) {
    $('#panel').load('LeftPanel.html', function () {
        $.parser.parse('#panel'); // Re-initialize EasyUI components
        $.get({
            url: "dashboards/dashboards",
            success: function (data) {
                if (after !== undefined) {
                    after();
                }
            }
        });
    });
}

function navigateTo(url) {
    window.location.href = url;
}

function logout() {
    $.get({
        url: '/session/logout',
        success: function (data) {
            window.location.href = '/resources/Welcome.html';
        }
    });
}