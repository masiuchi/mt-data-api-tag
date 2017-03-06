require('../core/Dummy.tag')

<mtpings>
  <mtdummy each={ ping, i in pings }><yield/></mtdummy>

  <script>
    const dataapi = require('../../data-api.js')

    this.blog_id = opts.blog_id

    this.pings = []
    this.pingsCount = 0

    const self = this
    this.on('mount', () => {
      if (!self.blog_id) {
        console.log('MTPings tag needs blog_id parameter.')
        return
      }

      dataapi.listTrackbacks(self.blog_id, self.makeParams(), (response) => {
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
