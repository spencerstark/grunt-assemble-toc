/*!
 * Modified variant of grunt assemble toc to better fit our project. 
 * Author: Spencer Stark
 * 
 */

var options = {
  stage: 'render:post:page'
};

var cheerio = require('cheerio');

/**
 * Anchor Plugin
 * @param  {Object}   params
 * @param  {Function} callback
 */
module.exports = function(params, callback) {
  'use strict';

  var opts = params.assemble.options;
  opts.toc = opts.toc || {};

  // id to use to append TOC
  var id = '#' + (opts.toc.id || 'toc');
  var modifier = opts.toc.modifier || '';
  var li = opts.toc.li ? (' class="' + opts.toc.li + '"') : '';

  // load current page content
  var $ = cheerio.load(params.content);
  var toc = cheerio.load('<ul id="toc-list" class="' + modifier + '"></ul>');

  // get all the anchor tags from inside the headers
  var anchors = $('h1 a[name],h2 a[name],h3 a[name],h4 a[name]');

  //---------------------------------------------------------
  // This is where we create the TOC. 
  //---------------------------------------------------------
  var pageMenu = '<div class="Page-menu"><ul></ul></div>',
      items = '',
      subitems = '';
  anchors.each(function(i, e) {
    var text = $(e.parent).text().trim(),
        link = e.attribs.name,
        depth = parseInt(e.parent.name.replace(/h/gi, ''), 10);
    if (depth == 1){
      children = [];
      var children = $(this).parent().nextUntil('h1', 'h2');

      items += `<li><a href="#${link}">${text}</a>`;
      if (children.length > 0) {
        subitems = '<ul>';
        children.each(function() {
          var childText = $(this).text(),
            childId = $(this).attr('id');

          subitems += `<li><a href="#${childId}">${childText}</a></li>`;
        });
        subitems += '</ul>';
        items += subitems;
      }
      items += `</li>`;
    }
  });
  toc('#toc-list').append(items);
  $(id).append(toc.html());

  params.content = $.html();
  callback();
};

module.exports.options = options;
