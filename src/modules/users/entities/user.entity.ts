import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity('users')
export class User {
  @ObjectIdColumn()
  userId: ObjectID;

  @Column()
  username: string;

  @Column()
  password: string;
}
