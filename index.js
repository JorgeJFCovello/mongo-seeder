// require the necessary libraries
const MongoClient = require("mongodb").MongoClient;
const fs = require('fs')
const args = require('args')

args.options([
  {
  name: 'config',
  description: 'Json configuration file path',
  defaultValue: './config.json'
}
])


const cleanDB = async (db, collections) => {
  try {
    await Promise.all(collections.map(async (collection) => await db.collection(collection).drop()))
  } catch(err) {
    console.log('Error while cleanning database: ',err)
  }
}
const createCollections = async (db,collections) => {
  try {
    await Promise.all(collections.map(async (collection) => await db.createCollection(collection)))
    } catch(err) {
    console.log('Error while creating collections: ',err)
  }
}

const seeds = async (db, folder, collections) => {
  console.log('Dropping collections')  
  await cleanDB(db, collections)
  console.log('Creating collections')
  await createCollections(db,collections)
  console.log('Seeding collections')
  try {
    const promises = (collections.map(async(collection) => {
      await (require(`${folder || '.'}/${collection}`)(db))
    }))

    for( const promise of promises) {
      await promise
    }
  } catch(err){
    console.log('Error while seeding database: ',err)
  }
}
// Connection URL
//const uri = "mongodb://sherlock:root@localhost:27017"//"mongodb://SherlockRoot:SH3rl0ckR00t@docdb-2022-08-13-19-01-10.cluster-csd1nltwgzc6.us-east-1.docdb.amazonaws.com:27017/?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false"
//const tlsCAFile =  "C:/Users/covel/Documents/GitHub/mongo-seeds/rds-combine-ca-bundle.pem"

async function seedDB(uri, collections, folder, tlsCAFile, schema) {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
          tlsCAFile
    });

    try {
        await client.connect();
        console.log("Connected correctly to server");
        const db = await client.db(schema)
        await seeds(db, folder, collections)
        console.log("Database seeded! :)");
        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}
try{
  const flags = args.parse(process.argv)
  const {uri, collections, folder, tlsCAFile, schema} = JSON.parse(fs.readFileSync(flags.config, 'utf8'))
  seedDB(uri, collections, folder, tlsCAFile, schema);
} catch (err) {
  console.log('Could not get config',err);
} 

