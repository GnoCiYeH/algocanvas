import {Config} from '@remotion/cli/config';

const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE
  ?? (process.platform === 'linux' ? '/usr/bin/chromium-browser' : null);

if (browserExecutable) {
  Config.setBrowserExecutable(browserExecutable);
}

Config.setOverwriteOutput(true);
