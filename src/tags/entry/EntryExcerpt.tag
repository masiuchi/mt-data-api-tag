<mtentryexcerpt>
  <yield/>

  <script>
    this.on('update', function () {
      if (this.entry && this.entry.excerpt) {
        this.root.innerHTML = this.entry.excerpt
      }
    })
  </script>
</mtentryexcerpt>
