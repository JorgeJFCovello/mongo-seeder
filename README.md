# mongo-seeder
## How it Works?
You need a configuration file (config.js) which must have the current structure:
```
{
    "uri":"mongodb://root:root@localhost:27017",
    "collections":["collectionJsFile"],
    "folder":"folderWhereJsFileIs",
    "tlsCAFile":"folderToTlsCAFile",
    "schema":"yourSchemaName"
}
```
Each field has its own meaning:
- uri: it's mongo uri could be localhost as it is in the example or it could be a uri from a mongo porvider such as AWS or mongoAtlas
- collections: each one could be your seeder files inside the folder you choose. If you have many collections related one each other you must use them inside the same file.
- folder: where your seeder files are
- tlsCAFile: your .pem file in case you need it
- schema: It's your mongo db schema. It's created at first as Admin, local and config

## Running mongo seeder
You must run the app as `node index.js --config pathToYourConfig`
