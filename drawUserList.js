const fs = require('fs-extra')
const Crawler = require('crawler')

const requestList = [
  'https://github.com/ruanyf?after=Y3Vyc29yOnYyOpK5MjAxOC0xMC0xNlQyMDowMjo0MSswODowMM4CScQF&tab=followers',
]

let userNameArr = []
const spider = new Crawler({
  maxConnections: 10,
  callback(err, res, done) {
    if (err) {
      console.log('err', err)
    } else {
      var $ = res.$
      const userNameList = Array.from($('.d-table-cell.col-9.v-align-top.pr-3 a[href]'))
      userNameList.forEach(item => {
        const userName = $(item)
          .attr('href')
          .replace(/^\//gi, '')
        userNameArr.push(userName)
      })
    }
    done()
  },
})

spider.queue(requestList)

spider.on('drain', () => {
  fs.writeFileSync('userNameList.json', JSON.stringify(userNameArr))
})
