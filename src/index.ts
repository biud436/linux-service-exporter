const minimist = require("minimist");
const argv = minimist(process.argv.slice(2));

import { App } from "./app";
import { Service } from "./service";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import inquirer from "inquirer";
import { isForOfStatement } from "typescript";

/**
 * 기본 서비스 파일의 경로입니다.
 */
const TARGET_SERVICE_FILE_PATH = `/etc/systemd/system/`;

/**
 * 루트 권한이 있는지 확인합니다.
 */
const manager = (() => {
  return new (class {
    isRoot() {
      const platform = process.platform;
      console.log(platform);
      if (platform !== "linux") {
        return false;
      }
      const uid = process.getuid();
      const isRoot = uid === 0;

      return isRoot;
    }
  })();
})();

/**
 * 앱을 생성합니다.
 */
const app = new App();

/**
 * 서비스 파일을 생성합니다.
 *
 * @param data
 */
function createServiceFile(data: any) {
  /**
   * @type {String}
   */
  let filename = argv.f || argv.file;

  if (!manager.isRoot()) {
    let defaultErrorMessage = "root 권한이 없습니다";
    if (process.platform !== "linux") {
      defaultErrorMessage =
        defaultErrorMessage + ". 그리고 리눅스 시스템이 아닙니다.";
    }
    throw new Error(defaultErrorMessage);
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
 * 서비스를 인터렉티브하게 생성합니다.
 */
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
        name: "cmd",
        message: "명령어를 입력하세요",
      },
    ])
    .then((answers) => {
      const { desc, requires, identifier, cmd } = answers;

      app.on("ready", () => {
        // 서비스 객체를 생성합니다.
        const service = new Service(
          {
            desc: desc || "",
            requires: requires || "",
            cmd: cmd || "",
            identifier: identifier || "",
          },
          createServiceFile
        );
      });
    })
    .catch((err) => {
      console.warn(err);
    });
} else {
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
}

/**
 * 이벤트를 실행합니다.
 */
app.emit("ready");
