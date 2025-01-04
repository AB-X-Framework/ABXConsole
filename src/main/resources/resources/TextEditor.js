class TextEditor {
    uxEditor;
    name;
    path;
    isExample;
    isModified;
    index
    title;

    constructor(index, title, uxEditor) {
        this.index = index;
        this.title = title;
        this.uxEditor = uxEditor;
        this.isExample = false;
        this.isModified = false;
    }

    updateTitle = function ( newTitle) {
        const filename = $("#file");
        const tab = filename.tabs('getTab', this.index);
        filename.tabs('update', {
            tab: tab, options: {
                title: newTitle
            }
        });
    }

    rename(path){
        this.path = path;
        this.name = path.substring(path.lastIndexOf("/") + 1);
        this.updateTitle( `${this.title}: ${this.name}`)
    }

    setFile(path, content) {
        this.title = "Model";
        this.uxEditor.setValue(content);
        this.uxEditor.getSession().getUndoManager().reset();
        this.path = path;
        this.isExample = false;
        this.isModified = false;
        this.name = path.substring(path.lastIndexOf("/") + 1);
        this.updateTitle( `${this.title}: ${this.name}`)
    }

    setExample(path, content) {
        this.title = "Example";
        this.uxEditor.setValue(content);
        this.uxEditor.getSession().getUndoManager().reset();
        this.path = path.substring(0,path.lastIndexOf("/"));
        this.isExample = true;
        this.isModified = false;
        this.name = path.substring(path.lastIndexOf("/") + 1);
        this.updateTitle( `${this.title}: ${this.name}`)
    }

    isModifiedFile() {
        return !this.isExample && this.isModified;
    }

    setSaved() {
        this.isModified = false;
        this.updateTitle(`${this.title}: ${this.name}`);
    }

    setModified() {
        this.isModified = true;
        this.updateTitle(`${this.title}: ${this.name} *`);
    }

    getContent(){
        return this.uxEditor.getValue();
    }

    getPath(){
        return this.path;
    }


}