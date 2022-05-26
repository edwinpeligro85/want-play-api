import { CollectionProperties, ExposeQuery } from '@sigmaott/paginate';

export class PostProperties extends CollectionProperties {
  @ExposeQuery({ name: 'created_at', sortable: true })
  readonly createdAt: 'desc' | 'asc';

  @ExposeQuery({ filterable: true, populate: true })
  readonly city: string;

  @ExposeQuery({ filterable: true, populate: true })
  readonly owner: string;

  @ExposeQuery({ filterable: true })
  readonly type: string;
}
