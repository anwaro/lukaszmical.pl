import {RunParams} from '~types/scripts';

import runMigrate from './migrate.projects';
import runMinify from './minify.projects';

enum ScriptCmd {
    MIGRATE = 'migrate',
    MINIFY = 'minify',
}

(async () => {
    const [script, ...params] = process.argv.slice(2);
    const paramsRecord = params.reduce((prev, param) => {
        let [key, value = true] = param.split('=');
        key = key.replace(/^--/, '');
        return {...prev, [key]: value};
    }, {} as RunParams);
    switch (script) {
        case ScriptCmd.MIGRATE:
            return await runMigrate(paramsRecord);
        case ScriptCmd.MINIFY:
            return await runMinify(paramsRecord);
        default: {
            console.log(`Unknown command: ${script}`);
        }
    }
})();
