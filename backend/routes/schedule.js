/**
 * This function comment is parsed by doctrine
 * @route GET /
 * @group foo - Operations about user
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
var express = require('express');
var router = express.Router();
var models = require('../models')

router.get('/', async function (req, res, next) {
  try {
    const schedule = await models.Schedule.findAll();
    return res.status(200).json({
      schedule,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
});
router.get('/:id', async function (req, res, next) {
  try {
    const id = req.params.id
    const schedule = await models.Schedule.findOne({ where: { id } });
    return res.status(200).json({
      schedule,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
});
router.post('/', async function (req, res, next) {
  try {
    const body = req.body
    const schedule = await models.Schedule.create(body);
    return res.status(200).json({
      schedule,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
});
router.put('/:id', async function (req, res, next) {
  try {
    const body = req.body
    const id = req.body.id
    const schedule = await models.Schedule.update(body, { where: { id: id } });
    return res.status(200).json({
      schedule,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
});
router.delete('/:id', async function (req, res, next) {
  try {
    const id = req.params.id
    const schedule = await models.Schedule.destroy({ where: { id } });
    return res.status(200).json({
      schedule,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
});

module.exports = router;
