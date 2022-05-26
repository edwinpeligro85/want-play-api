import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiTags } from '@nestjs/swagger';
import { Post as PostModel, Post as PostSchema } from './schemas';
import { Auth, AuthUser } from '@common/decorators';
import { IUser } from '@interfaces';
import {
  CollectionResponse,
  CollectionValidationPipe,
} from '@sigmaott/paginate';
import { PostProperties } from './dto/post-properties.paginate';
import { IsMongoIdPipe } from '@common/pipes';

// @Auth()
@ApiTags('Post')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @AuthUser() { profile }: IUser,
  ): Promise<PostSchema> {
    return this.postsService.create(
      typeof profile === 'string' ? profile : profile._id,
      createPostDto,
    );
  }

  @Get()
  findAll(
    @Query(new CollectionValidationPipe(PostProperties))
    collectionDto: any,
  ): Promise<CollectionResponse<PostModel>> {
    return this.postsService.findAll(collectionDto);
  }

  @Get(':id')
  findOne(@Param('id', IsMongoIdPipe) id: string): Promise<PostModel> {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', IsMongoIdPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostModel> {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id', IsMongoIdPipe) id: string) {
    return this.postsService.remove(id);
  }
}
