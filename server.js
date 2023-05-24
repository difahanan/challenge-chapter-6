// IMPOR MODULE 
const { Car, hero, buy, sequelize, Sequelize } = require('./models')

// PANGGIL EXPRESS NYA
const express = require('express')

// BIKIN SERVER
const app = express()

// CONFIG EJS
app.set('view engine', 'ejs')

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }))

const postgresqlDb = require('./db/postgresql')

app.post('/login', async function (req, res) {
  try {
    const data = req.body;
    const queryData = await postgresqlDb.query('SELECT * FROM public.user WHERE username = $1', [data.username])
    const userData = queryData.rows[0];
    // BANDINGKAN USERNAME & PASSWORD
    if (userData === null) {
      res.json({ data: 'Email/password salah !' })
    } else {
      if (data.password === userData.password) {
        res.json({ data: 'Succes' })
      } else {
        res.json({ data: 'Email/password salah !' })
      }
    }
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal server error')
  }
})

app.get('/', async function (req, res) {
  try {
    // AMBIL DATA HERO DI DATABASE
    let heroData = await hero.findAll()
    heroData = heroData.map(function (data) {
      return data.toJSON()
    })
    // TAMPILKAN HALAMAN
    res.render('index', { hero: heroData })
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error')
  }
})

app.post('/item/add', function (req, res) {
  res.render('item_add', { heroId: req.query.heroId })
})

app.get('/item/add', async function (req, res) {
  const transaction = await sequelize.transaction()
  try {
    const heroId = req.query.heroId
    // AMBIL DATA DARI BODY
    const { ...sisa } = req.body
    // SIMPAN DATA KE DATABASE
    await buy.create({ ...sisa, heroId }, { transaction })
    await transaction.commit()
    // KALAU BERHASIL REDIRECT KE HALAMAN UTAMA
    res.redirect('/hero/biodata?id=' + heroId)
  } catch (error) {
    await transaction.rollback()
    console.log(error)
    res.status(500).send('Internal Server Error!');
  }
})

app.get('/hero/add', function (req, res) {
  res.render('hero_upsert', { isUpdate: false })
})

app.post('/hero/add', async function (req, res) {
  const transaction = await sequelize.transaction()
  try {
    // AMBIL DATA DARI BODY
    const { heroName, role, emblem, ...sisa } = req.body
    // SIMPAN DATA KE DATABASE
    const heroData = await hero.create({ heroName, role, emblem }, { transaction })
    await buy.create({ ...sisa, heroId: heroData.id }, { transaction })
    await transaction.commit()
    // KALAU BERHASIL REDIRECT KE HALAMAN UTAMA
    res.redirect('/')
  } catch (error) {
    await transaction.rollback()
    console.log(error)
    res.status(500).send('Internal Server Error!');
  }
})

app.get('/hero/biodata/', async function (req, res) {
  try {
    const id = req.query.id
    // AMBIL DATA EXISTING DI DATABASE
    const heroData = await hero.findOne({
      where: { id },
      attributes: [
        'id',
        'heroName',
        'role',
        'emblem'
      ],
      include: [
        {
          model: buy,
          attributes: ['itemName', 'amount']
        }
      ]
    })
    console.log(heroData.toJSON())
    res.render('biodata', { hero: heroData.toJSON() })
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error')
  }
})

app.get('/hero/update/', async function (req, res) {
  try {
    const id = req.query.id
    // AMBIL DATA EXISTING DI DATABASE
    const heroData = await hero.findOne({
      where: { id },
      attributes: [
        'id',
        'heroName',
        'role',
        'emblem',
        [Sequelize.col('"buys"."item_name"'), 'itemName'],
        [Sequelize.col('"buys"."amount"'), 'amount'],
      ],
      include: [
        {
          model: buy,
          attributes: []
        }
      ]
    })
    res.render('hero_upsert', { hero: heroData.toJSON(), isUpdate: true })
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error')
  }
})

app.post('/hero/update', async function (req, res) {
  const transaction = await sequelize.transaction()
  try {
    // AMBIL DATA QUERY
    const id = req.query.id
    // AMBIL DATA DARI BODY
    const { heroName, role, emblem, ...sisa } = req.body
    // UPDATE DATANYA
    const heroData = await hero.update({ heroName, role, emblem }, { where: { id }, transaction })
    await buy.update({ ...sisa, heroId: heroData.id }, { where: { heroId: id }, transaction })
    await transaction.commit()
    // KALAU BERHASIL REDIRECT KE HALAMAN UTAMA
    res.redirect('/')
  } catch (error) {
    await transaction.rollback()
    console.log(error);
    res.status(500).send('Internal server error')
  }
})

app.post('/hero/delete', async function (req, res) {
  const transaction = await sequelize.transaction()
  try {
    // AMBIL DATA QUERY
    const id = req.query.id
    // UPDATE DATANYA
    await buy.destroy({ where: { heroId: id }, transaction })
    await hero.destroy({ where: { id }, transaction })
    await transaction.commit()
    // JIKA BERHASIL, REDIRECT KE HALAMAN UTAMA
    res.redirect('/')
  } catch (error) {
    await transaction.rollback()
    console.log(error)
    res.status(500).send('Internal server error !')
  }
})

// BUAT RUNNNING SERVER NYA
app.listen(process.env.PORT, function () {
  console.log(`Server berjalan di PORT ${process.env.PORT}`)
})