class DualEditor {
    editorModel;

    fileOpened() {
        const openedFile = this.editorModel.name;
        if (editorUX.saveDialog === null) {
            editorUX.saveDialog = $(`<div id="dlg"  title="File modified" 
                data-options="iconCls:'icon-tip', buttons: [{
                text:'Ok',
                    text:'Save changes',
                    iconCls:'icon-save',
                    handler:()=>{$(editorUX.saveDialog).dialog('close') ; editorUX.saveFile(editorUX.nextFileManagerAction);}
                },{
                    text:'Discard changes',
                    iconCls:'icon-no',
                    handler:()=>{$(editorUX.saveDialog).dialog('close') ; editorUX.nextFileManagerAction();}
                }]" 
                style="width:400px;height:200px;padding:10px">File  <span id="fileModified">${openedFile}</span> modified.\nWhat do you want to do?    
            </div>`).dialog();
        } else {
            $("#fileModified").html(openedFile);
            $(editorUX.saveDialog).dialog("open");
        }
    }


    showExample(path) {
        editorUX.nextFileManagerAction = () => $.get(
            `utils/getFile?path=${encodeURIComponent(path)}`, (content) => {
                this.editorModel.setExample(path, content);
            });
        if (this.editorModel.isModifiedFile()) {
            this.fileOpened();
        } else {
            editorUX.nextFileManagerAction();
        }

    }

    update(path) {
        editorUX.nextFileManagerAction = () => {
            $.get(`file/getFile?path=${encodeURIComponent(path)}`, (content) => {
                this.editorModel.setFile(path, content);
            });
        }
        if (this.editorModel.isModifiedFile()) {
            this.fileOpened();
        } else {
            editorUX.nextFileManagerAction();
        }
    }

    saveFileTemp(editor, next) {
        const queryString = "file/saveFile" + "?path=" +
            encodeURIComponent(editor.getPath());
        const data = {
            "data": editor.getContent()
        }
        $.post(queryString, JSON.stringify(data), () => {
            editor.setSaved();
            if (typeof next === "function") {
                next();
            }
        });
    }

    saveFile(next) {
        this.saveFileTemp(this.editorModel, next);
    }

    getContent() {
        return this.editorModel.getContent();
    }

    execute() {
        $("#mainTabs").tabs("select", 1);
        const data = {}
        if (this.editorModel.isExample) {
            data["modelType"] = "example";
            data["name"] = this.editorModel.name;
            data["path"] = this.editorModel.path+"/"+ this.editorModel.name;
            data["model"] = this.editorModel.getContent();
        } else {
            this.saveFileTemp(this.editorModel);
            data["modelType"] = "file";
            data["model"] = this.editorModel.path;
        }
        data["optimizationLevel"] = $('#optimizationLevel').combobox('getValue');
        data["simulationType"] = $('#simulationType').combobox('getValue');

        $.ajax({
            url: "framework/simulate",
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
        });
    }

    rename(path){
        this.editorModel.rename(path);
    }
    updateSelectedTab(selectedTab) {
        this.selectedTab = selectedTab;
    }

    constructor(editorModel) {
        this.editorModel = editorModel;
    }

}