$.get({
    url: '/session/isLoggedIn',
    success: function (data) {
        if (!data) {
            window.location.href = '/resources/Welcome.html';
        }
    }
});

function parseEntries(entries) {
    function parseEntry(entry) {
        return '<div style="margin-bottom:5px;">\n' +
            ' <a href="#"  class="easyui-linkbutton"\n' +
            ' style="width: 100%; text-align: left;"\n' +
            ' onclick="navigateTo(\'NewDashboard.html\')">' + entry.name + '</a>\n      ' +
            '  </div>';
    }

    let result = "";
    for (let entry of entries) {
        //debugger;
        result += parseEntry(entry);
    }
    return result;
}

function loadLeftPanel(after) {
    $('#panel').load('LeftPanel.html', function () {
        $.get({
            url: "/user/menu",
            success: function (menuData) {
                $('#Dashboards').append(parseEntries(menuData.dashboards));
                $('#Projects').append(parseEntries(menuData.projects));
                $('#Executions').append(parseEntries(menuData.execs));
                $.parser.parse('#panel'); // Re-initialize EasyUI components
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