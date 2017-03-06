<mtentrybody>
  <yield/>

  <script>
    this.on('update', () => {
      if (this.entry && this.entry.body) {
        this.root.innerHTML = this.entry.body
      }
    })
  </script>
</mtentrybody>
