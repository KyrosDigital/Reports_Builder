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
      entity = await strapi.services["client-data"].create(data, { files });
    } else {
      ctx.request.body.userId = ctx.state.user.id;
      entity = await strapi.services["client-data"].create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models["client-data"] });
  },
};
