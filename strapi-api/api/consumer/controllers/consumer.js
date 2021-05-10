'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
module.exports = {
    async upload(ctx) {
        let entity;
        if (ctx.is('multipart')) {
            const { data, files } = parseMultipartData(ctx);
            entity = await strapi.services.consumer.create(data, { files });
        } else {
            let record = {};
            record["User_id"] = "CityToShore";
            record["collection_name"] = ctx.request.body[0];
            record["data"] = ctx.request.body[1];
            //entity = await strapi.services.consumer.create(record);
            entity = strapi.consumer.insert(record);
        }
        return sanitizeEntity(entity, { model: strapi.models.consumer });
        // For user_id should we should do something with the jwt token?
        
    },

};
