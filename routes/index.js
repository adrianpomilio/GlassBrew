
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Glass Brew on Google Glass' });
};