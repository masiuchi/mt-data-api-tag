<mtcommentbody>
  <yield/>

  <script>
    this.on('update', () => {
      if (this.comment && this.comment.body) {
        this.root.innerHTML = this.comment.body
      }
    })
  </script>
</mtcommentbody>
