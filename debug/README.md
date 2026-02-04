# Debug system – generated log files

This folder holds **generated log files only**. Debug script files live in **`scripts/debug/`**.

All runtime logs from those scripts are written here. **Each run overwrites** the corresponding log file (no append).

| Log file | Source | Command |
|----------|--------|---------|
| `expo-debug.log` | Expo CLI + Metro + JS errors/warnings | `npm run debug:expo` |
| `android-debug.log` | adb logcat (native/RN bridge) | `npm run debug:android` |
| `ios-debug.log` | iOS simulator log stream | `npm run debug:ios` (macOS only; simulator must be booted) |
| `web-debug.log` | Browser console (log/warn/error) | Run `npm run debug:web`, then use app in browser |

**Combined:** `npm run debug:all` starts Expo, Android, and (on macOS) iOS logging together in one terminal.

Log files (`*.log`) are gitignored. See `.cursor/rules/debug.mdc` for full rules.
