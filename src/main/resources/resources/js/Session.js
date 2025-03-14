// ------------------------- //
// - Utilitarian functions   //
// ------------------------- //
$.get({
    url: '/session/isLoggedIn',
    success: function (data) {
        if (!data) {
            window.location.href = '/resources/Welcome.html';
        }
    }
});

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function hideNotes() {
    $('#notes').hide();
    $('#main').resize()
}

function showNotes(note) {
    $('#notes').show();
    $('#main').resize();
    $('#note').html(note)
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

class MenuPanel {
    static parentButtonHtml =
        '<div style="margin-bottom:5px;"> ' +
        '<a href="#"  class="easyui-linkbutton" style="width: 100%; text-align: left;';
    static defaultButtonHtml =
        '<div style="margin-bottom:5px;"> ' +
        '<a href="#"  class="easyui-linkbutton"  style="margin-left: 5%; width: 95%; text-align: left;"';

    static parseDashboardEntries(entryId, entryName, entries) {
        let details = "DashboardDetails.html?id=";
        let editor = "DashboardEditor.html?id=";
        let commit = "DashboardCommit.html?id=";

        function parseEntry(entry) {
            let entryText = MenuPanel.defaultButtonHtml +
                ` id="${entryId}-${entry[entryId]}" ` +
                ` onclick="navigateTo('${details + entry[entryId]}')"> ` +
                entry[entryName] + '</a>\n</div>';

            entryText += "\n</div>";
            return entryText;
        }

        let result = "";
        for (let entry of entries) {
            //debugger;
            result += parseEntry(entry);
        }
        return result;
    }

    static parseProjectEntries(entries) {
        function parseEntry(entry) {
            let entryId = entry["projectId"];
            let entryText = MenuPanel.parentButtonHtml +
                ` id="${entryId}-${entry[entryId]}" ` +
                ` onclick="navigateTo('ProjectDetails.html?projectId=${entryId}')"> ` +
                entry["projectName"] + '</a>\n</div>';
            if (typeof projectId !== "undefined" && entryId == projectId) {
                entryText += MenuPanel.defaultButtonHtml +
                    ` id="details-projectId-${entryId}" ` +
                    ` onclick="navigateTo('ProjectDetails.html?projectId=${entryId}')"> ` +
                    'Details </a>\n</div>' +
                    MenuPanel.defaultButtonHtml +
                    ` id="editor-projectId-${entryId}" ` +
                    ` onclick="navigateTo('ProjectEditor.html?projectId=${entryId}')"> ` +
                    'Editor </a>\n</div>' +
                    MenuPanel.defaultButtonHtml +
                    ` id="commit-projectId-${entryId}" ` +
                    ` onclick="navigateTo('ProjectCommit.html?projectId=${entryId}')"> ` +
                    'Commit </a>\n</div>' +
                    MenuPanel.defaultButtonHtml +
                    ` id="executions-projectId-${entryId}" ` +
                    ` onclick="navigateTo('ProjectExecutions.html?projectId=${entryId}')"> ` +
                    'Executions </a>';
            }
            entryText += "\n</div>";
            return entryText;
        }

        let result = "";
        for (let entry of entries) {
            result += parseEntry(entry);
        }
        return result;
    }

    static loadLeftPanel(after) {
        hideNotes();
        $('#panel').load('LeftPanel.html', function () {
            $.get({
                url: "/rest/menu",
                success: function (menuData) {
                    if (menuData.error) {
                        showNotes(menuData.message);
                    } else {
                        $('#Dashboards').append(
                            MenuPanel.parseDashboardEntries("dashboardId", "dashboardName", menuData.dashboards));
                        $('#Projects').append(MenuPanel.parseProjectEntries(menuData.projects));
                    }
                    $.parser.parse('#panel'); // Re-initialize EasyUI components
                    if (after !== undefined) {
                        after();
                    }
                }
            });
        });
    }
}
