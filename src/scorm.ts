import { ScormApi12, ScormApi2004, ScormVersion } from './types/scorm';

let api12: ScormApi12 | null = null;
let api2004: ScormApi2004 | null = null;
let version: ScormVersion = null;
let initialized = false;

function findApi(win: Window, depth = 0): ScormVersion {
    if (depth > 5) return null;

    const w = win as unknown as Record<string, unknown>;

    if (w['API_1484_11']) {
        api2004 = w['API_1484_11'] as ScormApi2004;
        return '2004';
    }

    if (w['API']) {
        api12 = w['API'] as ScormApi12;
        return '1.2';
    }

    try {
        if (win.parent && win.parent !== win) {
            return findApi(win.parent, depth + 1);
        }
    } catch {
        // cross-origin parent
    }

    return null;
}

export function scormInit(): boolean {
    if (initialized) return true;

    version = findApi(window);

    if (version === '1.2' && api12) {
        initialized = api12.LMSInitialize('') === 'true';
    } else if (version === '2004' && api2004) {
        initialized = api2004.Initialize('') === 'true';
    }

    if (initialized) {
        console.debug(`[SCORM] Initialised with SCORM ${version}`);
        window.addEventListener('beforeunload', scormFinish);
    } else if (version === null) {
        console.debug('[SCORM] No SCORM API found — running outside LMS, no-op mode.');
    }

    return initialized;
}

export function scormComplete(status: 'completed' | 'passed' | 'failed' = 'completed'): void {
    if (!initialized) return;

    if (version === '1.2' && api12) {
        api12.LMSSetValue('cmi.core.lesson_status', status);
        api12.LMSCommit('');
        api12.LMSFinish('');
    } else if (version === '2004' && api2004) {
        const successStatus = status === 'passed' ? 'passed' : status === 'failed' ? 'failed' : 'unknown';
        api2004.SetValue('cmi.completion_status', 'completed');
        api2004.SetValue('cmi.success_status', successStatus);
        api2004.Commit('');
        api2004.Terminate('');
    }

    initialized = false;
    window.removeEventListener('beforeunload', scormFinish);
    console.debug(`[SCORM] Session completed (status: ${status})`);
}

export function scormSetScore(score: number, min = 0, max = 100): void {
    if (!initialized) return;

    const clamped = Math.min(max, Math.max(min, score));

    if (version === '1.2' && api12) {
        api12.LMSSetValue('cmi.core.score.raw', String(clamped));
        api12.LMSSetValue('cmi.core.score.min', String(min));
        api12.LMSSetValue('cmi.core.score.max', String(max));
    } else if (version === '2004' && api2004) {
        const scaled = parseFloat(((clamped - min) / (max - min)).toFixed(7));
        api2004.SetValue('cmi.score.raw', String(clamped));
        api2004.SetValue('cmi.score.min', String(min));
        api2004.SetValue('cmi.score.max', String(max));
        api2004.SetValue('cmi.score.scaled', String(scaled));
    }
}

export function scormSuspend(): void {
    if (!initialized) return;

    if (version === '1.2' && api12) {
        api12.LMSSetValue('cmi.core.lesson_status', 'incomplete');
        api12.LMSCommit('');
        api12.LMSFinish('');
    } else if (version === '2004' && api2004) {
        api2004.SetValue('cmi.completion_status', 'incomplete');
        api2004.Commit('');
        api2004.Terminate('');
    }

    initialized = false;
    window.removeEventListener('beforeunload', scormFinish);
}

export function scormGet(key: string): string {
    if (!initialized) return '';
    if (version === '1.2' && api12) return api12.LMSGetValue(key);
    if (version === '2004' && api2004) return api2004.GetValue(key);
    return '';
}

export function scormSet(key: string, value: string): void {
    if (!initialized) return;
    if (version === '1.2' && api12) {
        api12.LMSSetValue(key, value);
        api12.LMSCommit('');
    } else if (version === '2004' && api2004) {
        api2004.SetValue(key, value);
        api2004.Commit('');
    }
}

export function isScormAvailable(): boolean {
    return initialized;
}

export function scormVersion(): ScormVersion {
    return version;
}

function scormFinish(): void {
    if (!initialized) return;
    if (version === '1.2' && api12) {
        api12.LMSCommit('');
        api12.LMSFinish('');
    } else if (version === '2004' && api2004) {
        api2004.Commit('');
        api2004.Terminate('');
    }
    initialized = false;
}
