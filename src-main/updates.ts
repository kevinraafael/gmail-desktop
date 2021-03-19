import { app, dialog } from 'electron'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'
import { is } from 'electron-util'

import config, { ConfigKey } from './config'
import { viewLogs } from './logs'
import { createNotification } from './notifications'
import { initOrUpdateAppMenu } from './app-menu'

const UPDATE_CHECK_INTERVAL = 60000 * 60 * 3 // 3 Hours

export function changeReleaseChannel(channel: 'stable' | 'dev') {
  autoUpdater.allowPrerelease = channel === 'dev'
  autoUpdater.allowDowngrade = true
  checkForUpdates()
  config.set(ConfigKey.ReleaseChannel, channel)
}

function onUpdateAvailable(): void {
  createNotification(
    'Update available',
    `Please restart ${app.name} to update to the latest version`,
    () => {
      app.relaunch()
      app.quit()
    }
  )
}

export function initUpdates(): void {
  if (!is.development) {
    log.transports.file.level = 'info'
    autoUpdater.logger = log

    if (
      autoUpdater.allowPrerelease &&
      config.get(ConfigKey.ReleaseChannel) === 'stable'
    ) {
      config.set(ConfigKey.ReleaseChannel, 'dev')
      initOrUpdateAppMenu()
    } else if (
      !autoUpdater.allowPrerelease &&
      config.get(ConfigKey.ReleaseChannel) === 'dev'
    ) {
      autoUpdater.allowPrerelease = true
      checkForUpdates()
      initOrUpdateAppMenu()
    }

    autoUpdater.on('update-downloaded', onUpdateAvailable)

    if (config.get(ConfigKey.AutoUpdate)) {
      setInterval(() => autoUpdater.checkForUpdates, UPDATE_CHECK_INTERVAL)
      autoUpdater.checkForUpdates()
    }
  }
}

export async function checkForUpdates(): Promise<void> {
  try {
    const { downloadPromise } = await autoUpdater.checkForUpdates()

    // If there isn't an update, notify the user
    if (!downloadPromise) {
      dialog.showMessageBox({
        type: 'info',
        message: 'There are currently no updates available.'
      })
    }
  } catch (error: unknown) {
    log.error('Check for updates failed', error)

    createNotification(
      'Check for updates failed',
      'View the logs for more information',
      viewLogs
    )
  }
}
