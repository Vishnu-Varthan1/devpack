const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// DevPack data generator
function generateDevPack(projectType, os) {
    const baseData = {
        projectType,
        os,
        tools: [],
        installCommands: '',
        createCommands: '',
        dependencies: '',
        extensions: [],
        folderStructure: '',
        templateFile: '',
        quickstart: '',
        copyBlocks: {
            install: '',
            create: '',
            run: ''
        }
    };

    switch (projectType) {
        case 'react':
            baseData.tools = ['Node.js', 'npm'];
            baseData.installCommands = os === 'Windows' ? 'choco install nodejs' : os === 'macOS' ? 'brew install node' : 'sudo apt install nodejs npm';
            baseData.createCommands = 'npx create-react-app myapp && cd myapp && npm start';
            baseData.dependencies = '';
            baseData.extensions = ['ms-vscode.vscode-typescript-next', 'bradlc.vscode-tailwindcss'];
            baseData.folderStructure = `myapp/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── App.js
│   ├── index.js
│   └── components/
└── package.json`;
            baseData.templateFile = 'react-starter.zip';
            baseData.quickstart = '1. Run the create command\n2. Open in VS Code\n3. Install extensions\n4. Start developing';
            baseData.copyBlocks.install = baseData.installCommands;
            baseData.copyBlocks.create = baseData.createCommands;
            baseData.copyBlocks.run = 'cd myapp && npm start';
            break;

        case 'mern':
            baseData.tools = ['Node.js', 'npm', 'MongoDB'];
            baseData.installCommands = os === 'Windows' ? 'choco install nodejs mongodb' : os === 'macOS' ? 'brew install node mongodb-community' : 'sudo apt install nodejs npm mongodb';
            baseData.createCommands = 'mkdir mern-app && cd mern-app && npx create-react-app client && mkdir server && cd server && npm init -y && npm install express cors mongoose && printf "const express=require(\'express\');const app=express();app.listen(5000);" > index.js';
            baseData.dependencies = '';
            baseData.extensions = ['ms-vscode.vscode-typescript-next', 'ms-vscode.vscode-json', 'mongodb.mongodb-vscode'];
            baseData.folderStructure = `mern-app/
├── client/
│   ├── public/
│   ├── src/
│   └── package.json
└── server/
    ├── index.js
    ├── models/
    ├── routes/
    └── package.json`;
            baseData.templateFile = 'mern-starter.zip';
            baseData.quickstart = '1. Run the create command\n2. Start MongoDB\n3. Run server: cd server && node index.js\n4. Run client: cd client && npm start';
            baseData.copyBlocks.install = baseData.installCommands;
            baseData.copyBlocks.create = baseData.createCommands;
            baseData.copyBlocks.run = 'cd mern-app/server && node index.js && cd ../client && npm start';
            break;

        case 'fullstack':
            baseData.tools = ['Node.js', 'npm'];
            baseData.installCommands = os === 'Windows' ? 'choco install nodejs' : os === 'macOS' ? 'brew install node' : 'sudo apt install nodejs npm';
            baseData.createCommands = 'mkdir fullstack && cd fullstack && npx create-react-app client && mkdir server && cd server && npm init -y && npm install express cors && echo "const express=require(\'express\');const app=express();app.listen(5000);" > index.js';
            baseData.dependencies = '';
            baseData.extensions = ['ms-vscode.vscode-typescript-next', 'ms-vscode.vscode-json'];
            baseData.folderStructure = `fullstack/
├── client/
│   ├── public/
│   ├── src/
│   └── package.json
└── server/
    ├── index.js
    ├── routes/
    └── package.json`;
            baseData.templateFile = 'fullstack.zip';
            baseData.quickstart = '1. Run the create command\n2. Run server: cd server && node index.js\n3. Run client: cd client && npm start';
            baseData.copyBlocks.install = baseData.installCommands;
            baseData.copyBlocks.create = baseData.createCommands;
            baseData.copyBlocks.run = 'cd fullstack/server && node index.js && cd ../client && npm start';
            break;

        case 'node-api':
            baseData.tools = ['Node.js', 'npm'];
            baseData.installCommands = os === 'Windows' ? 'choco install nodejs' : os === 'macOS' ? 'brew install node' : 'sudo apt install nodejs npm';
            baseData.createCommands = 'mkdir api && cd api && npm init -y && npm install express cors && printf "const express=require(\'express\');const app=express();app.listen(3000);" > index.js';
            baseData.dependencies = '';
            baseData.extensions = ['ms-vscode.vscode-json', 'ms-vscode.vscode-typescript-next'];
            baseData.folderStructure = `api/
├── index.js
├── routes/
├── models/
└── package.json`;
            baseData.templateFile = 'api-starter.zip';
            baseData.quickstart = '1. Run the create command\n2. Start the server: node index.js\n3. Test endpoints with Postman';
            baseData.copyBlocks.install = baseData.installCommands;
            baseData.copyBlocks.create = baseData.createCommands;
            baseData.copyBlocks.run = 'cd api && node index.js';
            break;

        case 'nextjs':
            baseData.tools = ['Node.js', 'npm'];
            baseData.installCommands = os === 'Windows' ? 'choco install nodejs' : os === 'macOS' ? 'brew install node' : 'sudo apt install nodejs npm';
            baseData.createCommands = 'npx create-next-app@latest mynextapp --ts --tailwind --eslint && cd mynextapp && npm run dev';
            baseData.dependencies = '';
            baseData.extensions = ['ms-vscode.vscode-typescript-next', 'bradlc.vscode-tailwindcss', 'ms-vscode.vscode-eslint'];
            baseData.folderStructure = `mynextapp/
├── pages/
│   ├── index.tsx
│   └── _app.tsx
├── components/
├── styles/
├── public/
└── package.json`;
            baseData.templateFile = 'next-starter.zip';
            baseData.quickstart = '1. Run the create command\n2. Open in VS Code\n3. Install extensions\n4. Start developing at http://localhost:3000';
            baseData.copyBlocks.install = baseData.installCommands;
            baseData.copyBlocks.create = baseData.createCommands;
            baseData.copyBlocks.run = 'cd mynextapp && npm run dev';
            break;

        case 'python-ai':
            baseData.tools = ['Python', 'pip'];
            baseData.installCommands = os === 'Windows' ? 'choco install python' : os === 'macOS' ? 'brew install python' : 'sudo apt install python3 python3-pip';
            baseData.createCommands = 'mkdir ai-app && cd ai-app && python -m venv venv && source venv/bin/activate || venv\\Scripts\\activate && pip install openai flask && echo "from flask import Flask; app=Flask(__name__); @app.route(\'/\')\ndef home(): return \'AI App Ready\'; app.run()" > app.py && python app.py';
            baseData.dependencies = '';
            baseData.extensions = ['ms-python.python', 'ms-python.vscode-pylance'];
            baseData.folderStructure = `ai-app/
├── venv/
├── app.py
├── requirements.txt
└── models/`;
            baseData.templateFile = 'python-ai.zip';
            baseData.quickstart = '1. Run the create command\n2. Activate venv: source venv/bin/activate\n3. Run: python app.py\n4. Access at http://localhost:5000';
            baseData.copyBlocks.install = baseData.installCommands;
            baseData.copyBlocks.create = baseData.createCommands;
            baseData.copyBlocks.run = 'cd ai-app && source venv/bin/activate && python app.py';
            break;

        case 'flutter':
            baseData.tools = ['Flutter', 'Dart'];
            baseData.installCommands = os === 'Windows' ? 'choco install flutter' : os === 'macOS' ? 'brew install flutter' : 'sudo snap install flutter --classic';
            baseData.createCommands = 'flutter create myflutterapp && cd myflutterapp && flutter run';
            baseData.dependencies = '';
            baseData.extensions = ['dart-code.flutter', 'dart-code.dart-code'];
            baseData.folderStructure = `myflutterapp/
├── lib/
│   ├── main.dart
│   └── screens/
├── android/
├── ios/
├── web/
└── pubspec.yaml`;
            baseData.templateFile = 'flutter.zip';
            baseData.quickstart = '1. Run the create command\n2. Connect device or start emulator\n3. Run: flutter run\n4. Start developing';
            baseData.copyBlocks.install = baseData.installCommands;
            baseData.copyBlocks.create = baseData.createCommands;
            baseData.copyBlocks.run = 'cd myflutterapp && flutter run';
            break;

        default:
            throw new Error('Unknown project type');
    }

    return baseData;
}

// API endpoint
app.post('/generateDevPack', (req, res) => {
    const { projectType, os } = req.body;

    if (!projectType || !os) {
        return res.status(400).json({ error: 'Missing projectType or os' });
    }

    try {
        const devPack = generateDevPack(projectType, os);
        res.json(devPack);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`DevPack backend running on http://localhost:${PORT}`);
});