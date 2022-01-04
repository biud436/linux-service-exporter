const minimist = require("minimist");
const argv = minimist(process.argv.slice(2));

import { App } from "./app";
import { Service } from "./service";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import inquirer from "inquirer";

const TARGET_SERVICE_FILE_PATH = `/etc/systemd/system/`;

/**
 * 루트 권한이 있는지 확인합니다.
 */
const manager = (() => {
  return new (class {
    isRoot() {
      const uid = process.geteuid();
      const isRoot = uid === 0;

      return isRoot;
    }
  })();
})();

if (argv.q) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "desc",
        message: "서비스 파일에 대한 설명을 영어 문장으로 작성하세요",
      },
      {
        type: "input",
        name: "requires",
        message: "필요 서비스를 입력하세요 (예: Requires=After=mysql.service)",
      },
      {
        type: "input",
        name: "identifier",
        message: "서비스 식별자를 입력하세요 (예: badge-server)",
      },
      {
        type: "input",
        name: "file",
        message: "서비스 파일의 이름을 입력하세요 (예: badge-server)",
      },
    ])
    .then((answers) => {
      const { desc, requires, identifier, file } = answers;
    })
    .catch((err) => {
      console.warn(err);
    });
}

function createServiceFile(data: any) {
  /**
   * @type {String}
   */
  let filename = argv.f || argv.file;

  const info = os.userInfo();
  const uid = process.geteuid();

  if (!manager.isRoot()) {
    throw new Error("root 권한이 없습니다");
  } else {
    // 타겟을 설정합니다.
    let target = TARGET_SERVICE_FILE_PATH;
    if (!filename.startsWith(target)) {
      filename = path.join(target, filename);
    }
    // 서비스 파일을 생성합니다.
    fs.writeFileSync(filename, data, "utf-8");

    // 서비스를 재시작합니다.
    app.emit("build");
  }
}

/**
 * 앱 관리자를 생성합니다.
 */
const app = new App();
app.on("ready", () => {
  // 서비스 객체를 생성합니다.
  const service = new Service(
    {
      desc: argv.desc || "",
      requires: argv.r || argv.requires || "",
      cmd: argv.cmd || "",
      identifier: argv.identifier || "",
    },
    createServiceFile
  );
});

app.emit("ready");
