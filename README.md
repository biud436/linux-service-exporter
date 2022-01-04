# Introduction

Before starting this tool, you must clone this tool from Github. Try to run commands at the following steps on your terminal.

```
git clone https://github.com/biud436/linux-service-exporter.git
cd linux-service-exporter
npm install
```

To create a service file, try to run this tool at the following steps on your terminal.

```sh
sudo node ./src/index.js --desc="Start my server" \
    --requires="Requires=After=mysql.service" \
    --cmd="node /home/ubuntu/badge-server/src/index.js" \
    --identifier="badge-server" \
    --file="badge-server"
```

to use this tool using typescript, try to run as below command on your linux terminal.

```sh
# if you have not installed yarn on your system, you can install yarn by using following command.
sudo npm install -g yarn

# build as typescript and run program.
sudo yarn run tsc:start --desc="Start my server" \
    --requires="Requires=After=mysql.service" \
    --cmd="node /home/ubuntu/badge-server/src/index.js" \
    --identifier="badge-server" \
    --file="badge-server"
```
