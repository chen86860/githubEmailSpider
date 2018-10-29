const fs = require('fs-extra')
const Crawler = require('crawler')
const unique = require('./base/util').unique
const ACCESS_TOKEN = ''

const userNameList = JSON.parse(fs.readFileSync('userNameList.json'))
const userNameListFullUrl = userNameList.map(username => ({
  url: `https://api.github.com/users/${username}/events/public?access_token=${ACCESS_TOKEN}`,
  headers: { 'user-agent': 'github' },
}))

const userNameListData = []

// init the spider
const spider = new Crawler({
  maxConnections: 6,
  jQuery: false,
  callback(err, res, done) {
    if (err) {
      console.log('err', err)
    } else {
      const data = res.body
      const jsonDataArr = JSON.parse(data)
      const payloadArr = jsonDataArr
        .map(item => {
          if (item.payload && item.payload.commits && item.payload.commits) {
            const authorArr = item.payload.commits.map(item => item.author)
            const authorArrFlat = [].concat(...authorArr)
            return unique(authorArrFlat)
          } else {
            return null
          }
        })
        .filter(item => item !== null)

      if (payloadArr && Array.isArray(payloadArr) && payloadArr.length > 0) {
        const payloadArrFlat = [...new Set(payloadArr)]
        userNameListData.push(payloadArrFlat)
      }
    }
    done()
  },
})

// add to queue
spider.queue(userNameListFullUrl)

// add drain event listener
spider.on('drain', () => {
  fs.writeFileSync('userNameListData2.json', JSON.stringify(userNameListData))
})
