const PAYLOAD_URI = 'src/ps5/pldmg.elf'; // مسار الملف داخل مجلد src/ps5
const AUTOLOAD_DELAY_MS = 1000; // مهلة قصيرة للتأكد من جاهزية المنفذ 9021

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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function resolve_payload_uri(uri) {
  if (!uri) return '';
  if (/^(https?|file):\/\//i.test(uri)) {
    return uri;
  }
  const cleanPath = uri.replace(/^\.?\//, '');
  return new URL(cleanPath, window.location.href).href;
}

async function autoload_payload(uri) {
  const targetUri = resolve_payload_uri(uri);
  if (!targetUri) return;

  if (AUTOLOAD_DELAY_MS > 0) {
    await sleep(AUTOLOAD_DELAY_MS);
  }

  const url = `http://127.0.0.1:9021/x?uri=${encodeURIComponent(targetUri)}`;
  logger.info(`Autoloading payload via 9021: ${targetUri}`);
  await fetch(url, { mode: 'no-cors' });
  logger.info('Autoload request sent');
}

async function main() {
  await load_script('src/misc.js');

  version.init();

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

  await autoload_payload(PAYLOAD_URI);
}

logger.init();
main();
