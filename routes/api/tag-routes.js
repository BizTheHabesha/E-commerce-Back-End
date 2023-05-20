const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try{
    const tagsData = await Tag.findAll({include: Product});
    if(!tagsData){
      console.warn(`404: GET /api/tags/: No tag data`);
      res.status(404).json({status:404, message:`There are no tags in the database`})
    }else{
      console.info(`200: GET /api/tags/`)
      res.status(200).json(tagsData);
    }
  }catch(err){
    console.error(`500: GET /api/products/: ${err.message}`);
    console.error(err);
    res.status(500).json({status:500, message:`An internal server error occured`});
  }

});

router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params['id'],{include: Product});
    if(!tagData){
      console.warn(`404: GET /api/tags/${req.params['id']}: Tag not found for id ${req.params['id']} `);
      res.status(404).json({status:404, message:`Tag not found for id ${req.params['id']}`});
    }else{
      console.info(`200: GET /api/tags/`);
      res.status(200).json(tagData);
    }
  } catch (err) {
    console.error(`500: /api/tags/${req.params['id']}: ${err.message}`);
    console.error(err);
    res.status(500).json({status:500, message:`An internal server error occured`});
  }
});

router.post('/', (req, res) => {
  // create a new tag
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
