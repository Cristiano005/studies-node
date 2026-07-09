const { Duplex } = require('stream')

class Calculate extends Duplex {

  constructor(options) {
    super(options)
    this.total = 0
    this.isChange = false
  }

  _read() {
    if(this.isChange) {
      this.push(this.total.toString())
      this.isChange = false
    }
  }

  _write(chunk, enconding, callback) {
    const result = chunk.toString().split(',').map(number => parseInt(number)).reduce((acumullate, total) => acumullate + total, 0)
    this.total += result
    this.isChange = true
    callback()
  }

}

const calculate = new Calculate

calculate.write("2,4,6")
calculate.write("10,20")

calculate.on('data', (chunk) => {
  console.log(`Soma total: ${chunk.toString()}`)
})

calculate.end()