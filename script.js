class Folder {
    constructor(node) {
        this.node = node.querySelector('ul');
        this.name = node.querySelector('span').innerText;
        node.querySelector('span').addEventListener('click', this.handleClick);
        this.innerFolders = {};
        this.innerFiles = {};
        if (!this.node)
            return;

        for (let child of this.node.children) {
            if (child.classList.contains('file')) {
                let key = child.querySelector('span').innerText;
                this.innerFiles[key] = child
            } else {
                let key = child.querySelector('span').innerText;
                this.innerFolders[key] = new Folder(child);
            }
        }
    }

    handleClick(event) {
        const parentNode = event.target.parentNode;
        const targetNode = parentNode.querySelector('ul');
        if (!targetNode)
            return;

        if (targetNode.classList.contains('hidden')) {
            targetNode.classList.remove('hidden');
        } else {
            const childrenContainers = parentNode.querySelectorAll('ul');
            if (!childrenContainers)
                return;

            childrenContainers.forEach(container => { container.classList.add('hidden') });
        }
    }

    addFile(fileName) {
        if (this.innerFiles[fileName])
            return;

        let newFile = document.createElement('li');
        newFile.innerHTML = `<span>${fileName}</span>`;
        newFile.classList.add('file');
        this.node.append(newFile);
        this.innerFiles[fileName] = newFile;
    }

    addFolder(name) {
        if (this.innerFolders[name])
            return;

        let newFolder = document.createElement('li');
        newFolder.classList.add('folder');
        newFolder.innerHTML = `<span>${name}</span><ul></ul>`;
        this.node.append(newFolder);
        this.innerFolders[name] = new Folder(newFolder);
    }
}

function handleButtonClick(root) {
    const input = document.querySelector('input');
    if (!input.value || input.value.length === 0)
        return;

    let path = input.value.split('/');
    if (path.length < 2 || root.name !== path[1])
        return;

    const fileName = path.slice(path.length - 1)[0];
    path = path.slice(1, length - 1);
    if (!fileName.includes('.'))
        return;

    let currentFolder = root;
    for (let i = 0; i < path.length - 1; i++) {
        if (currentFolder.name !== path[i])
            return; // бан

        if (!currentFolder.innerFolders[path[i + 1]]) {
            // снова можно создать директорию, но нужно ли?
            currentFolder.addFolder(path[i + 1]);
            currentFolder = currentFolder.innerFolders[path[i + 1]];
            // return
        } else {
            currentFolder = currentFolder.innerFolders[path[i + 1]]
        }
    }
    currentFolder.addFile(fileName)
}

function init() {
    const root = new Folder(document.querySelector('.root'));
    document.querySelector('button').addEventListener('click', handleButtonClick.bind(null, root))
}

init();