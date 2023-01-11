import { PartialType } from '@nestjs/mapped-types';
import { CreateCoffeeDto } from './create-coffee.dto';

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {
  // 由于更新不一定是更新所有字段，所以使用optional修饰
  // readonly name?: string;
  // readonly brand?: string;
  // readonly flavors?: string[];
  // npm i @nestjs/mapped-types 使用这个依赖可以减少冗余代码
  // PartialType 不仅可以继承type里的所有字段，
  // 而且所有字段都是可选的（动态添加单个规则 @IsOptional() ），同样继承验证规则
}
