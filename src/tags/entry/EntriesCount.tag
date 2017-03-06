<mtentriescount>
  { entriesCount }<yield/>

  <script>
    this.on('mount', function() {
      if (this.parent && this.parent.parent && this.parent.parent.entriesCount) {
        this.entriesCount = this.parent.parent.entriesCount
        this.update()
      } else {
        var params = { field: "id" }
        dataapi.listEntries(2, params, function(response) {
          if (response.error) {
            console.log(response.error)
            this.entriesCount = -1
          }
          this.entriesCount = response.totalResults
          this.update()
        })
      }
    })
  </script>
</mtentriescount>
