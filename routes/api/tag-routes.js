const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');
const Clog = require('../../lib/clog');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  const clog = new Clog(`GET /api/tags/`);
  try{
    const tagsData = await Tag.findAll({include: Product});
    if(!tagsData){
      clog.httpStatus(404, `No tag data`);
      res.status(404).json({status:404, message:`There are no tags in the database`})
    }else{
      clog.httpStatus(200);
      res.status(200).json(tagsData);
    }
  }catch(err){
    console.error(err);
    clog.httpStatus(500, err.message);
    res.status(500).json({status:500, message:`An internal server error occured`});
  }

});

router.get('/:id', async (req, res) => {
  const clog = new Clog(`GET /api/tags/${req.params['id']}`);
  try {
    const tagData = await Tag.findByPk(req.params['id'],{include: Product});
    if(!tagData){
      clog.httpStatus(404, `Tag not found for id ${req.params['id']}`);
      res.status(404).json({status:404, message:`Tag not found for id ${req.params['id']}`});
    }else{
      clog.httpStatus(200);
      res.status(200).json(tagData);
    }
  } catch (err) {
    console.error(err);
    clog.httpStatus(500, err.message);
    res.status(500).json({status:500, message:`An internal server error occured`});
  }
});

router.post('/', async (req, res) => {
  const clog = new Clog('POST /api/tags/');
  try {
    if(!req.body[`tag_name`]){
      clog.httpStatus(400, 'No tag_name in req');
      res.status(400).json({status:400, message: 'New tags must be preceded with a tag_name'});
    }else{
      const createStatus = await Tag.create({
        tag_name: req.body['tag_name']
      })
      clog.httpStatus(201);
      res.status(201).json(createStatus);
    }
  } catch (err) {
    console.error(err);
    clog.httpStatus(500, `${err.message}`);
    res.status(500).json({status:500, message: `An internal server error occured`});
  }
});

router.put('/:id', async (req, res) => {
  const clog = new Clog(`/api/tags/${req.params['id']}`);
  try{
    const findRes = await Tag.findByPk(req.params['id']);
    if(!findRes){
      clog.httpStatus(404, `Tag not found for ID ${req.params['id']}`);
      res.status(404).json({status:404, message: `Tag not found for ID ${req.params['id']}`});
    }else{
      if(!req.body['tag_name']){
        clog.httpStatus(400, `tag_name not specified`)
        res.status(400).json({status: 400, message: `tag_name not specified`})
      }
      else{
        const updateRes = Tag.update(
          {tag_name: req.body[`tag_name`]},
          {where: {id: req.params['id']}}
        )
        clog.httpStatus(202);
        res.status(202).json(updateRes);
      }
    }
  }catch(err){
    console.error(err);
    clog.httpStatus(500, `${err.message}`);
    res.status(500).json({status:500, message: `An internal server error occured`});
  }
});

router.delete('/:id', async (req, res) => {
  const clog = new Clog(`DELETE /api/tags/${req.params['id']}`);
  try{
    const findRes = await Tag.findByPk(req.params['id']);
    if(!findRes){
      clog.httpStatus(404, `Tag not found for ID ${req.params['id']}`);
      res.status(404).json({status:404, message: `Tag not found for ID ${req.params['id']}`});
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
    console.error(error);
    clog.httpStatus(500, `${error.message}`);
    res.status(500).json({status:500, message: `An internal server error occured`});
  }
});

module.exports = router;
