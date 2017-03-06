require('../core/Dummy.tag')

<mtcomments>
  <mtcomment each={ comment, i in comments }><yield/></mtcomment>

  <script>
    const dataapi = require('../../data-api.js')

    this.blog_id = opts.blog_id

    this.comments = []
    this.commentsCount = 0

    const self = this
    this.on('mount', () => {
      if (!self.blog_id) {
        console.log('MTComments tag needs blog_id parameter.')
        return
      }

      dataapi.listComments(self.blog_id, self.makeParams(), (response) => {
        if (response.error) {
          console.log(response.error)
          return
        }

        self.comments = response.items
        self.commentsCount = response.totalResults

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
</mtcomments>
