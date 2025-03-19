class Repository {
    static counter = 0;

    static removed = [];

    static removeRepo(id, repoActionType) {
        if (repoActionType === 'new') {
            $(`#Repo${id}-panel`).hide();
            Repository.removed.push(id);
        }else {
            $.messager.confirm('Confirm', 'Are you sure you want to delete?', function (r) {
                if (r) {
                    let repoName =  $(`#Repo${id}-original`).val();
                    $.ajax({
                        "type": "DELETE",
                        "url":  `/rest/projects/${projectId}/repo/${repoName}`,
                        "success": function (response) {
                            if (response.error) {
                                showNotes(response.message)
                            } else {
                                $(`#Repo${id}-panel`).hide();
                                Repository.removed.push(id);
                            }
                        }
                    });
                }
            });
        }
    }

    static updateRepo(id){
        let repo = Repository.collectRepoData(id);
        let repoName =  $(`#Repo${id}-original`).val();
        repo.name = $(`#Repo${i}-name`).textbox("getValue");
        $.post({
            "headers": {   "Method": "PATCH"  },
            "url":  `/gateway/persistence/persistence/projects/${projectId}/repo/${repoName}`,
            "success": function (response) {
                if (response.error) {
                    showNotes(response.message)
                } else {
                    $(`#Repo${repoId}-status`).html("Repository credentials updated.");
                }
            }
        });
    }

    /**
     * Add repo
     * @param id
     */
    static addNewRepo(id){

    }

    static addRepo(after, repoActionType) {
        $.get("/resources/Repository.html", function (data) {
            const currRepo = Repository.counter;
            $("#RepositoryPlaceHolder").append(data
                .replaceAll("REPOIDCreateProject", repoActionType)
                .replaceAll("REPOID", currRepo));
            $.parser.parse(`#Repo${Repository.counter}-panel`);
            if (typeof after !== "undefined") {
                after(currRepo);
            }
            switch (repoActionType){
                case 'new':{
                    $(`#Repo${currRepo}-update`).hide();
                    $(`#Repo${currRepo}-add`).hide();
                    break;
                }
                case 'add':{
                    $(`#Repo${currRepo}-check`).hide();
                    $(`#Repo${currRepo}-update`).hide();
                    break;
                }
                case 'update':{
                    $(`#Repo${currRepo}-check`).hide();
                    $(`#Repo${currRepo}-add`).hide();
                    break;
                }
            }
            Repository.counter += 1;
        });

    }

    static getRepos() {
        let repos = [];
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

    static checkRepo(repoId) {
        $(`#Repo${repoId}-status`).html("Checking credentials.");
        $.post({
            "url": "/gateway/repository/repository/validate",
            "data":Repository.collectRepoData(repoId),
            "success": function (response) {
                if (response.error) {
                    showNotes(response.message)
                } else {
                    if (response) {
                        $(`#Repo${repoId}-status`).html("Repository credentials are valid.");
                    } else {
                        $(`#Repo${repoId}-status`).html("Repository credentials are invalid.");
                    }
                }
            }
        });
    }

    static collectRepoData(repoId) {
        let repo = {};
        let creds = {};
        repo.engine = $(`#TypeRepo${repoId}-engine`).combobox("getValue");
        repo.url = $(`#Repo${repoId}-URL`).textbox("getValue");
        repo.branch = $(`#Repo${repoId}-branch`).textbox("getValue");
        if (repo.engine === "Git") {
            let credsType = $(`#Repo${repoId}-creds`).combobox("getValue");
            if (credsType !== "public") {
                creds.type = credsType;
                if (credsType === "username") {
                    creds.username = $(`#Repo${repoId}-username`).textbox("getValue");
                    creds.password = $(`#Repo${repoId}-password`).passwordbox("getValue");
                } else {
                    creds.ssh = $(`#Repo${repoId}-ssh`).textbox("getValue");
                }
            }
            repo.engine = $(`#TypeRepo${repoId}-type`).combobox("getValue");
        }
        repo.creds = JSON.stringify(creds);
        return repo;
    }

}