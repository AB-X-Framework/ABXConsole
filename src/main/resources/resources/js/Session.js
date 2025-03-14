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


function parseEntries(type, entryId, entryName, entries) {
    let details;
    let editor;
    let commit;
    switch (type){
        case "dashboard":
            details = "DashboardDetails.html?id=";
            editor = "DashboardEditor.html?id=";
            commit = "DashboardCommit.html?id=";
            break;
        case "project":
            details = "ProjectDetails.html?projectId=";
            editor = "ProjectEditor.html?projectId=";
            commit = "ProjectCommit.html?projectId=";
            execution = "ProjectCommit.html?projectId=";
            break;
    }
    function parseEntry(entry) {
        let defaultButtonHtml =  '<div style="margin-bottom:5px;"> <a href="#"  class="easyui-linkbutton"  style="margin-left: 5%; width: 95%; text-align: left;"';
        let entryText= '<div style="margin-bottom:5px;">\n' +
            ' <a href="#"  class="easyui-linkbutton" ' +
            ` id="${entryId}-${entry[entryId]}" ` +
            ' style="width: 100%; text-align: left;"\n' +
            ` onclick="navigateTo('${details + entry[entryId]}')"> `+

            entry[entryName] + '</a>\n</div>' ;

        if (type  == "project" && typeof projectId !== "undefined" && entry[entryId] == projectId) {
            entryText+= defaultButtonHtml+
                ` id="details-${entryId}-${entry[entryId]}" ` +
                ` onclick="navigateTo('${details + entry[entryId]}')"> ` +
                'Details </a>\n</div>' +
                defaultButtonHtml +
                ` id="editor-${entryId}-${entry[entryId]}" ` +
                ` onclick="navigateTo('${editor + entry[entryId]}')"> ` +
                'Editor </a>\n</div>' +
                defaultButtonHtml +
                ` id="commit-${entryId}-${entry[entryId]}" ` +
                ' style="margin-left: 5%; width: 95%; text-align: left;"\n' +
                ` onclick="navigateTo('${commit + entry[entryId]}')"> ` +
                'Commit </a>\n</div>' +
                defaultButtonHtml+
                ` id="commit-${entryId}-${entry[entryId]}" ` +
                ` onclick="navigateTo('${commit + entry[entryId]}')"> ` +
                'Executions </a>';
        }
        entryText+="\n</div>";
        return entryText;
    }

    let result = "";
    for (let entry of entries) {
        //debugger;
        result += parseEntry(entry);
    }
    return result;
}

function parseProjectEntries( entries) {
    function parseEntry(entry) {
        let entryId = entry["projectId"];
        let entryText= '<div style="margin-bottom:5px;">\n' +
            ' <a href="#"  class="easyui-linkbutton" ' +
            ` id="${entryId}-${entry[entryId]}" ` +
            ' style="width: 100%; text-align: left;"\n' +
            ` onclick="navigateTo('ProjectDetails.html?projectId=${entryId}')"> `+

            entry["projectName"] + '</a>\n</div>' ;

        if (typeof projectId !== "undefined" && entryId == projectId) {
            entryText+= '<div style="margin-bottom:5px;">' +
                ' <a href="#"  class="easyui-linkbutton" ' +
                ` id="details-projectId-${entryId}" ` +
                ' style="margin-left: 5%; width: 95%; text-align: left;"\n' +
                ` onclick="navigateTo('ProjectDetails.html?projectId=${ entryId}')"> ` +
                'Details </a>\n</div>' +
                '<div style="margin-bottom:5px;">' +
            ' <a href="#"  class="easyui-linkbutton" ' +
            ` id="editor-projectId-${entryId}" ` +
            ' style="margin-left: 5%; width: 95%; text-align: left;"\n' +
            ` onclick="navigateTo('ProjectEditor.html?projectId=${entryId}')"> ` +
            'Editor </a>\n</div>' +
            '<div style="margin-bottom:5px;">' +
            ' <a href="#"  class="easyui-linkbutton" ' +
            ` id="commit-projectId-${entryId}" ` +
            ' style="margin-left: 5%; width: 95%; text-align: left;"\n' +
            ` onclick="navigateTo('ProjectCommit.html?projectId=${entryId}')"> ` +
            'Commit </a>\n</div>' +
            '<div style="margin-bottom:5px;">' +
            ' <a href="#"  class="easyui-linkbutton" ' +
            ` id="executions-projectId-${entryId}" ` +
            ' style="margin-left: 5%; width: 95%; text-align: left;"\n' +
            ` onclick="navigateTo('ProjectExecutions.html?projectId=${entryId}')"> ` +
            'Executions </a>';
        }
        entryText+="\n</div>";
        return entryText;
    }

    let result = "";
    for (let entry of entries) {
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
                        parseEntries("dashboard", "dashboardId", "dashboardName", menuData.dashboards));
                    $('#Projects').append( parseProjectEntries( menuData.projects));
                    $('#Executions').append(
                        parseEntries("Dashboard.html?id=", "execId", "execName", menuData.execs));
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
    static counter = 0;

    static removed = [];

    static removeRepository(id) {
        $(`#Repo${id}-panel`).hide();
        Repository.removed.push(id);
    }

    static addRepo(after) {
        $.get("/resources/Repository.html", function (data) {
            const currRepo = Repository.counter;
            $("#RepositoryPlaceHolder").append(data.replaceAll("REPOID", currRepo));
            $.parser.parse(`#Repo${Repository.counter}-panel`);
            if (typeof after !== "undefined"){
                after(currRepo);
            }
            Repository.counter += 1;

        });

    }

    static getRepos() {
        let repos =[];
        for (let i = 0; i < Repository.counter; ++i) {
            if (i in Repository.removed) {
                continue;
            }
            $(`#Repo${i}-status`).html("");
            let repo = Repository.collectRepoData(i);
            repo.id = i;
            repo.name = $(`#Repo${i}-name`).textbox("getValue");
            repos.push(repo);
        }
        return repos;
    }

    static checkRepo(repoId){
        $(`#Repo${repoId}-status`).html("Checking credentials.");
        $.post({
            "url":"/rest/repo/validate",
            "data":{"repoData":JSON.stringify(Repository.collectRepoData(repoId))},
            "success": function (response) {
                if (response.error) {
                    showNotes(response.message)
                } else {
                    if (response.valid){
                        $(`#Repo${repoId}-status`).html("Repository credentials are valid.");
                    }else {
                        $(`#Repo${repoId}-status`).html("Repository credentials are invalid.");
                    }
                }
            }
        });
    }

    static collectRepoData(repoId){
        let repo = {};
        let creds={};
        repo.engine = $(`#TypeRepo${repoId}-engine`).combobox("getValue");
        repo.url = $(`#Repo${repoId}-URL`).textbox("getValue");
        repo.branch = $(`#Repo${repoId}-branch`).textbox("getValue");
        if (repo.engine === "Git"){
            let credsType = $(`#Repo${repoId}-creds`).combobox("getValue");
            if (credsType!== "public"){
                creds.type= credsType;
                if (credsType==="username"){
                    creds.username =  $(`#Repo${repoId}-username`).textbox("getValue");
                    creds.password =  $(`#Repo${repoId}-password`).passwordbox("getValue");
                }else{
                    creds.ssh =  $(`#Repo${repoId}-ssh`).textbox("getValue");
                }
            }
            repo.engine = $(`#TypeRepo${repoId}-type`).combobox("getValue");
        }
        repo.creds = JSON.stringify(creds);
        return repo;
    }

}