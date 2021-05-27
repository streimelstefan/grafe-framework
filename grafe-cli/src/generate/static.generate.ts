import * as inquirer from 'inquirer';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as pkgDir from 'pkg-dir';
import * as path from 'path';
import messages from './generate.messages';

/**
 * Generates the CLI for creating a new static folder
 * 
 * @param argv Arguments of the CLI
 * @returns Promise<undefined>
 */
 export async function generateStaticHandler(argv: any): Promise<void> {
    
    // get root directory (where package.json is in)
    const rootDir = await pkgDir.default(process.cwd());
    
    // check if in grafe project
    if(!fs.existsSync(path.join(rootDir, 'grafe.json'))) {
        return console.error(messages.not_grafe);
    }

    let questions = [];

    // if name is not given then
    if (argv.name == undefined) {
        questions.push({
            type: 'input',
            name: 'name',
            message: messages.questions.staticHandler.name
        });
    }

    let answers = [];
    // Check if there is at least one question
    if (questions.length > 0) {
        // prompt the user the questions
        answers = await inquirer.prompt(questions);
    }

    answers.name = answers.name || argv.name;

    generateStatic(answers.name);
}

/**
 * Generate a new static folder
 * 
 * @param name name of the new static folder
 * @returns Promise<undefined>
 */
export async function generateStatic(name: string): Promise<void> {

    // prompt confirmation to user
    let confirm = await inquirer.prompt({
        message: messages.confirm,
        type: 'confirm',
        name: 'confirm'
    });

    // if not confirming abort
    if(!confirm.confirm) {
        return;
    }

    // check if length is greater then 0
    if(name.length == 0) {
        return console.error(messages.generateStatic.to_small);
    }

    // check if name has a ':' in it
    if(name.indexOf(':') != -1) {
        return console.error(messages.generateStatic.no_colon);
    }

    // get root directory (where package.json is in)
    const rootDir = await pkgDir.default(process.cwd());

    const _path = path.join(rootDir, 'src', 'static', name);

    // check if directory already exists
    if(fs.existsSync(_path)) {
        return console.error(messages.generateStatic.exists);
    }

    // create all non-existing directorys
    await mkdirp.default(_path);

    console.log(messages.generateStatic.success, _path);
}

