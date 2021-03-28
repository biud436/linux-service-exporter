const cp = require("child_process");
const {promisify} = require("util");
const spawn = promisify(cp.spawn);

export class App {
    
    constructor() {

    }

    async build(filename) {
        await this.exec(`systemctl enable ${filename}.service`);
        await this.exec(`systemctl start ${filename}.service`);
        await this.exec(`systemctl daemon-reload`);
        await this.exec(`systemctl restart ${filename}.service`);
    }

    /**
     * 
     * @param {String} cmd 
     * @returns 
     */
    exec(cmd) {
        const argv = cmd.split(" ");
        const execFile = argv[0];
        const args = argv.slice(1);

        return spawn(execFile, args, {
            shell: true
        });
    }
}