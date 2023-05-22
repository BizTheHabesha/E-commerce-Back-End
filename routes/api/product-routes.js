const router = require('express').Router();
const Clog = require('../../lib/clog');
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  const clog = new Clog('GET /api/products/');
  try {
    const productsData = await Product.findAll({include: [Category, Tag]});
    if(!productsData){
      clog.httpStatus(404, `There are no products in the database`);
      res.status(404).json({status:404, message:`There are no products in the database`})
    }else{
      clog.httpStatus(200);
      res.json(productsData).status(200);
    }
  } catch (err) {
    console.error(err);
    clog.httpStatus(500, `${err.message}`);
    res.status(500).json({status:500, message:`An internal server error occured`});
  }
});

// get one product
router.get('/:id', async (req, res) => {
  const clog = new Clog(`GET /api/products/${req.params['id']}`);
  try {
    const productData = await Product.findByPk(req.params['id'], {include: [Category, Tag]});
    if(!productData){
      clog.httpStatus(404, `Product not found for ID ${req.params['id']}`);
      res.status(404).json({status:404, message:`Product not found for ID ${req.params['id']}`});
    }else{
      clog.httpStatus(200);
      res.json(productData).status(200);
    }
  } catch (err) {
    console.error(err);
    clog.httpStatus(500, `${err.message}`);
    res.status(500).json({status:500, message:`An internal server error occured`});
  }
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  const clog = new Clog(`POST /api/products/`);
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => {
      clog.httpStatus(200);
      return res.status(200).json(productTagIds)
    })
    .catch((err) => {
      console.log(err);
      clog.httpStatus(400, `${err.message}`);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  const clog = new Clog(`PUT /api/products/${req.params['id']}`);
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
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
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => {
      clog.httpStatus(202);
      return res.status(202).json(updatedProductTags)
    })
    .catch((err) => {
      console.error(err);
      clog.httpStatus(500, err.message);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  const clog = new Clog(`DELETE /api/products/${req.params['id']}`);
  try{
    const findRes = await Product.findByPk(req.params['id']);
    if(!findRes){
      clog.httpStatus(404, `Product not found for ID ${req.params['id']}`);
      res.status(404).json({status:404, message: `Product not found for ID ${req.params['id']}`});
    }else{
      const deleteRes = await Product.destroy({
        where: {
          id: req.params['id']
        }
      })
      clog.httpStatus(202, deleteRes);
      res.status(202).json(deleteRes);
    }
  }catch(error){
    console.error(error);
    clog.httpStatus(500, `${err.message}`);
    res.status(500).json({status:500, message: `An internal server error occured`});
  }
});

module.exports = router;
