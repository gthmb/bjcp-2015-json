# BJCP 2015 Style Guidelines as JSON format

The BJCP guidelines in the JSON format. The data was sourced from [seth-k/BJCP-styles-XML](https://github.com/seth-k/BJCP-styles-XML "2015 XML source") and converted into JSON. 

# BJCP 2015 Style Guidelines as JSON format

The BJCP guidelines in the JSON format. The data was sourced from [seth-k/BJCP-styles-XML](https://github.com/seth-k/BJCP-styles-XML "2015 XML source") and converted into JSON. 

## Running
install the node dependancies
```
npm install
```

run the script
```
node index.js
```

## Coverting the raw XML from seth-k/BJCP-styles-XML
The script will use the locallly store version of the XML by default. However, if you'd like to convert the source from the seth-k repo, you can pass the `useRemote=true` argument
```
node index.js useRemote=true
```

## Saving as a different file
By default, the JSON will be saved in `json/style-guide-2015.min.json`, if you'd like to give it a different name you can pass the `dest={path}` argument
```
node index.js dest=./json/foo.json
```
