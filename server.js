// PANGGIL MODULE MODULE YANG DIPERLUKAN BUAT BIKIN SERVER DAN PANGGIL EXPRESS NYA
const express = require("express")

// BIKIN SERVER
const app = express()

// BUAT RUNNNING SERVER NYA
app.listen(process.env.PORT, function () {
    console.log(`Server berjalan di PORT ${process.env.PORT}`)
})