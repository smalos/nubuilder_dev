function getDataType (t, i, selectMultiple) {
  const date = (i == 'date' || i == 'nuDate')
  const norm = (i == 'input' && i != 'date' && i != 'nuDate' && i != 'nuNumber' && i != 'number' && i != 'file' && i != 'nuAutoNumber')
  let dt = 'VARCHAR(100)'

  if (t == 'lookup') { dt = 'VARCHAR(25)' }
  if (t == 'select' && !selectMultiple) { dt = 'VARCHAR(100)' }
  if (t == 'select' && selectMultiple) { dt = 'VARCHAR(1000)' }
  if (t == 'calc') { dt = 'DECIMAL(12,4)' }
  if (t == 'textarea') { dt = 'TEXT' }
  if (t == 'input' && norm) { dt = 'VARCHAR(100)' }
  if (t == 'input' && date) { dt = 'DATE' }
  if (t == 'input' && i == 'number') { dt = 'INT' }
  if (t == 'input' && i == 'nuAutoNumber') { dt = 'BIGINT UNSIGNED' }
  if (t == 'input' && i == 'nuNumber') { dt = 'DECIMAL(12,4)' }
  if (t == 'input' && i == 'file') { dt = 'LONGTEXT' }

  return dt
}

const table = parent.$('#sob_all_table').val()
const id = parent.$('#sob_all_id').val()
const type = parent.$('#sob_all_type').val()
const input = parent.$('#sob_input_type').val()
const selectMultiple = parent.nuGetValue('sob_select_multiple')
const dataType = getDataType(type, input)

let qry = '`$column` $type NULL DEFAULT NULL'
qry = qry.replace('$column', id)
qry = qry.replace('$type', dataType)

let start = 'ALTER TABLE `$table` ADD'
start = start.replace('$table', table)

$('#sql_query_word').html(start)
$('#sql_query').val(qry)

nuAddActionButton('Run', 'Run', 'nuRunPHPHidden("NURUNADDDBCOLUMN")')

$('#sql_query').addClass('sql')
$('.sql').dblclick(function () { nuOpenAce('SQL', this.id) })

nuSetProperty('sob_all_table', table)
nuRefreshSelectObject('sql_after_column')
