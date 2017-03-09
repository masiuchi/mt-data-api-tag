const riot = require('riot')
const DataAPI = require('./mt-data-api.min.js')

module.exports = {
  baseUrl: '',
  clientId: 'mt-data-api-tag',
  blogId: 0,
  blog: null,
  client: null,

  rebuild: function (args) {
    if (!args || !('baseUrl' in args)) {
      console.log('baseUrl parameter is required')
      return
    } else {
      this.baseUrl = args.baseUrl
    }
    if ('clientId' in args) {
      this.clientId = args.clientId
    }
    if ('blogId' in args) {
      this.blogId = args.blogId
    }

    const self = this
    this.client = new DataAPI({
      baseUrl: self.baseUrl,
      clientId: self.clientId
    })
    if (this.blogId) {
      this.client.getBlog(this.blogId, function(response) {
        if (response.error) {
          console.log(`cannot get blog (blog_id: ${self.blogId})`)
          return
        }
        self.blog = response
        riot.mount('*')
      })
    } else {
      riot.mount('*')
    }
  }
}
