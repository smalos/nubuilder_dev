$('#user_home').addClass('nuUserHomeButton')
$('.nuActionButton').hide()
nuHideTabs(0)
nuGetStartingTab()

function openForm (f, r, event) {
  n = event.ctrlKey ? '2' : '0'
  nuForm(f, r, '', '', n)
}

function openMenu (event, menu, element) {
  event.stopPropagation()
  ctxmenu.show(menu, element)
}

function menuProcedureClick (element, event) {
  const menu = [{
    text: nuTranslate('Procedure')
  },

  {
    text: nuContextMenuItemText('Run', 'fa fa-play'),
    action: () => openForm('nurunphp', '', event)
  },
  {
    text: nuContextMenuItemText('Add', 'fa fas fa-plus'),
    action: () => openForm('nuphp', '-1', event)
  }]

  openMenu(event, menu, element)
}

function menuNotesClick (element, event) {
  const menu = [{
    text: nuTranslate('Notes')
  },

  {
    text: nuContextMenuItemText('Add', 'fa fas fa-plus'),
    action: () => openForm('nunotes', '-1', event)
  },
  {
    text: nuContextMenuItemText('Categories', 'fa-solid fa-list'),
    action: () => openForm('nunotescategroy', '', event)
  }]

  openMenu(event, menu, element)
}

function menuReportClick (element, event) {
  const menu = [{
    text: nuTranslate('Report')
  },

  {
    text: nuContextMenuItemText('Run', 'fa fa-play'),
    action: () => openForm('nurunreport', '', event)
  },
  {
    text: nuContextMenuItemText('Add', 'fa fas fa-plus'),
    action: () => openForm('nubuildreport', '-1', event)
  },
  {
    text: nuContextMenuItemText('Fast Report', 'fa fa-bolt'),
    action: () => openForm('nufrlaunch', '', event)
  }]

  openMenu(event, menu, element)
}

function menuFormClick (element, event) {
  const menu = [{
    text: nuTranslate('Form')
  },

  {
    text: nuContextMenuItemText('Add', 'fa fas fa-plus'),
    action: () => openForm('nuform', '-1', event)
  },
  {
    text: nuContextMenuItemText('Fast Form', 'fa fa-bolt'),
    action: () => openForm('nufflaunch', '', event)
  }]

  openMenu(event, menu, element)
}

function menuDatabaseClick (element, event) {
  const menuSession =

    {
      conditional: true,
      text: nuContextMenuItemText('Sessions', 'fas fa-key'),
      action: () => openForm('nusession', '', event)
    }

  const menu = [{
    text: nuTranslate('Database')
  },
  {
    text: nuContextMenuItemText('CSV Transfer', 'fas fa-file-csv'),
    action: () => openForm('nucsvtransfer', '', event)
  },
  menuSession,
  {
    text: nuContextMenuItemText('Backup', 'backup far fa-hdd'),
    action: () => nuRunBackup()
  },

  {
    text: nuContextMenuItemText('Cloner', 'far fa-clone'),
    action: () => openForm('nucloner', '', event)
  },
  {
    text: nuContextMenuItemText('Update', 'fas fa-cloud-download-alt'),
    action: () => openForm('nuupdate', '', event)
  }]

  if (nuSERVERRESPONSE.is_demo) {
    menuProcedure = menuProcedure.filter((item) => item.conditional !== true)
  }

  openMenu(event, menu, element)
}

function menuSetupClick (element, event) {
  const menu = [{
    text: nuTranslate('Setup')
  },
  {
    text: nuContextMenuItemText('Format', 'fa fa-calendar'),
    action: () => openForm('nuFormat', '', event)
  },

  {
    text: nuContextMenuItemText('Translation', 'fa fa-globe'),
    action: () => openForm('nutranslate', '', event)
  }]

  openMenu(event, menu, element)
}
