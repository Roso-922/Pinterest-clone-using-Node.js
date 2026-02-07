const multer = require("multer")
const {v4:uuid} = require("uuid")
const path = require("path")


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)  
    const filename = uuid() + ext                 
    cb(null, filename)
  }
})

const upload = multer({ storage: storage })

module.exports = upload