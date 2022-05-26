import {
  CollectionDto,
  CollectionResponse,
  DocumentCollector,
} from '@sigmaott/paginate';
import { LocationService } from '@modules/location';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './schemas';

@Injectable()
export class PostsService {
  private modelCollection: DocumentCollector<PostDocument>;

  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private _location: LocationService,
  ) {}

  onModuleInit() {
    this.modelCollection = new DocumentCollector<PostDocument>(this.postModel);
  }

  async create(owner: string, dto: CreatePostDto): Promise<Post> {
    if (!(await this._location.cityExists(dto.city))) {
      throw new BadRequestException(`Not exist city ${dto.city}`);
    }

    return new this.postModel({ ...dto, owner }).save();
  }

  async findAll(
    collectionDto: CollectionDto,
  ): Promise<CollectionResponse<Post>> {
    return this.modelCollection.find(collectionDto);
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postModel
      .findById(id)
      .populate(['city'])
      .exec();

    if (!post) {
      throw new NotFoundException(`Not found post ${id}`);
    }

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    delete updatePostDto.city;
    await this.postModel.findByIdAndUpdate(id, updatePostDto).exec();

    return this.findOne(id);
  }

  async remove(id: string) {
    return this.postModel.findByIdAndRemove(id);
  }
}
