
class nuSelectObject {
  constructor () {
    this.boxID = ''
    this.table = ''
    this.joins = []
    this.boxes = []
    this.tempTables = []
    this.tempJoins = []
  }

  addBox (t, id) {
    this.table = t
    const s = parent.nuFORM.tableSchema
    const n = s[t].names
    const p = s[t].types
    const i = arguments.length == 1 ? nuID() : String(id).substring(3)
    this.boxID = 'box' + i
    this.scrollID = 'scroll' + i
    const w = this.boxWidth(s, t)
    const box = document.createElement('div')		// -- box

    this.boxes.push(this.boxID)

    box.setAttribute('id', this.boxID)
    $('body').append(box)
    $('#' + this.boxID).css({
      width: w,
      height: Math.min(20 + (n.length * 20), 190),
      top: 25 + (25 * $('.nuBox').length),
      left: 22 + (22 * $('.nuBox').length),
      position: 'absolute',
      border: 'solid grey 1px',
      overflow: 'hidden',
      'padding-top': '5px',
      'background-color': '#c5c3c3',
      'z-index': -1
    })
      .addClass('nuBox')
      .addClass('nuDragNoSelect')
      .addClass('nuBoxHeader')
      .addClass('nuBoxShadow')

    const scroll = document.createElement('div')			// -- scroll

    scroll.setAttribute('id', this.scrollID)

    $('#' + this.boxID).append(scroll)
    $('#' + scroll.id).css({
      width: w,
      height: Math.min(20 + (n.length * 20), 175),
      top: 22,
      left: 0,
      overflow: 'scroll',
      'overflow-x': 'hidden',
      'line-height': 1
    })
      .addClass('nuDragNoSelect')
      .addClass('nuBoxHeader')

    const tbl = document.createElement('div')				// -- tablename

    tbl.setAttribute('id', 'tablename' + this.boxID)

    $('#' + this.boxID).append(tbl)

    $('#' + tbl.id)
      .css({
        position: 'absolute',
        width: 280,
        height: 15,
        top: 2,
        left: 0,
        'padding-left': 22,
        'text-align': 'left',
        border: 'none',
        'font-weight': 'bold',
        'background-color': '#c5c3c3'
      })
      .html(t)
      .addClass('nuDragNoSelect')
      .addClass('nuTableName')
      .addClass('nuBoxTitle')

    const bck = document.createElement('input')								// -- checkbox all

    bck.setAttribute('id', 'checkall' + this.boxID)

    $('#' + this.boxID).append(bck)

    $('#' + bck.id)
      .css({
        position: 'absolute',
        width: 20,
        top: 2,
        left: -1
      })
      .attr('type', 'checkbox')
      .attr('onchange', 'window.nuSQL.buildSQL("table","' + this.boxID + '")')
      .prop('checked', true)

    const col = document.createElement('input') 								// -- table alias

    col.setAttribute('id', 'alias' + this.boxID)

    $('#' + this.boxID).append(col)

    $('#' + col.id)
      .css({
        position: 'absolute',
        width: 30,
        top: 2,
        right: 18,
        'background-color': '#c5c3c3'
      })
      .change(function () {
        nuSQL.buildSQL()
      })

    for (let rows = 0; rows < n.length; rows++) {								// -- add field list
      this.boxRow(rows, n[rows], p[rows], w)
    }

    const x = document.createElement('div')									// -- close box

    x.setAttribute('id', 'nuBoxClose' + this.boxID)

    $('#' + this.boxID).append(x)

    $('#' + x.id).css({
      width: 16,
      height: 15,
      top: 3,
      right: 1,
      position: 'absolute',
      color: 'black',
      'text-align': 'center'
    })
      .html('<img onclick="$(this).parent().parent().remove();nuSQL.buildSQL()" id="nbc' + this.boxID + '" src="graphics/nu_box_close.png" width="10px" height="10px">')
      .addClass('nuDragNoSelect')
      .addClass('nuButtonHover')
      .addClass('nuClose')
  }

  buildSQL (c, b) {
    if (parent.$('#sse_edit').val() == 1) { return }

    nuAngle()

    const s = this.buildSelect(c, b)
    const f = this.buildFrom()
    var c = this.buildClauses()

    parent.$('#sse_sql')
      .val(s + f + c + '\n')
      .change()

    parent.$('#sse_json')
      .val(this.buildJSON())
      .change()

    if (parent.$('#nuSaveToTextareaButton').length == 1) {
      parent.$('#nuSaveToTextareaButton').hide()
      parent.$('#nuSaveButton').show()
    }
  }

  buildSelect (c, b) {				// -- checkbox type, boxID
    if (c == 'field') {
      $('#checkall' + b)
        .prop('checked', false)
    }

    if (c == 'table') {
      $('.checkfield.' + b)
        .prop('checked', false)
    }

    const s = []

    for (let i = 0; i < this.boxes.length; i++) {
      var b = this.boxes[i]

      if ($('#' + b).length == 1) {
        const t = $('#tablename' + b).html()
        const a = $('#alias' + b).val()
        const u = a == '' ? t : a
        var T = this.justAlias(t, a)

        if ($('#checkall' + b).is(':checked')) {
          s.push(T + '.*')
        } else {
          $('.checkfield.' + b).each(function (index) {
            const f = 'field' + $(this)[0].id.substr(6)

            if ($(this).is(':checked')) {
              const box = String($(this)[0].id).split('_')[2]
              const alias = $('#alias' + box).val()

              if (alias == undefined || alias == '') {
                s.push(T + '.' + $('#' + f).html())
              } else {
                s.push(T + '.' + $('#' + f).html() + ' AS ' + T + '_' + $('#' + f).html())
              }
            }
          })
        }
      }
    }

    const SQL = 'SELECT\n ' + s.join(',\n    ') + '\n'

    return SQL
  }

  buildFrom () {
    const THIS = this
    this.tempTables = this.usedTables()
    this.tempJoins = this.getJoinObjects()													// -- current visible joins

    const torder = function (b, a) {
      return (a.joins.length < b.joins.length)
    }

    for (var i = 0; i < this.tempTables.length; i++) {
      if (this.tempTables[i].used != -1) {
        var f = this.tempTables.sort(torder)
        let more = true
        const t = this.tempTables[i].table
        var a = this.tempTables[i].alias
        let A = this.fromAlias(f[0].table, f[0].alias)
        const defined = [A, a]												// -- growing list of used tables
        let ob = {}
        const s = ''
        var F = []

        while (more) {
          const q = this.getJoinObject(defined)
          ob = q[1]
          more = q[0]

          if (more) {
            const a1 = ob.type == 'LEFT' ? '\n        LEFT JOIN ' : '\n        JOIN '

            var a = this.justAlias(ob.tables[0], ob.aliases[0])

            if (defined.indexOf(A) == -1 || defined.indexOf(a) == -1) {
              var a2 = this.buildAlias(ob.tables[0], ob.aliases[0])
              A = this.justAlias(ob.tables[0], ob.aliases[0])
            } else {
              var a2 = this.buildAlias(ob.tables[1], ob.aliases[1])
              A = this.justAlias(ob.tables[1], ob.aliases[1])
            }

            defined.push(A)
            defined.push(a)

            this.markTableAsUsed(ob.tables[0], ob.aliases[0])
            this.markTableAsUsed(ob.tables[1], ob.aliases[1])

            const a3 = ob.joins.join(' AND ')

            this.tempTables[i].joins.push(a1 + a2 + ' ON ' + a3)
          }
        }
      }
    }

    var f = this.tempTables.sort(torder)
    var F = []

    for (var i = 0; i < f.length; i++) {
      if (f[i].joins.length > 0 || f[i].used != -1) {
        var a = this.fromAlias(f[i].table, f[i].alias)
        const j = f[i].joins.join('')

        F.push('\n    ' + a + j)
      }
    }

    return '\nFROM' + F
  }

  markTableAsUsed (t, a) {
    for (let i = 0; i < this.tempTables.length; i++) {
      if (this.tempTables[i].table == t || this.tempTables[i].alias == a) {
        this.tempTables[i].used = -1

        return
      }
    }
  }

  usedTables () {
    const T = []
    const THIS = this
    this.tempJoins = this.getJoinObjects()													// -- current visible joins

    $('.nuBox').each(function (index) {
      const b = $(this)[0].id
      const t = $('#tablename' + b).html()
      const a = $('#alias' + b).val()
      let u = 0

      for (const k in THIS.joins) {
        const o = THIS.joins[k]

        if (o.fromalias == a || o.fromtable == t || o.toalias == a || o.totable == t) { u++ }
      }

      T.push({ table: t, alias: THIS.justAlias(t, a), used: u, joins: [] })
    })

    const uses = function (b, a) {
      return (b.used < a.used)
    }

    T.sort(uses)

    return T
  }

  getJoinObject (a) {
    const tj = this.tempJoins
    const aList = []

    for (var i = 0; i < a.length; i++) {
      const s = a[i].split(' ')

      aList.push(s[0])
      aList.push(s[s.length - 1])
    }

    for (var i = 0; i < tj.length; i++) {
      const o = tj[i]

      const j = this.justAlias(o.tables[0], o.aliases[0])
      const J = this.justAlias(o.tables[1], o.aliases[1])

      if (aList.indexOf(j) != -1 || aList.indexOf(J) != -1) {
        const r = this.tempJoins.splice(i, 1)

        return [true, o]
      }
    }

    return [false, {}]
  }

  getJoinObjects () {
    const r = this.joins													// -- JOIN
    const j = []
    const J = []

    for (var k in r) {
      const R = r[k]
      const T = R.fromtable
      const t = R.totable
      const A = R.fromalias
      const a = R.toalias
      const B = this.justAlias(R.fromtable, R.fromalias)
      const b = this.justAlias(R.totable, R.toalias)
      const n = String(B + '.' + R.fromfield + ' = ' + b + '.' + R.tofield)
      const id = [B, b].sort().join('--')

      if (j[id] === undefined) {
        j[id] = {
          tables: [T, t],
          aliases: [A, a],
          type: R.join,
          joins: [n],
          used: false
        }
      } else {
        j[id].joins.push(n)

        if (R.type == 'LEFT') {
          R.type = 'LEFT'
        }
      }
    }

    for (var k in j) {
      J.push(j[k])
    }

    return J
  }

  fromAlias (t, a) {
    if (a == t) {
      return t
    }

    return t + ' AS ' + a
  }

  buildAlias (t, a) {
    if (a == '') {
      return t
    }

    return t + ' AS ' + a
  }

  justAlias (t, a) {
    if (a == '') {
      return t
    }

    return a
  }

  refreshJoins (r) {										// -- build objects to draw relationship lines  from
    this.joins = []

    for (const k in r) {
      const I = String(k).split('--')[0]
      const i = String(k).split('--')[1]

      const B = String(I).split('_')[2]
      const b = String(i).split('_')[2]

      const T = $('#tablename' + B).html()
      const A = $('#alias' + B).val()
      const F = $('#' + I).html()

      const t = $('#tablename' + b).html()
      const a = $('#alias' + b).val()
      const f = $('#' + i).html()

      const o = {

        from: I,
        fromtable: T,
        fromalias: A,
        fromfield: F,

        to: i,
        totable: t,
        toalias: a,
        tofield: f,

        join: r[k]

      }

      this.joins[I + '--' + i] = o
    }
  }

  buildClauses () {
    const o = function (b, a) {														// -- used to order clauses
      return (b[1] + 10000 + Number(b[4])) - (a[1] + 10000 + Number(a[4]))
    }

    var T = ''
    var F = ''
    var C = ''
    var S = ''
    const WHERE = []
    const ORDERBY = []
    const GROUPBY = []
    const HAVING = []
    const c = parent.nuFORM.subform('zzzzsys_select_clause_sf').rows

    c.sort(o)

    let clauses = ''

    for (let i = 0; i < c.length; i++) {
      var T = c[i][1]
      var F = c[i][2]
      var C = c[i][3]
      var S = c[i][4]
      const D = c[i][6]
      const cl = F != '' && C != ''			// -- valid statement for WHERE and HAVING
      const gr = F != '' && S != ''			// -- valid statement for ORDER BY and GROUP BY

      if (D == 0) {
        if (T == 1 && cl) { WHERE.push('(' + F + ' ' + C + ')') }
        if (T == 4 && cl) { HAVING.push('(' + F + C + ')') }
        if (T == 2 && gr) { GROUPBY.push(F + ' ' + S) }
        if (T == 3 && gr) { ORDERBY.push(F + ' ' + S) }
      }
    }

    if (WHERE.length > 0) { clauses += '\n\nWHERE\n    (' + WHERE.join(' AND \n    ') + ')\n' }
    if (GROUPBY.length > 0) { clauses += '\nGROUP BY\n    ' + GROUPBY.join(',\n    ') + '\n' }
    if (HAVING.length > 0) { clauses += '\nHAVING\n    ' + HAVING.join(' AND \n    ') + '\n' }
    if (ORDERBY.length > 0) { clauses += '\nORDER BY\n    ' + ORDERBY.join(',\n    ') + '\n' }

    return clauses
  }

  boxWidth (s, t) {
    var s = parent.nuFORM.tableSchema
    // var n = s[t].names;
    let w = nuGetWordWidth(t) + 130

    for (let i = 0; i < s[t].names.length; i++) {
      w = Math.max(w, nuGetWordWidth(s[t].names[i]))
    }

    return w
  }

  boxRow (i, v, t, w) {
    this.boxColumn('select', i, 0, 18, v, '')
    this.boxColumn('field', i, 22, 300, v, t, w)
  }

  boxColumn (c, t, l, w, v, title) {
    const suf = '_' + t + '_' + this.boxID

    const col = document.createElement(c == 'select' ? 'input' : 'span')

    col.setAttribute('id', c + suf)

    $('#' + this.scrollID).append(col)

    $('#' + col.id)
      .css({
        position: 'absolute',
        width: w,
        top: t * 18,
        left: l
      })
      .attr('title', title)

    if (c == 'select') {			// -- checkbox
      $('#' + col.id)
        .attr('data-nu-field', 'field' + suf)
        .attr('onchange', 'window.nuSQL.buildSQL("field","' + this.boxID + '")')
        .attr('type', 'checkbox')
        .addClass(this.boxID)
        .addClass('checkfield')
    } else {
      $('#' + col.id)
        .addClass('nuBoxTitle')
        .addClass('nuBoxField')
        .addClass(this.boxID)
        .css('width', Number(w))
        .css('padding-top', 2)
        .hover(

          function (event) {
            if (event.buttons == 1 && window.nuCurrentID != '') {
              $(this).css('color', 'green')
              $(this).css('cursor', 'e-resize')
            } else {
              $(this).css('color', 'red')
              $(this).css('cursor', 'e-resize')
            }
          },
          function () {
            $(this).css('color', '')
            $(this).css('cursor', 'default')
          })

        .html(v)
    }
  }

  buildJSON () {
    const j = {}
    const a = []
    const THIS = this

    $('.nuBox').each(function (index) {
      const i = $(this)[0].id
      const o = {}

      o.id = i
      o.position = $(this).position()
      o.tablename = $('#tablename' + i).html()
      o.alias = $('#alias' + i).val()
      o.checkall = $('#checkall' + i).is(':checked')
      o.checkboxes = THIS.getCheckboxes(i)

      a.push(o)
    })

    j.tables = a
    const joins = {}
    const r = this.joins

    for (const k in r) {
      const jFrom = r[k].from
      const jTo = r[k].to
      const jJoin = r[k].join

      joins[jFrom + '--' + jTo] = jJoin
    }

    j.joins = joins

    return JSON.stringify(j)
  }

  addJoinsToJSON () {

  }

  getCheckboxes (b) {
    const c = []

    $(':checkbox.' + b).each(function (index) {
      c.push($(this).is(':checked'))
    })

    return c
  }

  getJoins () {
    const a = []
    const j = []
    const r = this.joins

    for (const k in r) {
      a[r[k].from + '--' + r[k].to] = r[k]
      j.push(a[r[k].from + '--' + r[k].to])
    }

    return this.joins
  }

  rebuildGraphic () {
    const j = $('#sse_json', parent.document).val()

    if (j == '' || j === undefined) { return true }

    const J = JSON.parse(j)

    for (var i = 0; i < J.tables.length; i++) {
      if (typeof (parent.nuFORM.tableSchema[J.tables[i].tablename]) === 'undefined') {
        nuMessage(['No table named <b>' + J.tables[i].tablename + '</b>.'])

        return false
      }
    }

    for (var i = 0; i < J.tables.length; i++) {
      const t = J.tables[i]
      const cb = J.tables[i].checkboxes

      this.addBox(t.tablename, t.id)

      $('#' + t.id)
        .css('top', t.position.top)
        .css('left', t.position.left)

      $('#tablename' + t.id).html(t.tablename)
      $('#alias' + t.id).val(t.alias)
      $('#checkall' + t.id).prop('checked', t.checkall)

      for (let c = 0; c < cb.length; c++) {
        $('#select_' + c + '_' + t.id).prop('checked', cb[c])
      }
    }

    const r = J.joins				// -- JOIN

    for (const k in r) {
      const I = String(k).split('--')[0]
      var i = String(k).split('--')[1]

      this.joins[I + '--' + i] = r[k]
    }

    nuAngle()

    return true
  }

  addJoin (key, v) {
    const j = parent.$('#sse_json').val()

    if (j == '') {
      var J = { joins: [] }
    } else {
      var J = JSON.parse(j)
    }

    J.joins[key] = v

    const u = JSON.stringify(J)

    parent.$('#sse_json').val(u)
  }
}

//= ========functions==========================================================================

function nuUp (e) {
  const el = $(e.target)

  if (el.hasClass('nuTableName')) {
    window.nuY = parseInt($(e.target).parent().css('top'))
    window.nuX = parseInt($(e.target).parent().css('left'))
  }

  if (el.hasClass('nuBoxField')) {
    const id = String(window.nuCurrentID)

    if (id.split('_').length == 3) {							// -- eg. field_1_boxc14966188848055365
      const I = id
      const i = e.target.id

      if (I.split('_')[2] != i.split('_')[2]) {				// -- different box
        nuSQL.addJoin(I + '--' + i, '')
        nuAngle()
      }
    }
  }

  window.nuCurrentID = ''

  nuSQL.buildSQL()
}

function nuDown (e) {
  const el = $(e.target)

  if (el.hasClass('nuRelationships')) {
    nuChangeJoin(e)
    return
  }

  window.nuCurrentID = e.target.id

  if (el.hasClass('nuTableName')) {
    window.nuY = e.clientY - parseInt($(e.target).parent().css('top'))
    window.nuX = e.clientX - parseInt($(e.target).parent().css('left'))
  }
}

function nuMove (e) {
  if (window.nuCurrentID == '') { return }

  const el = $('#' + window.nuCurrentID)

  if (el.hasClass('nuTableName')) {
    if (e.buttons == 1) {
      if (e.clientY - window.nuY > 0) {
        el.parent().css('top', e.clientY - window.nuY)
      }
      if (e.clientX - window.nuX > 0) {
        el.parent().css('left', e.clientX - window.nuX)
      }

      nuAngle()
    }
  }
}

function nuAngle () {
  $('.nuRelationships').remove()

  const j = parent.$('#sse_json').val()

  if (j == '') { return }

  const J = JSON.parse(j)
  const r = J.joins
  const ok = []

  for (const key in r) {																// -- remove links to closed boxes
    const I = key.split('--')[0]
    var i = key.split('--')[1]

    if ($('#' + I).length == 1 && $('#' + i).length == 1) {
      ok[I + '--' + i] = r[key]
    }
  }

  nuSQL.refreshJoins(ok)

  for (const key in nuSQL.joins) {
    const F = $('#' + nuSQL.joins[key].from)
    const T = $('#' + nuSQL.joins[key].to)
    const f = F.offset()
    const t = T.offset()
    const d = Math.atan2(t.top - f.top, t.left - f.left) * 180 / Math.PI		// -- angle in degrees
    const w = Math.sqrt(Math.pow(f.top - t.top, 2) + Math.pow(f.left - t.left, 2))
    var i = 'joins' + nuID()
    const jt = nuSQL.joins[key].join
    const lm = 7

    var L = document.createElement('div')										// -- relationship box (line)

    L.setAttribute('id', i)

    $('body').append(L)

    $('#' + L.id).css({
      width: jt == 'LEFT' ? w - lm : w,
      height: 6,
      left: f.left,
      top: f.top,
      position: 'absolute',
      'text-align': 'center',
      border: 'rgba(255, 153, 0, .5) 0px solid',
      'border-left-width': jt == 'LEFT' ? lm : 0,
      'border-left-color': 'purple',
      'background-color': 'rgba(255, 153, 0, .5)',
      transform: 'rotate(' + d + 'deg)'
    })
      .attr('data-nu-join', key)
      .attr('title', jt + ' JOIN ON ' + nuSQL.joins[key].fromfield + ' = ' + nuSQL.joins[key].tofield + ' (Click to Change Join)')
      .addClass('nuRelationships')
      .hover(function () {
        $(this).css('border-top-width', 2)
        $(this).css('border-bottom-width', 2)
      }, function () {
        $(this).css('border-top-width', 0)
        $(this).css('border-bottom-width', 0)
      })

    var L = $('#' + L.id)
    const top = parseInt(f.top + f.top - L.top)
    const left = parseInt(f.left + f.left - L.left)

    $('#' + i)
      .css('top', top)
      .css('left', left)

    const Ltop = parseInt(L.css('top'))
    const Lleft = parseInt(L.css('left'))

    if (F.offset().top < T.offset().top) {
      L.css('top', 7 + Ltop + F.offset().top - L.offset().top)
    } else {
      L.css('top', 7 + Ltop + L.offset().top - F.offset().top)
    }

    if (F.offset().left < T.offset().left) {
      L.css('left', -20 + Lleft - (L.offset().left - F.offset().left))
    } else {
      L.css('left', -20 + Lleft - (L.offset().left - T.offset().left))
    }
  }
}

function nuChangeJoin (e) {
  const v = parent.$('#sse_json').val()
  const j = JSON.parse(v)
  const i = $(e.target).attr('data-nu-join')

  if (j.joins[i] == '') {
    j.joins[i] = 'LEFT'
  } else {
    j.joins[i] = ''
  }

  parent.$('#sse_json')
    .val(JSON.stringify(j))
    .change()

  nuSQL.buildSQL()
}
