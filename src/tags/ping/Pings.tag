require('../core/Dummy.tag')

<mtpings>
  <mtdummy each={ ping, i in pings }><yield/></mtdummy>

  <script>
    const dataapi = require('../../MTDataAPITag.js')

    if ('blog_id' in opts) {
      this.blog_id = opts.blog_id
    } else {
      this.blog_id = dataapi.blogId
    }

    this.pings = []
    this.pingsCount = 0

    const self = this
    this.on('mount', () => {
      if (self.blog_id === null || self.blog_id === undefined) {
        console.log('MTPings tag needs blog_id parameter.')
        return
      }

      dataapi.client.listTrackbacks(self.blog_id, self.makeParams(), (response) => {
        if (response.error) {
          console.log(response.error)
          return
        }

        self.pings = response.items
        self.pingsCount = response.totalResults

        self.update()
      })
    })

    this.makeParams = () => {
      var params = {}

      if (this.limit) {
        params.limit = this.limit
      }
      if (this.offset) {
        params.offset = this.offset
      }

      return params
    }
  </script>
</mtpings>
