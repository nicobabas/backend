import { MinLength } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@InputType()
export class CountryInput {
  @Field()
  @MinLength(1)
  name: string;
  emoji: string;
}

@Entity()
@ObjectType()
class Country {
  @PrimaryGeneratedColumn()
  @Field()
  code: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  emoji: string;
}

export default Country;
