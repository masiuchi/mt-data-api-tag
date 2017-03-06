require('../core/Dummy.tag')

<mtassets>
  <mtdummy each={ asset, i in assets }><yield/></mtdummy>

  <script>
    const dataapi = require('../../data-api.js')

    this.assets = []

    const self = this

    this.on('mount', () => {
      let blog_id;
      if (opts.blog_id !== undefined && opts.blog_id !== null) {
        blog_id = opts.blog_id
      } else if (self.blog) {
        blog_id = self.blog.id
      }

      if (blog_id === undefined) {
        return
      }

      dataapi.listAssets(blog_id, (response) => {
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
