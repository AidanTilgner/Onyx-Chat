import { writeFileSync } from "fs";

type logTypes = "info" | "error" | "warning" | "debug" | "analytics";

export class Logger {
  private log_file_path: string = "storage/logs.txt";

  private log_type: logTypes = "info";

  constructor({
    log_file_path,
    log_type,
  }: {
    log_file_path?: string;
    log_type?: logTypes;
  }) {
    this.log_file_path = log_file_path || this.log_file_path;
    this.log_type = log_type || this.log_type;
  }

  public log(message: string) {
    const date = new Date();
    const log_message = `[${
      this.log_type
    }] - ${date.toISOString()} - ${message}`;
    writeFileSync(this.log_file_path, log_message + "\n", {
      flag: "a",
    });
    console.log("Logged: " + log_message);
  }

  public info(message: string) {
    this.log_type = "info";
    this.log(message);
  }

  public error(message: string) {
    this.log_type = "error";
    this.log(message);
  }

  public warning(message: string) {
    this.log_type = "warning";
    this.log(message);
  }

  public debug(message: string) {
    this.log_type = "debug";
    this.log(message);
  }

  public analytics(message: string) {
    this.log_type = "analytics";
    this.log(message);
  }
}
