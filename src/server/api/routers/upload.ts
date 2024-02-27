import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs';

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import bucketClient from '~/utils/bucket';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { BUCKET } from '~/constants/bucket';

export const uploadRouter = createTRPCRouter({
  createPresignUrl: publicProcedure.query(async () => {
    const key = `${dayjs().format('MMYYYY')}/${uuidv4()}`

    const url = await getSignedUrl(bucketClient, new PutObjectCommand({
      Bucket: BUCKET,
      Key: key
    }))


    return {
      url,
      key
    }
  }),

  createPresignUrlV2: publicProcedure.mutation(async () => {
    const key = `${dayjs().format('MMYYYY')}/${uuidv4()}`

    const url = await getSignedUrl(bucketClient, new PutObjectCommand({
      Bucket: BUCKET,
      Key: key
    }))


    return {
      url,
      key
    }
  })
});
