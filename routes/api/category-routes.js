const router = require('express').Router();
const { Category, Product } = require('../../models');
const Clog = require('../../lib/clog');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // initialzie clog for route
  const clog = new Clog(`GET /api/categories/`);
  // wrap to catch internal server errors
  try {
    const categoriesData = await Category.findAll({include: Product});
    if(!categoriesData){
      clog.httpStatus(410, 'No Category Data');
      res.json({status: 410, message:'There are no categories in the database.'}).status(410);
    }else{
      clog.httpStatus(200);
      res.json(categoriesData).status(200)
    }
  } catch (err) {
    // if there was an error, log it and res 500
    console.error(err);
    clog.httpStatus(500, err.message);
    res.status(500).json({status:500, message:`An internal server error occured`});
  }
});

router.get('/:id', async (req, res) => {
  // initialzie clog for route
  const clog = new Clog(`GET /api/categories/${req.params['id']}`);
  // wrap to catch internal server errors
  try{
    // check if this id is in the db and get that id
    const categoryData = await Category.findByPk(req.params['id'], {include: Product});
    if(!categoryData){
      clog.httpStatus(404, `Category not found for ID ${req.params['id']}`);
      res.status(404);
    }else{
      clog.httpStatus(200);
      res.json(categoryData).status(200);
    }
  }catch(err){
    // if there was an error, log it and res 500
    console.error(err);
    clog.httpStatus(500, `${e.message}`);
    res.status(500).json({status:500, message:`An internal server error occured`});
  }
});

router.post('/', async (req, res) => {
  // initialzie clog for route
  const clog = new Clog('POST /api/categories/');
  // wrap to catch internal server errors
  try {
    if(!req.body[`category_name`]){
      clog.httpStatus(400, 'No category_name in req');
      res.status(400).json({status:400, message: 'New categories must be preceded with a category_name'});
    }else{
      const createStatus = await Category.create({
        category_name: req.body['category_name']
      })
      clog.httpStatus(201);
      res.status(201).json(createStatus);
    }
  } catch (err) {
    // if there was an error, log it and res 500
    console.error(err);
    clog.httpStatus(500, `${err.message}`);
    res.status(500).json({status:500, message: `An internal server error occured`});
  }
});

router.put('/:id', async (req, res) => {
  // initialzie clog for route
  const clog = new Clog(`PUT /api/products/${req.params['id']}`);
  // wrap to catch internal server errors
  try{
    // check if this id is in the db
    const findRes = await Category.findByPk(req.params['id']);
    // if id doesn't exist, res 404 and ret error
    if(!findRes){
      clog.httpStatus(404, `Category not found for ID ${req.params['id']}`);
      res.status(404).json({status:404, message: `Category not found for ID ${req.params['id']}`});
    // otherwise
    }else{
      // if category name is not passed, res 400 and ret error
      if(!req.body['category_name']){
        clog.httpStatus(400, `category_name not specified`)
        res.status(400).json({status: 400, message: `category_name not specified`})
      // otherwise update category and res 200 and ret updated category
      }else{
        const updateRes = Category.update(
          {category_name: req.body[`category_name`]},
          {where: {id: req.params['id']}}
        )
        clog.httpStatus(202);
        res.status(202).json(updateRes);
      }
    }
  }catch(error){
    // if there was an error, log it and res 500
    clog.httpStatus(500, error.message);
    res.status(500).json({status: 500, message:'An internal server error occured'});
  }
});

router.delete('/:id', async (req, res) => {
  // initialzie clog for route
  const clog = new Clog(`DELETE /api/products/${req.params['id']}`);
  // wrap to catch internal server errors
  try{
    // check if this id is in the db
    const findRes = await Category.findByPk(req.params['id']);
    // if id is not found res 404 and ret error
    if(!findRes){
      clog.httpStatus(404, `Category not found for ID ${req.params['id']}`);
      res.status(404).json({status:404, message: `Category not found for ID ${req.params['id']}`});
    // otherwise delete specified category, res 202 and ret number deleted (should always be 1)
    }else{
      const deleteRes = await Category.destroy({
        where: {
          id: req.params['id']
        }
      })
      clog.httpStatus(202, deleteRes);
      res.status(202).json(deleteRes);
    }
  }catch(error){
    // if there was an error, log it and res 500
    console.error(error);
    clog.httpStatus(500, `${error.message}`);
    res.status(500).json({status:500, message: `An internal server error occured`});
  }
});

module.exports = router;
