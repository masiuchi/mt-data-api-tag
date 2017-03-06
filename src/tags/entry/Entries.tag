require('../core/Dummy.tag')

<mtentries>
  <mtdummy each={ entry, i in entries }><yield/></mtdummy>

  <script>
    const dataapi = require('../../data-api.js')

    this.blog_id = opts.blog_id

    this.entries = []
    this.entriesCount = 0

    const self = this
    this.on('mount', () => {
      if (!self.blog_id) {
        console.log('MTEntries tag needs blog_id parameter.')
        return
      }

      dataapi.listEntries(self.blog_id, self.makeParams(), (response) => {
        if (response.error) {
          console.log(response.error)
          return
        }

        self.entries = response.items
        self.entriesCount = response.totalResults

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
</mtentries>
