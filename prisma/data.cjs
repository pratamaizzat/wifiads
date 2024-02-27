/* eslint-disable @typescript-eslint/no-var-requires */
const argon2 = require('argon2')

async function generateData() {
  return {
    admins: [
      {
        username: "support",
        password: await argon2.hash("support123!!!")
      },
      {
        username: "support2",
        password: await argon2.hash("support123!!!")
      },
    ],
    hotspots: {
      duration: "30",
      upSpeed: "3000",
      downSpeed: "3000",
      maxBytes: "1000000",
      redirectUrl: "http://localhost:3000/logged"
    },
    portal: {
      key: "default/example-ads.jpg",
      title: "Nama Disini",
      message: "Pesan Disini",
      keyAds: "default/example-ads.mp4"
    }
  }
}

module.exports = generateData