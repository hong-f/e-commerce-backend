const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const allCategories = await Category.findAll({
      order: ['category_name'],
      include: [{ model: Product }],
    });
    res.status(200).json(allCategories);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!categoryData) {
      res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err)
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try{
    const categoryData = await Category.create(req.body)
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err)
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try{
  const categoryData = await Category.findByPk(req.params.id);
  if (!categoryData) {
    return res.status(404).json({ message: 'Category not found' });
  }
  await categoryData.update(req.body);
  res.status(200).json(categoryData);
  // update a category by its `id` value
} catch (err) {
  res.status(500).json(err)
}
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryData = await Category.findByPk(req.params.id);
    if (!categoryData){
      return res.status(400).json({ message: 'Category not found'});
    }
    await categoryData.destroy();
    res.status(200).json({message: 'Category deleted'})
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
