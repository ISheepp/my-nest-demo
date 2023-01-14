import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
  ) {}
  private readonly logger = new Logger(CoffeesService.name);

  /**
   * 返回所有的咖啡
   * @returns Coffee
   */
  findAll(): Promise<Coffee[]> {
    return this.coffeeRepository.find();
  }

  /**
   * 根据id查找coffee
   * @param id id
   * @returns Coffee
   */
  async findOne(id: string): Promise<Coffee> {
    const coffee = await this.coffeeRepository.findOneBy({ id: +id });
    if (!coffee) {
      throw new NotFoundException(`Coffee # ${id}, not found`);
    }
    return coffee;
  }

  /**
   * 新增一个咖啡
   * @param createCoffeeDto CreateCoffeeDto
   * @returns Coffee
   */
  create(createCoffeeDto: CreateCoffeeDto) {
    // const newCoffee = this.coffeeRepository.create(createCoffeeDto);
    return this.coffeeRepository.save(createCoffeeDto);
  }

  /**
   * 根据id 更新咖啡的信息
   * @param id id
   * @param updateCoffeeDto dto
   * @returns Coffee
   */
  async update(id: string, updateCoffeeDto: UpdateCoffeeDto): Promise<Coffee> {
    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee # ${id}, not found`);
    }
    return this.coffeeRepository.save(coffee);
  }

  async remove(id: string): Promise<void> {
    await this.coffeeRepository.delete(id);
  }
}
