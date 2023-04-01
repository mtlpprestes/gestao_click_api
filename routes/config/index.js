const express = require('express');
const router = express.Router();

const { PrismaClient, Prisma } = require('@prisma/client');

const prisma = new PrismaClient();
const { dailyRevision } = require('../../message');

router.post('/revision', async (req, res) => {
	try {
		await dailyRevision();
		res.status(200).send({});
	} catch(e) {
		console.log(e)
		res.status(500).send({});
	}
});

router.put('/change', async (req, res) => {
	try {
		const {
			title,
			content
		} = req.body;

		await prisma.template.upsert({
			where: {
				name: 'default'
			},
			update: {
				name: 'default',
				title,
				content
			},
			create: {
				name: 'default',
				title,
				content
			}
		});
		res.status(200).send({});
	} catch(e) {
		console.log(e)
		res.status(500).send({});
	}
});

module.exports = (app) => app.use('/config', router);
