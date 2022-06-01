import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import {
  Chat,
  ChatDocument,
  Message,
  MessageDocument,
  UserChat,
  UserChatDocument,
} from './schemas';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(UserChat.name) private userChatModel: Model<UserChatDocument>,
  ) {}

  async createChat(dto: CreateChatDto): Promise<Chat> {
    const chat = await new this.chatModel(dto).save();

    chat.members.forEach(async (member) => {
      let userChat = await this.userChatModel
        .findOne({ owner: member._id })
        .exec();

      if (userChat) {
        userChat.chats.push(chat);
        userChat.save();
      } else {
        new this.userChatModel({ owner: member._id, chats: [chat._id] }).save();
      }
    });

    return chat;
  }

  async createMessage(to: string, dto: CreateMessageDto): Promise<Message> {
    if (!(await this.chatModel.exists({ _id: to }).exec())) {
      throw new BadRequestException(`Not found chat ${to}`);
    }

    return new this.messageModel({ ...dto, to }).save();
  }

  async getChatByUserId(owner: string): Promise<Chat[]> {
    return (
      (
        await this.userChatModel
          .findOne({ owner })
          .populate({
            path: 'chats',
            model: 'Chat',
            populate: {
              path: 'members',
              model: 'Profile',
              select: 'nickname',
            },
          })
          .exec()
      )?.chats ?? []
    );
  }

  async getMessagesByChatId(to: string): Promise<Message[]> {
    if (!(await this.chatModel.exists({ _id: to }).exec())) {
      throw new BadRequestException(`Not found chat ${to}`);
    }

    return this.messageModel.find({ to }).exec();
  }
}
