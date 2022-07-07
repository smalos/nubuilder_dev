
function nuCheckCSV () {
  const csvTo = $('#csv_to').val()
  const csvFrom = $('#csv_from').val()
  const csvDelimiter = $('#csv_delimiter').val()

  if ($('#csv_transfer').val() === '' || csvFrom === '' || csvTo === '' || csvDelimiter === '') {
    nuMessage([nuTranslate('No fields can be left blank') + '...'])
  } else {
    if ($('#csv_transfer').val() == 'export') {
      if (nuFORM.getJustTables().includes(csvFrom)) {
        nuRunPHP('CSVTRANSFER')
      } else {
        nuMessage([nuTranslate('No such tablename') + '...'])
      }
    }

    if ($('#csv_transfer').val() == 'import') {
      if (nuCSVfiles.includes(csvFrom)) {
        if (csvTo == 'zzzzsys_user') {
          nuImportUsersFromCSV(csvFrom, csvDelimiter)
        } else {
          if (nuFORM.getJustTables().includes(csvTo)) {
            nuMessage([nuTranslate('There is already a table named'), '<b>' + csvTo + '</b>'])
          } else {
            nuRunPHP('CSVTRANSFER')
          }
        }
      } else {
        nuMessage([nuTranslate('File not found'), '', nuTranslate('CSV File must be located in the temp directory of the nubuilder directory')])
      }
    }
  }
}

nuAddActionButton('transfer', 'Transfer', 'nuCheckCSV()', '')

$('#csv_transfer').val('export')
$('#csv_delimiter').val('44')

nuHide('csv_delete_after_import')

nuCSVTransfer('export')

function nuCSVTransfer (t) {
  if (t == 'export') {
    $('#label_csv_from').html(nuTranslate('Export From (Table)'))
    $('#label_csv_to').html(nuTranslate('Export To CSV File'))

    $('#csv_from').addClass('input_nuScroll nuScroll').off('keydown').keydown(function () {
      nuFORM.scrollList(event, nuFORM.getJustTables())
    })

    nuHide('csv_delete_after_import')
  } else {
    $('#label_csv_from').html(nuTranslate('Import From CSV File'))
    $('#label_csv_to').html(nuTranslate('Import To (Table)'))

    $('#csv_from').addClass('input_nuScroll nuScroll').off('keydown').keydown(function () {
      nuFORM.scrollList(event, nuCSVfiles)
    })

    nuShow('csv_delete_after_import')
  }
}
