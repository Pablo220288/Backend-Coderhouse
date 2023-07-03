const str = document.getElementById('error403').innerHTML.toString()
let i = 0
document.getElementById('error403').innerHTML = ''

setTimeout(function () {
  const se = setInterval(function () {
    i++
    document.getElementById('error403').innerHTML = str.slice(0, i) + '|'
    if (i === str.length) {
      clearInterval(se)
      document.getElementById('error403').innerHTML = str
    }
  }, 10)
}, 0)
