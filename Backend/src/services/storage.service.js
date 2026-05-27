
import ImageKit from '@imagekit/nodejs';

import { config } from '../config/config.js';


const client = new ImageKit({
  privateKey: process.env['IMAGEKIT_PRIVATE_KEY'],
});


export async function uploadFile({buffer,fileName,folder="Demo"})
{
    const result = await client.files.upload({
        files:await ImageKit.toFile(buffer),
        fileName,
        folder
    })
     return result
}