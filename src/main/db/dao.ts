import log from 'electron-log';
import Datastore from 'nedb';

interface SampleDoc {
  name: string;
  quantity: number;
}

class Dao {
  dataStore: Datastore;

  constructor() {
    this.dataStore = new Datastore({
      filename: 'data/data.db',
      autoload: true,
    });
  }

  logFoundSampleDocs = (_err: Error | null, docs: SampleDoc[]) => {
    // results
    log.info('Found in db', docs);
  };

  logSavedDoc = (_err: Error | null, newDoc: SampleDoc) => {
    // newDoc is the newly inserted document
    log.info('Saved to db', newDoc);
  };

  runSample = async () => {
    try {
      const db = this.dataStore;
      const doc = { name: 'product001', quantity: 100 };

      db.insert(doc, this.logSavedDoc);
      db.find({ name: 'product001' }, this.logFoundSampleDocs);
    } catch (err) {
      log.error(err);
    } finally {
      await this.dataStore.close();
    }
  };
}

export default Dao;
