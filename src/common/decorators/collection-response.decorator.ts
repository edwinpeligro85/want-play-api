import { CollectionResponseDto } from '@common/dto';
import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiCollectionresponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        title: `CollectionResponseOf${model.name}`,
        description: 'Get all records.',
        allOf: [
        //   { $ref: getSchemaPath(CollectionResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              pagination: {
                type: 'object',
                properties: {
                  total: {
                    type: 'number',
                  },
                  page: {
                    type: 'number',
                  },
                  limit: {
                    type: 'number',
                  },
                  next: {
                    type: 'number',
                    nullable: true,
                  },
                  prev: {
                    type: 'number',
                    nullable: true,
                  },
                },
              },
            },
          },
        ],
      },
    }),
  );
};
