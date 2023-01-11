import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';

// exports 当别的module引入CoffeesModule时，可以直接使用CoffeeService
// 这里列出的所有providers只有在此module中可用，除非exports ⬆️
@Module({
  controllers: [CoffeesController],
  providers: [CoffeesService],
  exports: [CoffeesService],
})
export class CoffeesModule {}
