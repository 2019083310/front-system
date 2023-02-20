const fs=require('fs')
const zlib=require('zlib')

const gzip=zlib.createGzip()

const readStream=fs.createReadStream('./a.txt')
const writeStream=fs.createWriteStream('./b2.gzip')

readStream.pipe(gzip).pipe(writeStream)

// readStream.pipe(writeStream)