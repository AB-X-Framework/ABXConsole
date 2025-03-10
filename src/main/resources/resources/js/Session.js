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
            ` id="${entryId}-${entry[entryId]}" ` +
            ' style="width: 100%; text-align: left;"\n' +
            ` onclick="navigateTo('${url + entry[entryId]}')"> ` +
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
                        parseEntries("DashboardDetails.html?id=", "dashboardId", "dashboardName", menuData.dashboards));
                    $('#Projects').append(
                        parseEntries("ProjectDetails.html?id=", "projectId", "projectName", menuData.projects));
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

    static addRepo() {
        $.get("/resources/Repository.html", function (data) {
            $("#RepositoryPlaceHolder").append(data.replaceAll("REPOID", Repository.counter));
            $.parser.parse(`#Repo${Repository.counter}-panel`);
            Repository.counter += 1;
        });
    }

    static getRepos() {
        let repos =[];
        for (let i = 0; i < Repository.counter; ++i) {
            if (i in Repository.removed) {
                continue;
            }
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
        repo.engine = $(`#TypeRepo${repoId}-type`).combobox("getValue");
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