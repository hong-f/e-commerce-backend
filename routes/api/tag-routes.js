const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// find all tags
  // be sure to include its associated Product data
router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      order: ['tag_name'],
      include: [{ model: Product }],
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
  
});

// find a single tag by its `id`
  // be sure to include its associated Product data
  router.get('/:id', async (req, res) => {
    try {
      const tagData = await Tag.findByPk(req.params.id, {
        include: [{ model: Product }],
      });
      if (!tagData) {
        res.status(404).json({ message: 'Tag id not found' });
      }
      res.status(200).json(tagData);
    } catch (err) {
      res.status(500).json(err)
    }
  
});

 // create a new tag
 router.post('/', async (req, res) => {
  try {
    const tagData = await Tag.create(req.body)
    res.status(200).json({ message: `Tag created ${tagData}` });
  } catch (err) {
    res.status(500).json(err)

  }
 
});

 // update a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id);
    if (!tagData) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    await tagData.update(req.body);
    res.status(200).json({ message: 'Tag id Updated' });

  } catch (err) {
    res.status(500).json(err)
  }
 
});
// delete on tag by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id);
    if (!tagData) {
      return res.status(400).json({ message: 'Tag not found' });
    }
    await tagData.destroy();
    res.status(200).json({ message: 'Tag deleted' })
  } catch (err) {
    request.status(400).json(err);
  }
  
});

module.exports = router;
