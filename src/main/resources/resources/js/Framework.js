/**
 * Handles Edition
 * @returns {EditorUX}
 * @constructor
 */

var editorUX;

EditorUX = function () {
    let lastSelected;
    let lastSelectedFolder;
    let dualEditor;
    let saveDialog;

    this.createNewFileDialog = function (type) {
        if (this.saveAsDialog === null) {
            this.saveAsDialog = $(`<div id="saveAsDialog"  title="Select new name." 
                data-options="iconCls:'icon-save', 
                buttons: [{
                text:'Ok',
                    text:'Accept',
                    iconCls:'icon-save',
                    handler:()=>{$(editorUX.saveAsDialog).dialog('close');editorUX.nextFileManagerAction(); }
                },{
                    text:'Cancel',
                    iconCls:'icon-no',
                    handler:()=>{$(editorUX.saveAsDialog).dialog('close');}
                }]" 
                style="width:400px;height:200px;padding:10px">
                <p id="newFilePath">Current folder ${lastSelectedFolder.path}</p>
                New <span id="filetype">${type}</span> name:<br/>
                <input id="saveAsName" class="easyui-textbox" 
                labelPosition="top"  
                style="width:100%;">
            </div>`).dialog();
        } else {
            $("#filetype").html(type);
            $(this.saveAsDialog).dialog("open");
            $("#saveAsName").val("");
            $("#newFilePath").html("Current folder " + lastSelectedFolder.path);
        }
    }

    this.saveFileAs = function () {
        this.nextFileManagerAction = this.saveFileAsTemp;
        this.createNewFileDialog("file");
    }

    this.newFolder = function () {
        this.nextFileManagerAction = this.newFolderTemp;
        this.createNewFileDialog("folder");
    }

    this.newFile = function () {
        this.nextFileManagerAction = this.newFileTemp;
        this.createNewFileDialog("file");
    }

    this.rename = function () {
        if (this.renameDialog === null) {
            this.renameDialog = $(`<div id="renameDialog"  title="Select new name." 
                data-options="iconCls:'icon-save', 
                buttons: [{
                text:'Ok',
                    text:'Accept',
                    iconCls:'icon-save',
                    handler:()=>{$(editorUX.renameDialog).dialog('close');editorUX.renameTemp(); }
                },{
                    text:'Cancel',
                    iconCls:'icon-no',
                    handler:()=>{$(editorUX.renameDialog).dialog('close');}
                }]" 
                style="width:400px;height:200px;padding:10px">
                <p id="newFilePath">Current folder ${lastSelectedFolder.path}</p>
                New name:<br/>
                <input id="newName" class="easyui-textbox"   labelPosition="top" value="${lastSelected.path}"   style="width:100%;">
            </div>`).dialog();
        } else {
            $(this.renameDialog).dialog("open");
            $("#newName").val(lastSelected.path);
            $("#newFilePath").html("Current folder " + lastSelectedFolder.path);
        }
    }

    this.renameTemp = function () {
        const  newPath =$("#newName").val();
        $.get("file/renameFile?original="+encodeURIComponent(lastSelected.path)
            +"&newPath="+encodeURIComponent(newPath),()=>{
            $(' #fileSelector').treegrid('reload', lastSelectedFolder.id);
            dualEditor.rename(newPath);
        });

    }

    this.deleteFile = function () {
        $.get("file/deleteFile?path=" + encodeURIComponent(lastSelected.path), () => {
            if (lastSelectedFolder === null|| lastSelected.path === lastSelectedFolder.path ) {
                $(' #fileSelector').treegrid('reload');
            }else {
                $(' #fileSelector').treegrid('reload', lastSelectedFolder.id);
            }
        });
    }

    this.delete = function () {
        const type = lastSelected.type;
        const name = lastSelected.path;
        if (this.deleteDialog === null) {
            this.deleteDialog = $(`<div id="deleteDialog"  title="Delete ${type}" 
                data-options="iconCls:'icon-tip', 
                buttons: [{
                text:'Ok',
                    text:'Delete',
                    iconCls:'icon-no',
                    handler:()=>{$(editorUX.deleteDialog).dialog('close');editorUX.deleteFile(); }
                },{
                    text:'Do not delete',
                    iconCls:'icon-ok',
                    handler:()=>{$(editorUX.deleteDialog).dialog('close');}
                }]" 
                style="width:400px;height:200px;padding:10px">
                Do you want to delete the <span id="deleteType">${type}</span>: <span id="deleteName">${name}</span>?
            </div>`).dialog();
        } else {
            $("#deleteType").html(type);
            $("#deleteName").html(name);
            $(this.deleteDialog).dialog("setTitle", "Delete " + type);
            $(this.deleteDialog).dialog("open");
        }
    }

    this.saveAndOpen = function (dataToSave) {
        const path = lastSelectedFolder.path + "/" + $("#saveAsName").val();
        const queryString = "file/saveFile?path=" +
            encodeURIComponent(path);
        const data = {
            "data": dataToSave
        }
        $.post(queryString, JSON.stringify(data), (id) => {
            $(editorUX.saveAsDialog).dialog("close");
            if (lastSelected === null) {
                $(' #fileSelector').treegrid('reload');
            } else {
                $(' #fileSelector').treegrid('reload', lastSelectedFolder.id);
                setTimeout(() =>
                    $(' #fileSelector').treegrid('select', id), 100
                );
            }
        });
    }

    this.saveFileAsTemp = function () {
        this.saveAndOpen(dualEditor.getContent());
    }

    this.newFileTemp = function () {
        this.saveAndOpen("");
    }

    this.newFolderTemp = function () {
        const folderName = encodeURIComponent(
            lastSelectedFolder.path + "/" + $("#saveAsName").val())
        $.get(`file/mkdir?path=${folderName}`, (id) => {

            $(' #fileSelector').treegrid('reload', lastSelectedFolder.id);
            setTimeout(() =>
                $(' #fileSelector').treegrid('select', id), 500);
        });
    }

    this.saveFile = function (next) {
        dualEditor.saveFile(next);
    }

    this.execute = function () {
        dualEditor.execute();
    };

    this.update = function (selectedPath) {

        $(' #exampleLib').treegrid('unselectAll');
        lastSelected = selectedPath;
        const path = selectedPath.path;
        if (selectedPath.type === "folder") {
            lastSelectedFolder = selectedPath;
            return;
        }
        lastSelectedFolder = {
            path: path.substring(0, path.lastIndexOf("/")),
            id: lastSelected._parentId
        }
        dualEditor.update(path);
    }

    this.step = function () {
        $.get("framework/step");
    };

    this.pause = function () {
        $.get("framework/pause");
    };
    /**
     * Full stop the simulation
     */
    this.stop = function () {
        $.get("framework/stop");
    };

    this.clear = function () {
        $.get("framework/clear");
    };

    this.simulate = function () {
        $.get("framework/simulate");
    };

    this.execWhile = function () {
        const content = {
            "content": $("#execWhile").textbox("getValue")
        };
        $.ajax({
            url: "framework/execWhile",
            type: "POST",
            data: JSON.stringify(content),
            contentType: "application/json; charset=utf-8"
        });
    }

    this.evaluate = function () {
        const content = {
            "content": $("#evaluate").textbox("getValue")
        };
        $.ajax({
            url: "framework/evaluate",
            type: "POST",
            data: JSON.stringify(content),
            contentType: "application/json; charset=utf-8",
            success: (result) => {
                $("#evalOutput").html(result.replaceAll(" ","&nbsp;").replaceAll("\n", "<br/>"));
            }
        });
    };

    this.showExample =function (selectedPath){
        $(' #fileSelector').treegrid('unselectAll');
        if (selectedPath.type !== "folder") {
            dualEditor.showExample(selectedPath.path);
        }
    }


    this.setup = function () {
        const self = this;
        lastSelected = null;
        lastSelectedFolder = {path: "", id: 0};

        this.saveDialog = null;
        this.renameDialog = null;
        this.saveAsDialog = null;
        this.deleteDialog = null;

        const jsModel = ace.edit("modelEditor");
        jsModel.setTheme("ace/theme/monokai");
        jsModel.session.setMode("ace/mode/typescript");
        jsModel.setOptions({
            fontSize: "12pt"
        });
        const editorModel = new TextEditor(0, "Model", jsModel);
        jsModel.session.on('change', function (delta) {
            editorModel.setModified();
        });
        dualEditor = new DualEditor(editorModel);
        dualEditor.showExample("Hello World.js");
    };
    return this;
};

$(document).ready(() => {
    editorUX = new EditorUX();
    editorUX.setup();
});