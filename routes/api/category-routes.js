const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const categoriesData = await Category.findAll({include: Product});
    if(!categoriesData){
      console.warn(`404: GET '/ap/categories/': No Category Data`);
      res.json({status: 404, message: 'not found', error:'There are no categories in the database.'}).status(404);
    }else{
      console.info(`200: GET '/api/categories/`);
      res.json(categoriesData).status(200)
    }
  } catch (err) {
    console.error(`500: GET '/api/categories/': ${e.message}`);
    console.error(err);
    res.status(500);
  }
});

router.get('/:id', async (req, res) => {
  try{
    const categoryData = await Category.findByPk(req.params['id'], {include: Product});
    if(!categoryData){
      console.warn(`404: GET '/api/categories/${req.params['id']}': Category not found for that ID`);
    }else{
      console.info(`200: GET '/api/categories/${req.params['id']}`)
      res.json(categoryData).status(200);
    }
  }catch(err){
    console.error(`500: GET 'api/categories/:id' (id:${req.params['id']}): ${e.message}`);
    console.error(err);
    res.status(500);
  }
});

router.post('/', (req, res) => {
  // create a new category
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
