require('../core/Dummy.tag')

<mtblogs>
  <mtdummy each={ blog, i in blogs }><yield/></mtdummy>

  <script>
    const dataapi = require('../../data-api.js')

    this.blogs = []

    const self = this

    this.on('mount', () => {
      const limit = opts.limit || 25
      self.fetch(limit, 100, 0)
    })

    this.fetch = (totalLimit, limit, offset) => {
      dataapi.listSites({ limit: limit, offset: offset }, (response) => {
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
          if (item.class === 'blog') {
            self.blogs.push(item)
          }
        }

        if (response.totalResults <= limit * (offset + 1)
          || self.blogs.length >= totalLimit)
        {
          while (self.blogs.length > totalLimit) {
            self.blogs.pop()
          }
          self.update()
          return
        }

        self.fetch(totalLimit, limit, offset + limit)
      })
    }
  </script>
</mtblogs>
