<mtentrymore>
  <yield/>

  <script>
    this.on('update', function() {
      if (this.entry && this.entry.more) {
        this.root.childNodes[0].innerHTML = this.entry.more
      }
    })
  </script>
</mtentrymore>
