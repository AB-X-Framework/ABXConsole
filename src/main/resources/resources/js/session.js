$.get({
    url: '/session/isLoggedIn',
    success: function (data) {
        if (!data) {
            window.location.href = '/resources/Welcome.html';
        }
    }
});

function hideNotes() {
    $('#notes').hide();
    $('#main').resize()
}

function showNotes(note) {
    $('#notes').show();
    $('#main').resize();
    $('#note').html(note)
}

function parseEntries(url, entries) {
    function parseEntry(entry) {
        return '<div style="margin-bottom:5px;">\n' +
            ' <a href="#"  class="easyui-linkbutton" ' +
            ` id="Dashboard-${entry.id}" `+
            ' style="width: 100%; text-align: left;"\n' +
            ` onclick="navigateTo('${url+entry.id}')"> ` +
             entry.name + '</a>\n</div>';
    }

    let result = "";
    for (let entry of entries) {
        //debugger;
        result += parseEntry(entry);
    }
    return result;
}

function loadLeftPanel(after) {
    hideNotes();
    $('#panel').load('LeftPanel.html', function () {
        $.get({
            url: "/rest/menu",
            success: function (menuData) {
                if (menuData.error) {
                    showNotes(menuData.message);
                } else {
                    $('#Dashboards').append(parseEntries("DashboardDetails.html?id=", menuData.dashboards));
                    $('#Projects').append(parseEntries("Dashboard.html?id=",menuData.projects));
                    $('#Executions').append(parseEntries("Dashboard.html?id=",menuData.execs));
                }
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