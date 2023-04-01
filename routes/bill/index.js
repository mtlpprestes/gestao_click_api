const express = require('express');
const router = express.Router();

const { PrismaClient, Prisma } = require('@prisma/client');

const prisma = new PrismaClient();

/* GET home page. */
router.get('/all', async (req, res) => {
  const bills = await prisma.bill.findMany({})
  res.status(200).send({ bills })
});

router.post('/create', async (req, res) => {
  try {
    const {
      id
    } = req.body;

    console.log(req.body);

    const bill = await prisma.bill.upsert({
      where: {
        id
      },
      create: req.body,
    })

    res.status(200).send(bill);
  } catch (e) {
    console.log(e)
    res.status(500).send({});
  }
});

router.put('/edit', async (req, res) => {
  try {
    const {
      id,
    } = req.body;

    if(!id)
      return res.status(400).send('Id necessário!');

    const bill = await prisma.bill.update({
      data: req.body,
      where: {
        id
      }
    })

    res.status(200).send(bill);
  } catch (e) {
    console.log(e)
    res.status(500).send({});
  }
})

router.put('/resume', async (req, res) => {
  try {
    const {
      id
    } = req.body;

    if(!id)
      return res.status(400).send('Id necessário!');

    const bill = await prisma.bill.update({
      data: {
        paused: false,
      },
      where: {
        id
      }
    })

    res.status(200).send(bill);
  } catch (e) {
    console.log(e)
    res.status(500).send({});
  }
})

router.put('/pause', async (req, res) => {
  try {
    const {
      id
    } = req.body;

    if(!id)
      return res.status(400).send('Id necessário!');

    const bill = await prisma.bill.update({
      data: {
        paused: true,
      },
      where: {
        id
      }
    })

    res.status(200).send(bill);
  } catch (e) {
    console.log(e)
    res.status(500).send({});
  }
})

router.delete('/delete', async (req, res) => {
  try {
    const {
      id
    } = req.body;

    const deleted = await prisma.bill.delete({
      where: {
        id
      }
    })

    res.status(200).send('Apagado');
  } catch(e) {
    res.status(404).send('ID não encontrado');
  }
})


module.exports = (app) => app.use('/bill', router);
