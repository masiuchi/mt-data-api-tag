require('../core/Dummy.tag')

<mtcategories>
  <mtdummy each={ category, i in categories }><yield/></mtdummy>

  <script>
    const dataapi = require('../../data-api.js')

    this.blog_id = opts.blog_id

    this.categories = []
    this.categoriesCount = 0

    const self = this
    this.on('mount', () => {
      if (!this.blog_id) {
        console.log('MTCategories tag needs blog_id parameter.')
        return
      }

      dataapi.listCategories(self.blog_id, (response) => {
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
</mtcategories>
