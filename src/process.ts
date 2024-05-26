import { z } from 'zod'
import { q } from './q'
import { query } from './main'
import Bull from 'bull'
import { resolve } from 'path'
import { downloadFile } from './util/download'
import { randomUUID } from 'crypto'
import sharp from 'sharp'

q.process(async (job: Bull.Job<z.infer<typeof query>>, done) => {
    try{
        job.log('processing has been started')
    
        job.progress(10)

        // download it
        // save it
        const path = await downloadFile(job.data.image_url, resolve(__dirname, '../store/', randomUUID() + '.jpg'))
        job.progress(40)


        // check metadata

        await sharp(path).metadata()
        job.log(`file has been stored at path ${path}`)

        job.progress(50)



        const convertedFile = resolve(__dirname, '../converted/', randomUUID() + '.jpg')

        // rotate it
        // save it
        await sharp(path).rotate().resize(200).jpeg({ mozjpeg: true }).toFile(convertedFile)
        job.progress(100)

        // failure
        // progress
        // success

        done(null, {status: true, paths: {
            original: path,
            converted: convertedFile
        }})

        
    }catch(e){
        console.error(e)
        done(e as Error)
    }
})