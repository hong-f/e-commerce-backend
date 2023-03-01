const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');
// modified to use async/await vs. .then 
// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findAll({
      order: ['product_name'],
      include: [{ model: Category },
      { model: Tag }]
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category },
      { model: Tag }]
    });
    if (!productData) {
      res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err)
  }
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
 try {
  const product = await Product.create(req.body);
  if (req.body.tagIds.length) {
    const productTagIdArr = req.body.tagIds.map((tag_id) => {
      return {
        product_id: product.id,
        tag_id,
 };
});

const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
return res.status(200).json(productTagIds);
}

// if no product tags, just respond
return res.status(200).json(product);
} catch (err) {
console.log(err);
return res.status(400).json(err);
}
});

  // Product.create(req.body)
  //   .then((product) => {

router.put('/', async (req, res) => {
try {
const product = await Product.create(req.body);
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        // return ProductTag.bulkCreate(productTagIdArr);
        const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
        return res.status(200).json(productTagIds);
      }
      // if no product tags, just respond
    return res.status(200).json(product);
    // .then((productTagIds) => res.status(200).json(productTagIds))
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});


// update product
router.put('/:id', async (req, res) => {
try {
  // update product data
  await Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  });
      // find all associated tags from ProductTag
    const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });
      // get list of current tag_ids
    const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
    const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      
        // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
  
   res.json({ message: 'product has been updated' });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const productData = await Product.findByPk(req.params.id);
    if (!productData) {
      return res.status(400).json({ message: 'product was not found' });
    }
    await productData.destroy();
    res.status(200).json({ message: 'product has been deleted' })
  } catch (err) {
    request.status(400).json(err);
  }
});

module.exports = router;
