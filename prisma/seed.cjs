/* eslint-disable @typescript-eslint/no-var-requires */
const { PrismaClient } = require('@prisma/client')
const generateData = require('./data.cjs')


const prisma = new PrismaClient()

const load = async () => {
  try {
    await prisma.admin.deleteMany()
    console.log('Deleted records in Admin table')


    await prisma.$queryRaw`ALTER TABLE admins AUTO_INCREMENT = 1`
    console.log('reset product auto increment to 1')


    await prisma.admin.createMany({
      data: (await generateData()).admins
    })
    console.log('Added Admin data')

    await prisma.hotspot.deleteMany()
    console.log('Deleted records in Hotspot table')


    await prisma.$queryRaw`ALTER TABLE hotspots AUTO_INCREMENT = 1`
    console.log('reset product auto increment to 1')


    await prisma.hotspot.create({
      data: (await generateData()).hotspots
    })
    console.log('Added Hotspot data')

    await prisma.portal.deleteMany()
    console.log('Deleted records in Portal table')


    await prisma.$queryRaw`ALTER TABLE portals AUTO_INCREMENT = 1`
    console.log('reset portals auto increment to 1')


    await prisma.portal.create({
      data: (await generateData()).portal
    })
    console.log('Added Hotspot data')
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}


load()