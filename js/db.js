// eslint-disable-next-line no-unused-vars
function saveForLater(match) {
  dbPromised
    .then((db) => {
      const tx = db.transaction('matches', 'readwrite');
      const store = tx.objectStore('matches');
      store.put(match, match.id);
      return tx.complete;
    })
}

function getAll() {
  return new Promise((resolve) => {
    dbPromised
      .then((db) => {
        const tx = db.transaction('matches', 'readonly');
        const store = tx.objectStore('matches');
        return store.getAll();
      })
      .then((matches) => {
        resolve(matches);
      });
  });
}

function deletingSavedMatch(id) {
  dbPromised.then((db) => {
    const tx = db.transaction('matches', 'readwrite');
    const store = tx.objectStore('matches');
    store.delete(parseInt(id));
    return tx.complete;
  }).then(() => {
    getSavedSchedule();
  });
}

var dbPromised = idb.open('saved-match', 1, (upgradeDb) => {
  const matchsObjectStore = upgradeDb.createObjectStore('matches');
  matchsObjectStore.createIndex('id_match', 'id_match', { unique: true });
});
