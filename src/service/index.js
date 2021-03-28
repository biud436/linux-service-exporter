
class Service {

    constructor(config, onCallback) {

        onCallback(this.exec(config));
    }

    exec({desc, cmd, requires ,identifier}) {
        /**
         * /etc/systemd/system/
         */

        return `
        [Unit]
        Description=${desc}
        ${requires}
        
        
        [Service]
        ExecStart=${cmd}
        
        Restart=always
        RestartSec=10
        StandardOutput=syslog
        StandardError=syslog
        SyslogIdentifier=${identifier}
        
        [Install]
        WantedBy=multi-user.target
        `        
    }

}

export {Service};