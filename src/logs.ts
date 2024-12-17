import fs from "fs";
import path from "path";

// Create a folder for logs
const logFolder = path.join(process.cwd(), "logs");
if (!fs.existsSync(logFolder)) {
  fs.mkdirSync(logFolder);
}

// Create a timestamp for the log file name
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const logFileName = `log-${timestamp}.json`;
const logFilePath = path.join(logFolder, logFileName);

// Capture logs
const logs: unknown[] = [];

// Function to override console methods
function setupLogger() {
  const originalConsole = {
    log: console.log,
    error: console.error,
    debug: console.debug,
    warn: console.warn,
    info: console.info,
  };

  // Override console methods
  console.log = (...args) => {
    logs.push({ type: "log", message: args.join(" "), timestamp: new Date() });
    originalConsole.log(...args); // Still print to the console
  };

  console.error = (...args) => {
    logs.push({
      type: "error",
      message: args.join(" "),
      timestamp: new Date(),
    });
    originalConsole.error(...args);
  };

  console.debug = (...args) => {
    logs.push({
      type: "debug",
      message: args.join(" "),
      timestamp: new Date(),
    });
    originalConsole.debug(...args);
  };

  console.warn = (...args) => {
    logs.push({ type: "warn", message: args.join(" "), timestamp: new Date() });
    originalConsole.warn(...args);
  };

  console.info = (...args) => {
    logs.push({ type: "info", message: args.join(" "), timestamp: new Date() });
    originalConsole.info(...args);
  };
}

// Function to write logs to a timestamped file
function writeLogsToFile() {
  fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2), "utf8");
  console.log(`Logs written to ${logFilePath}`);
}

export { writeLogsToFile, setupLogger };
