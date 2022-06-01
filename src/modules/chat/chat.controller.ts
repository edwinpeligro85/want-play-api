import { Auth, AuthUser } from '@common/decorators';
import { IsMongoIdPipe } from '@common/pipes';
import { IUser } from '@interfaces';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { Chat, Message } from './schemas';

@Auth()
@ApiTags('Chat')
@Controller('chats')
export class ChatController {
  constructor(private readonly _chat: ChatService) {}

  @Post()
  createChat(@Body() createChatDto: CreateChatDto): Promise<Chat> {
    return this._chat.createChat(createChatDto);
  }

  @Post(':id/messages')
  createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Param('id', IsMongoIdPipe) id: string,
  ): Promise<Message> {
    return this._chat.createMessage(id, createMessageDto);
  }

  @Get(':id/messages')
  getMessages(@Param('id', IsMongoIdPipe) id: string): Promise<Message[]> {
    return this._chat.getMessagesByChatId(id);
  }
}
