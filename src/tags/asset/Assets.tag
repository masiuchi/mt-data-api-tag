require('../core/Dummy.tag')

<mtassets>
  <mtdummy each={ asset, i in assets }><yield/></mtdummy>

  <script>
    const dataapi = require('../../MTDataAPITag.js')

    if ('blog_id' in opts) {
      this.blog_id = opts.blog_id
    } else if (this.blog) {
      this.blog_id = this.blog.id
    } else {
      this.blog_id = dataapi.blogId
    }

    this.assets = []

    const self = this

    this.on('mount', () => {
      if (self.blog_id === null || self.blog_id === undefined) {
        console.log('MTAssets tag need blog_id parameter')
        return
      }

      dataapi.client.listAssets(self.blog_id, (response) => {
        if (response.error) {
          console.log(response.error)
          list.assets = []
          self.update()
          return
        }

        self.assets = response.items
        self.update()
      })
    })

  </script>
</mtassets>
