const CONFIG = {}
CONFIG.localport = 3000
CONFIG.port = process.env.PORT || CONFIG.localport
CONFIG.publicDir = 'www'

module.exports = CONFIG
