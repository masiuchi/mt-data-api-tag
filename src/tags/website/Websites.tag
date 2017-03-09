require('../core/Dummy.tag')

<mtwebsites>
  <mtdummy each={ website, i in websites }><yield/></mtdummy>

  <script>
    const dataapi = require('../../MTDataAPITag.js')

    this.websites = []

    const self = this

    this.on('mount', () => {
      const limit = opts.limit || 25
      self.fetch(limit, 100, 0)
    })

    this.fetch = (totalLimit, limit, offset) => {
      dataapi.client.listSites({ limit: limit, offset: offset }, (response) => {
        if (response.error) {
          console.log(response.error)
          self.update()
          return
        }

        if (response.items.length === 0) {
          self.update()
          return
        }

        for (let i = 0; i < response.items.length; i++) {
          const item = response.items[i]
          if (item.class === 'website') {
            self.websites.push(item)
          }
        }

        if (response.totalResults <= limit * (offset + 1)
          || self.websites.length >= totalLimit)
        {
          while (self.websites.length > totalLimit) {
            self.websites.pop()
          }
          self.update()
          return
        }

        self.fetch(totalLimit, limit, offset + limit)
      })
    }
  </script>
</mtwebsites>
