const designerTables = [
  {
    name: 'pdf_pages',
    key: 'pgNr',
    autoIncrement: true
  },
  {
    name: 'table_coords',
    key: 'id',
    autoIncrement: true
  }
]

// eslint-disable-next-line no-unused-vars
const DesignerOfflineDB = (function () {
  const designerDB = {}

  /**
     * @type {IDBDatabase|null}
     */
  let datastore = null

  /**
     * @param {String} table
     * @return {IDBTransaction}
     */
  designerDB.getTransaction = function (table) {
    return datastore.transaction([table], 'readwrite')
  }

  /**
     * @param {String} table
     * @return {IDBObjectStore}
     */
  designerDB.getObjectStore = function (table) {
    const transaction = designerDB.getTransaction(table)
    const objStore = transaction.objectStore(table)
    return objStore
  }

  /**
     * @param {IDBTransaction} transaction
     * @param {String} table
     * @return {IDBObjectStore}
     */
  designerDB.getCursorRequest = function (transaction, table) {
    const objStore = transaction.objectStore(table)
    const keyRange = IDBKeyRange.lowerBound(0)
    const cursorRequest = objStore.openCursor(keyRange)
    return cursorRequest
  }

  /**
     * @param {Function} callback
     * @return {void}
     */
  designerDB.open = function (callback) {
    const version = 1
    const request = window.indexedDB.open('pma_designer', version)

    request.onupgradeneeded = function (e) {
      const db = e.target.result
      e.target.transaction.onerror = designerDB.onerror

      let t
      for (t in designerTables) {
        if (db.objectStoreNames.contains(designerTables[t].name)) {
          db.deleteObjectStore(designerTables[t].name)
        }
      }

      for (t in designerTables) {
        db.createObjectStore(designerTables[t].name, {
          keyPath: designerTables[t].key,
          autoIncrement: designerTables[t].autoIncrement
        })
      }
    }

    request.onsuccess = function (e) {
      datastore = e.target.result
      if (typeof callback === 'function') {
        callback(true)
      }
    }

    request.onerror = designerDB.onerror
  }

  /**
     * @param {String} table
     * @param {String} id
     * @param {Function} callback
     * @return {void}
     */
  designerDB.loadObject = function (table, id, callback) {
    const objStore = designerDB.getObjectStore(table)
    const cursorRequest = objStore.get(parseInt(id))

    cursorRequest.onsuccess = function (e) {
      callback(e.target.result)
    }

    cursorRequest.onerror = designerDB.onerror
  }

  /**
     * @param {String} table
     * @param {Function} callback
     * @return {void}
     */
  designerDB.loadAllObjects = function (table, callback) {
    const transaction = designerDB.getTransaction(table)
    const cursorRequest = designerDB.getCursorRequest(transaction, table)
    const results = []

    transaction.oncomplete = function () {
      callback(results)
    }

    cursorRequest.onsuccess = function (e) {
      const result = e.target.result
      if (Boolean(result) === false) {
        return
      }
      results.push(result.value)
      result.continue()
    }

    cursorRequest.onerror = designerDB.onerror
  }

  /**
     * @param {String} table
     * @param {Function} callback
     * @return {void}
     */
  designerDB.loadFirstObject = function (table, callback) {
    const transaction = designerDB.getTransaction(table)
    const cursorRequest = designerDB.getCursorRequest(transaction, table)
    let firstResult = null

    transaction.oncomplete = function () {
      callback(firstResult)
    }

    cursorRequest.onsuccess = function (e) {
      const result = e.target.result
      if (Boolean(result) === false) {
        return
      }
      firstResult = result.value
    }

    cursorRequest.onerror = designerDB.onerror
  }

  /**
     * @param {String} table
     * @param {Object} obj
     * @param {Function} callback
     * @return {void}
     */
  designerDB.addObject = function (table, obj, callback) {
    const objStore = designerDB.getObjectStore(table)
    const request = objStore.put(obj)

    request.onsuccess = function (e) {
      if (typeof callback === 'function') {
        callback(e.currentTarget.result)
      }
    }

    request.onerror = designerDB.onerror
  }

  /**
     * @param {String} table
     * @param {String} id
     * @param {Function} callback
     * @return {void}
     */
  designerDB.deleteObject = function (table, id, callback) {
    const objStore = designerDB.getObjectStore(table)
    const request = objStore.delete(parseInt(id))

    request.onsuccess = function () {
      if (typeof callback === 'function') {
        callback(true)
      }
    }

    request.onerror = designerDB.onerror
  }

  /**
     * @param {Error} e
     * @return {void}
     */
  designerDB.onerror = function (e) {
    // eslint-disable-next-line no-console
    console.log(e)
  }

  // Export the designerDB object.
  return designerDB
}())
