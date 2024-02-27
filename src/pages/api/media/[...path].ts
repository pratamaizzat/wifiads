import { GetObjectCommand } from '@aws-sdk/client-s3'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Readable } from 'stream'
import { BUCKET } from '~/constants/bucket'
import bucketClient from '~/utils/bucket'
 
async function getFileStream(fileKey: string) {

  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: fileKey
  })

  const response = await bucketClient.send(command);
  const body = response.Body;

  if (!body) {
    throw new Error('File not found');
  }

  return body;

}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query 
  const key = (path as string[]).join("/")

 try {
    const stream = await getFileStream(key);

    if (!(stream instanceof Readable)) {
      throw new Error('Stream is not readable');
    }

    // res.setHeader('Content-Type', 'application/octet-stream');
    stream.pipe(res);
  } catch (error) {
    console.error('Error fetching file:', error);
    return res.status(500).send('Internal Server Error');
  }
}