const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');
const Clog = require('../../lib/clog');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // initialzie clog for route
  const clog = new Clog(`GET /api/tags/`);
  // wrap to catch internal server errors
  try{
    // get all tags
    const tagsData = await Tag.findAll({include: Product});
    // if there are no tags, res 404
    if(!tagsData){
      clog.httpStatus(404, `No tag data`);
      res.status(404).json({status:404, message:`There are no tags in the database`})
    }else{
      // otherwise, res 200 and ret all tag data
      clog.httpStatus(200);
      res.status(200).json(tagsData);
    }
  }catch(err){
    // if there was an error, log it and res 500
    console.error(err);
    clog.httpStatus(500, err.message);
    res.status(500).json({status:500, message:`An internal server error occured`});
  }

});

router.get('/:id', async (req, res) => {
  // initialzie clog for route
  const clog = new Clog(`GET /api/tags/${req.params['id']}`);
  // wrap to catch internal server errors
  try {
    // check if this id is in the db and get that id
    const tagData = await Tag.findByPk(req.params['id'],{include: Product});
    // if this tag doesn't exist, res 404
    if(!tagData){
      clog.httpStatus(404, `Tag not found for id ${req.params['id']}`);
      res.status(404).json({status:404, message:`Tag not found for id ${req.params['id']}`});
    // otherwise res 200 and ret tag data
    }else{
      clog.httpStatus(200);
      res.status(200).json(tagData);
    }
  } catch (err) {
    // if there was an error, log it and res 500
    console.error(err);
    clog.httpStatus(500, err.message);
    res.status(500).json({status:500, message:`An internal server error occured`});
  }
});

router.post('/', async (req, res) => {
  // initialzie clog for route
  const clog = new Clog('POST /api/tags/');
  // wrap to catch internal server errors
  try {
    // if tag name was not sent, res 400 and ret error
    if(!req.body[`tag_name`]){
      clog.httpStatus(400, 'No tag_name in req');
      res.status(400).json({status:400, message: 'New tags must be preceded with a tag_name'});
    // otherwise create the new tag, and res & log 201
    }else{
      const createStatus = await Tag.create({
        tag_name: req.body['tag_name']
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
  const clog = new Clog(`/api/tags/${req.params['id']}`);
  // wrap to catch internal server errors
  try{
    // check if this id is in the db
    const findRes = await Tag.findByPk(req.params['id']);
    // if this id is not found, res 404 and ret error
    if(!findRes){
      clog.httpStatus(404, `Tag not found for ID ${req.params['id']}`);
      res.status(404).json({status:404, message: `Tag not found for ID ${req.params['id']}`});
    // otherwise
    }else{
      // if tag name is not passed, res 400 and ret error
      if(!req.body['tag_name']){
        clog.httpStatus(400, `tag_name not specified`)
        res.status(400).json({status: 400, message: `tag_name not specified`})
      // otherwise update the specified tag and res 202 and ret new tag
      }else{
        const updateRes = Tag.update(
          {tag_name: req.body[`tag_name`]},
          {where: {id: req.params['id']}}
        )
        clog.httpStatus(202);
        res.status(202).json(updateRes);
      }
    }
  }catch(err){
    // if there was an error, log it and res 500
    console.error(err);
    clog.httpStatus(500, `${err.message}`);
    res.status(500).json({status:500, message: `An internal server error occured`});
  }
});

router.delete('/:id', async (req, res) => {
  // initialzie clog for route
  const clog = new Clog(`DELETE /api/tags/${req.params['id']}`);
  // wrap to catch internal server errors
  try{
    // check if this id is in the db
    const findRes = await Tag.findByPk(req.params['id']);
    // if id is not found
    if(!findRes){
      clog.httpStatus(404, `Tag not found for ID ${req.params['id']}`);
      res.status(404).json({status:404, message: `Tag not found for ID ${req.params['id']}`});
    // otherwise destory specified tag and res 202 and ret number deleted (should always be 1)
    }else{
      const deleteRes = await Tag.destroy({
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
