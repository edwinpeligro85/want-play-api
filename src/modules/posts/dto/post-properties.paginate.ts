import { CollectionProperties, Expose } from '@forlagshuset/nestjs-mongoose-paginate';

export class PostProperties extends CollectionProperties {
  @Expose({ name: 'created_at', sortable: true })
  readonly createdAt: 'desc' | 'asc';

  @Expose({ filterable: true })
  readonly city: string;

  @Expose({ filterable: true })
  readonly owner: string;

  @Expose({ filterable: true })
  readonly type: string;
}
