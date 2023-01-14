import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

// exports 当别的module引入CoffeesModule时，可以直接使用CoffeeService
// 这里列出的所有providers只有在此module中可用，除非exports ⬆️
@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor])],
  controllers: [CoffeesController],
  providers: [CoffeesService],
  exports: [CoffeesService],
})
export class CoffeesModule {}
