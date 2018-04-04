const Busboy = require('busboy')
const path = require('path')

module.exports = function(ctx, filePath) {
    const { req, res } = ctx

    const headers = req.headers

    const phone = headers.phone

    const busboy = new Busboy({ headers })

    let filePath = path.resolve(__dirname, `../files/${phone}`)

    if (!fs.existsSync(filePath)) fs.mkdirSync(filePath)

    return new Promise((resolve, reject) => {
        
    })
}