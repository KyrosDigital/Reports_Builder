'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
	/**
   * Create a record. Auto apply a userId to a Type
   *
   * @return {Object}
   */

	 async create(ctx) {
    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      data.userId = ctx.state.user.id;
      entity = await strapi.services["collection-names"].create(data, { files });
    } else {
      ctx.request.body.userId = ctx.state.user.id;
      entity = await strapi.services["collection-names"].create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models["collection-names"] });
  },

  async upload(ctx) {
    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      data.userId = ctx.state.user.id;
      entity = await strapi.services["collection-names"].create(data, { files });
    } else {
      let record = {};
      ctx.request.body.userId = ctx.state.user.id;
      console.log(ctx.state.user);
      record["collectionName"] = ctx.request.body["collectionName"];
      record["data"] = ctx.request.body["data"];
      entity = await strapi.services["collection-names"].create(record);
    }
    return sanitizeEntity(entity, { model: strapi.models.consumer });
    
  },
};

