$.ajax({
    url: '/session/isLoggedIn',
    success: function(data) {
        if (!data) {
            window.location.href = '/resources/welcome.html';
        }
    }
});