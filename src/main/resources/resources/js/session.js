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

function parseEntries(url, entryId, entryName, entries) {
    function parseEntry(entry) {
        return '<div style="margin-bottom:5px;">\n' +
            ' <a href="#"  class="easyui-linkbutton" ' +
            ` id="${entryId}-${entry[entryId]}" `+
            ' style="width: 100%; text-align: left;"\n' +
            ` onclick="navigateTo('${url+entry[entryId]}')"> ` +
             entry[entryName] + '</a>\n</div>';
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
                    $('#Dashboards').append(
                        parseEntries("DashboardDetails.html?id=", "dashboardId","dashboardName",menuData.dashboards));
                    $('#Projects').append(
                        parseEntries("ProjectDetails.html?id=","projectId","projectName",menuData.projects));
                    $('#Executions').append(
                        parseEntries("Dashboard.html?id=","execId","execName",menuData.execs));
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

class Repository {
    static counter;

    static addRepository() {
        $.get("/resources/Repository.html", function(data) {
            $("#RepositoryPlaceHolder").append(data);
            $.parser.parse('#RepositoryPlaceHolder');
        });
    }
}