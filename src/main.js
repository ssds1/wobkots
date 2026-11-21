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

function get_payload_port() {
  try {
    if (window.WOBKOT_CFG && typeof window.WOBKOT_CFG.payloadPort === 'number') {
      return window.WOBKOT_CFG.payloadPort;
    }
    const saved = localStorage.getItem('wobkot_payload_port');
    const parsed = parseInt(saved, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 65535) {
      return parsed;
    }
  } catch (e) {}
  return 9021;
}

function is_auto_pldmgr_enabled() {
  try {
    if (window.WOBKOT_CFG && typeof window.WOBKOT_CFG.autoOpenPldmgr === 'boolean') {
      return window.WOBKOT_CFG.autoOpenPldmgr;
    }
    const saved = localStorage.getItem('wobkot_auto_pldmgr');
    if (saved !== null) {
      return saved === '1' || saved === 'true';
    }
  } catch (e) {}
  return true;
}

let pldmgrAutoTriggered = false;

function notify_pldmgr_auto(source) {
  if (pldmgrAutoTriggered) return;
  pldmgrAutoTriggered = true;

  const port = get_payload_port();
  const enabled = is_auto_pldmgr_enabled();

  if (!enabled) {
    logger.info(`Auto-open pldmgr is disabled (port: ${port}, source: ${source})`);
    return;
  }

  logger.info(`Auto-opening pldmgr on port ${port} (${source})...`);

  try {
    window.dispatchEvent(new CustomEvent('wobkot:open-pldmgr', {
      detail: { port, reason: source, automatic: true }
    }));
  } catch (e) {
    logger.error(`Event dispatch failed: ${e.message}`);
  }

  if (typeof window.openPldmgr === 'function') {
    try {
      window.openPldmgr(port);
    } catch (e) {
      logger.error(`openPldmgr error: ${e.message}`);
    }
  }
}

window.wobkotGetPort = get_payload_port;
window.wobkotOnTaskComplete = function (source) {
  notify_pldmgr_auto(source || 'task_complete');
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
  const err = event.reason;

  let msg = err && err.message ? err.message : String(err);

  if (err && err.stack) {
    msg += `\n${err.stack}`;
  }

  logger.error(msg);
};

function load_script(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => {
      reject(new Error(`Failed to load script: ${src}`));
    };
    document.head.appendChild(script);
  });
}

async function load_file(src) {
  const res = await fetch(src);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${src}`);
  }

  const buf = await res.arrayBuffer();
  return new Uint8Array(buf);
}

async function main() {
  pldmgrAutoTriggered = false;

  await load_script('src/misc.js');

  version.init();

  const port = get_payload_port();
  logger.debug(`Payload port configured: ${port}`);

  switch (version.console) {
    case 4:
      await load_script('src/ps4/impl.js');
      break;
    case 5:
      await load_script('src/ps5/impl.js');
      break;
    default:
      throw new Error(`Unsupported console ${version.console}`);
  }

  await load_script('src/userland.js');
  await userland_main();

  await load_script('src/kernel.js');
  await kernel_main();

  notify_pldmgr_auto('kernel_main');
}

logger.init();
main();
