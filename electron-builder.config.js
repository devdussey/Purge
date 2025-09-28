module.exports = {
  appId: 'com.devdussey.purge',
  productName: 'Purge by DevDussey',
  directories: {
    output: 'release',
  },
  files: [
    'dist/**/*',
    'dist-electron/**/*',
    {
      icon: 'public/PurgedIcon.png',
    },
    'node_modules/**/*',
  ],
  extraResources: [
    {
      installerIcon: 'public/PurgedIcon.png',
      uninstallerIcon: 'public/PurgedIcon.png',
      installerHeaderIcon: 'public/PurgedIcon.png',
      to: 'scripts',
    },
  ],
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64'],
      },
    ],
    icon: 'public/icon.ico',
    requestedExecutionLevel: 'requireAdministrator',
  },
  mac: {
    target: 'dmg',
    icon: 'public/icon.icns',
    category: 'public.app-category.utilities',
  },
  linux: {
    target: 'AppImage',
    icon: 'public/icon.png',
    category: 'Utility',
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    displayLanguageSelector: true,
    installerIcon: 'public/icon.ico',
    uninstallerIcon: 'public/icon.ico',
    installerHeaderIcon: 'public/icon.ico',
    deleteAppDataOnUninstall: true,
  },
  publish: {
    provider: 'github',
    owner: 'DevDussey',
    repo: 'purge-antivirus',
  },
};