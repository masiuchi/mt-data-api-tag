<mtentriesfooter>
  <div if={ isLast }><yield/></div>

  this.isLast = false

  this.on('update', function() {
    if (this.parent && this.parent.parent) {
      if (this.parent.parent.entries.length === 0
        || this.parent.parent.entries.length - 1 === this.i)
      {
        this.isLast = true
      } else {
        this.isLast = false
      }
    } else {
      this.isLast = false
    }
    this.update()
  })
</mtentriesfooter>
