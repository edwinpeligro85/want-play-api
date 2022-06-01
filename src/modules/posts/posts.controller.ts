import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiTags } from '@nestjs/swagger';
import { Post as PostModel, Post as PostSchema, PostRequest } from './schemas';
import { ApiCollectionresponse, Auth, AuthUser } from '@common/decorators';
import { IUser } from '@interfaces';
import {
  CollectionDto,
  ValidationPipe,
} from '@forlagshuset/nestjs-mongoose-paginate';
import { PostProperties } from './dto/post-properties.paginate';
import { IsMongoIdPipe } from '@common/pipes';

@Auth()
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

  @ApiCollectionresponse(PostModel)
  @Get()
  findAll(
    @Query(new ValidationPipe(PostProperties))
    collectionDto: CollectionDto,
  ) {
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

  @Put(':id/requests/:target')
  sendRequest(
    @Param('id', IsMongoIdPipe) id: string,
    @Param('target', IsMongoIdPipe) owner: string,
  ): Promise<PostRequest> {
    return this.postsService.sendRequest(id, owner);
  }
}
