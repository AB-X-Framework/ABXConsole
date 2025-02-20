$.get({
    url: '/session/isLoggedIn',
    success: function (data) {
        if (!data) {
            window.location.href = '/resources/Welcome.html';
        }
    }
});

function parseEntries(entries){
    function parseEntry(entry){
        return '<div style="margin-bottom:5px;">\n         ' +
            '   <a href="#"\n           ' +
            '    id="NewDashboard1"\n      ' +
            '         class="easyui-linkbutton"\n        ' +
            '       style="width: 100%; text-align: left;"\n        ' +
            '       onclick="navigateTo(\'NewDashboard.html\')">New Dashboard2</a>\n      ' +
            '  </div>';
    }
    let result = "";
    for (let entry of entries){
        debugger;
        result+=parseEntry(entry);
    }
    return result;
}

function loadLeftPanel(after) {
    $('#panel').load('LeftPanel.html', function () {
        $.parser.parse('#panel'); // Re-initialize EasyUI components
        $.get({
            url: "/dashboards/dashboards",
            success: function (data) {
                debugger;
                $('#Dashboards').append(parseEntries(data));
                $.parser.parse('#Dashboards'); // Re-initialize EasyUI components
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