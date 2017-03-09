require('../core/Dummy.tag')

<mtfolders>
  <mtdummy each="{ category, i in categories }"><yield/></mtdummy>

  <script>
    const dataapi = require('../../MTDataAPITag.js')

    if ('blog_id' in opts) {
      this.blog_id = opts.blog_id
    } else {
      this.blog_id = dataapi.blogId
    }

    this.categories = []
    this.categoriesCount = 0

    const self = this
    this.on('mount', () => {
      if (this.blog_id === null || this.blog_id === undefined) {
        console.log('MTFolders tag needs blog_id parameter.')
        return
      }

      dataapi.client.listFolders(self.blog_id, (response) => {
        if (response.error) {
          console.log(response.error)
          return
        }

        self.categories = response.items
        self.categoriesCount = response.totalResults

        self.update()
      })
    })
  </script>
</mtfolders>
