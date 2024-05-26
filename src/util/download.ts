import fs from 'node:fs'
import stream from 'stream'
import axios, { AxiosError } from 'axios'

export async function downloadFile(url: string | URL, path: string){

    if(typeof url === 'string'){
        url = new URL(url)
    }
    
    const { data } = await axios.get(url.toString(), {responseType: 'stream'});

    if(!(data instanceof stream.Readable)){
        throw new AxiosError(`data is not the type of stream`)
    }

    return new Promise<string>((resolve, reject) => {
        data
          .pipe(fs.createWriteStream(path))
          .on('finish', () => resolve(path))
          .on('error', (e: any) => {
            console.error(e)
            reject(new AxiosError(e.message))
          });
      })
}