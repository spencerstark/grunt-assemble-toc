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

  //---------------------------------------------------------
  // This is where we create the TOC. 
  //---------------------------------------------------------
  var items = '',
      subitems = '';

  $('.Markdown h1').each(function() {
    var text = $(this).text(),
        id = $(this).attr('id'),
        children = $(this).nextUntil('h1', 'h2');

    items += `<li><a href="#${id}">${text}</a>`;
    if (children.length > 0) {
      subitems = '<ul>';
      children.each(function() {
        var childText = $(this).text(),
          childId = $(this).attr('id');

        subitems += `<li><a href="#${childId}">${childText}</a>`;
      });
      subitems += '</ul>';
      items += subitems;
    }
    items += `</li>`;
  });
  
  toc('#toc-list').append(items);
  $(id).append(toc.html());
  
  $('.Markdown').addClass('has-menu');
  $('#toc').addClass('Page-menu');

  params.content = $.html();
  callback();
};

module.exports.options = options;
