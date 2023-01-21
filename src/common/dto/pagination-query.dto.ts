import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  limit: number;

  // @Type(() => Number) 当全局配置了enableImplicitConversion: true
  // 则不需要这个注解
  @IsOptional()
  // 必须是个正数
  @IsPositive()
  offset: number;
}
