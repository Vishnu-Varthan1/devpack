// Global variables
let selectedProjectType = null;
let detectedOS = null;

// OS Detection
function detectOS() {
    const platform = navigator.platform.toLowerCase();
    if (platform.includes('win')) {
        return 'Windows';
    } else if (platform.includes('mac')) {
        return 'macOS';
    } else {
        return 'Linux';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    detectedOS = detectOS();
    document.getElementById('os-display').textContent = detectedOS;

    // Project selection
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            cards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            selectedProjectType = this.dataset.type;
            document.getElementById('generate-btn').disabled = false;
        });
    });

    // Generate button
    document.getElementById('generate-btn').addEventListener('click', generateDevPack);

    // Back buttons
    document.getElementById('back-btn').addEventListener('click', () => showScreen('home-screen'));
    document.getElementById('back-to-output-btn').addEventListener('click', () => showScreen('output-screen'));

    // Download template button
    document.getElementById('download-template-btn').addEventListener('click', () => showScreen('download-screen'));

    // Copy buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.dataset.target;
            const text = document.getElementById(target).textContent;
            copyToClipboard(text);
        });
    });

    // Copy all button
    document.getElementById('copy-all-btn').addEventListener('click', copyAllCommands);

    // Download buttons
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const template = this.dataset.template;
            downloadTemplate(template);
        });
    });
});

// Show screen
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// Generate DevPack
async function generateDevPack() {
    if (!selectedProjectType) return;

    try {
        const response = await fetch('http://localhost:3000/generateDevPack', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                projectType: selectedProjectType,
                os: detectedOS
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate DevPack');
        }

        const data = await response.json();
        renderDevPack(data);
        showScreen('output-screen');
    } catch (error) {
        alert('Error generating DevPack: ' + error.message);
    }
}

// Render DevPack results
function renderDevPack(data) {
    // Tools
    const toolsList = document.getElementById('tools-list');
    toolsList.innerHTML = '';
    data.tools.forEach(tool => {
        const li = document.createElement('li');
        li.textContent = tool;
        toolsList.appendChild(li);
    });

    // Commands
    document.getElementById('install-commands').textContent = data.installCommands;
    document.getElementById('create-commands').textContent = data.createCommands;
    document.getElementById('dependencies').textContent = data.dependencies;

    // Extensions
    const extensionsList = document.getElementById('extensions-list');
    extensionsList.innerHTML = '';
    data.extensions.forEach(ext => {
        const li = document.createElement('li');
        li.textContent = ext;
        extensionsList.appendChild(li);
    });

    // Folder structure
    document.getElementById('folder-structure').textContent = data.folderStructure;

    // Quickstart
    const quickstartList = document.getElementById('quickstart-list');
    quickstartList.innerHTML = '';
    data.quickstart.split('\n').forEach(step => {
        if (step.trim()) {
            const li = document.createElement('li');
            li.textContent = step.trim();
            quickstartList.appendChild(li);
        }
    });
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Copied to clipboard!');
    });
}

// Copy all commands
function copyAllCommands() {
    const install = document.getElementById('install-commands').textContent;
    const create = document.getElementById('create-commands').textContent;
    const deps = document.getElementById('dependencies').textContent;
    const all = `Install Commands:\n${install}\n\nCreate Commands:\n${create}\n\nDependencies:\n${deps}`;
    copyToClipboard(all);
}

// Download template
function downloadTemplate(template) {
    // For demo, download the JSON configuration as a file
    const projectType = template.replace('-starter.zip', '').replace('.zip', '');
    const os = detectedOS;

    fetch('http://localhost:3000/generateDevPack', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            projectType: projectType,
            os: os
        })
    })
    .then(response => response.json())
    .then(data => {
        // Create and download JSON file
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

        const exportFileDefaultName = `${projectType}-devpack-${os.toLowerCase()}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    })
    .catch(error => {
        alert('Error downloading template: ' + error.message);
    });
}