require('../core/Dummy.tag')

<mtpingentry>
  <mtdummy each={ entry in entries }><yield/></mtdummy>

  <script>
    const dataapi = require('../../MTDataAPITag.js')
    const self = this
    this.on('mount', () => {
      if (!self.ping) {
        console.log('no ping context')
        return
      }

      dataapi.client.getEntry(self.ping.blog.id, self.ping.entry.id, (response) => {
        if (response.error) {
          console.log(response.error)
          return
        }

        self.entries = [response]
        self.update()
      })
    })
  </script>
</mtpingentry>
