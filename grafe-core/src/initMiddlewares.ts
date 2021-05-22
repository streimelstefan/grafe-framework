import { Config, Middleware } from './config';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Creates the middleware links in the config checks if the middlewares are existant
 * and if they are consistant laods the mw functions
 * @param config the config to insert the middlewares !will edit the config!
 */
export function initMiddlewares(config: Config): void {
    // currently this is not very performant i could do everything in one for loop

    for (let i = 0; i < config.middlewares.length; i++) {
        // create path links for the middlewares
        createMiddlewareLinks(config, config.middlewares[i]);

        // check if the mw files exist, if they dont delete em
        if(removeNonExistantMiddlewares(config, config.middlewares[i])) {
            i--;
        }

        // load the middleware functions
        config.middlewares[i].func = require(config.middlewares[i].link);
    };
}

/**
 * Creates the links to the file of a middleware. The link is the path to the file where the middleware is saved
 * 
 * @param config the grafe config
 * @returns the new grafe config with the middleware links
 */
function createMiddlewareLinks(config: Config, mw: Middleware): Config {
    // build the link 
    // middlewares are stored in the path: 'BASE_DIR/MW_STORAGE_PATH/MW_SHORT/MW_NAME.js
    // exapmle: BASEDIR/src/middlewares/usr/users_only.js
    mw.link = path.join(config.baseDir, config.middlewarePath, mw.value, mw.name + '.js');

    return config;
}

/**
 * Checks if the middleware files exist. If they dont exist they will be removed from the list.
 * 
 * !The middleware links need to be constructed or errors will be thrown
 * 
 * @param config The grafe config
 * @returns The new grafe config
 */
function removeNonExistantMiddlewares(config: Config, mw: Middleware): boolean {
    // if a link is undefind throw an error
    if (mw.link === undefined) {
        throw `No link for middleware ${mw.name} found. Where the links build?`;
    }

    // check if the middleware file exists
    if (!fs.existsSync(mw.link)) {
        // remove the mw because it does not exist
        config.middlewares.splice(config.middlewares.indexOf(mw), 1);
        return true;
    }

    return false;
}