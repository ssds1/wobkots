const logger = {
  verbose: true, // enable for debug logs

  init() {
    this.console = document.getElementById('console');
  },
  info(msg) {
    this.log('[+]', `${msg}`);
  },
  error(msg) {
    this.log('[-]', `${msg}`);
  },
  debug(msg) {
    if (this.verbose) this.log('[*]', `${msg}`);
  },
  log(prefix, msg) {
    if (!this.console) return;

    this.console.append(`${prefix} ${String(msg).replace(/\n/g, `\n${prefix} `)}\n`);
    this.console.scrollTop = this.console.scrollHeight;
  },
};

window.onerror = function (message, source, line, column, error) {
  let msg = message;

  if (error && error.stack) {
    msg += `\n${error.stack}`;
  } else {
    msg += `\n@${source}:${line}:${column}`;
  }

  logger.error(msg);
  return true;
};

window.onunhandledrejection = function (event) {
  const err = event
