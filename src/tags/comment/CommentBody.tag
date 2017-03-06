<mtcommentbody>
  <div></div><yield/>

  <script>
    this.on('update', () => {
      if (this.comment && this.comment.body) {
        this.root.childNodes[0].innerHTML = this.comment.body
      }
    })
  </script>
</mtcommentbody>
