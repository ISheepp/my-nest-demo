import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
  ) {}
  private readonly logger = new Logger(CoffeesService.name);

  /**
   * 返回所有的咖啡
   * @returns Coffee
   */
  findAll(paginationQuery: PaginationQueryDto): Promise<Coffee[]> {
    const { limit, offset } = paginationQuery;
    return this.coffeeRepository.find({
      relations: ['flavors'],
      skip: offset,
      take: limit,
    });
  }

  /**
   * 根据id查找coffee
   * @param id id
   * @returns Coffee
   */
  async findOne(id: string): Promise<Coffee> {
    const coffee = await this.coffeeRepository.findOne({
      where: {
        id: +id,
      },
      relations: ['flavors'],
    });
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
  async create(createCoffeeDto: CreateCoffeeDto) {
    // const newCoffee = this.coffeeRepository.create(createCoffeeDto);
    // 1. 使用map遍历dto中所有的flavor
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    );
    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors,
    });
    return this.coffeeRepository.save(coffee);
  }

  /**
   * 根据id 更新咖啡的信息
   * @param id id
   * @param updateCoffeeDto dto
   * @returns Coffee
   */
  async update(id: string, updateCoffeeDto: UpdateCoffeeDto): Promise<Coffee> {
    const flavors =
      updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
      ));
    // preload() 方法如果查不到则返回undefined
    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
      flavors,
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee # ${id}, not found`);
    }
    return this.coffeeRepository.save(coffee);
  }

  async remove(id: string): Promise<void> {
    await this.coffeeRepository.delete(id);
  }

  /**
   * 根据名字返回风味实体，没有则生成一个实体（没有save到db）
   * @param name 风味名称
   * @returns Flavor
   */
  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({
      where: {
        name: name,
      },
    });
    if (existingFlavor) {
      this.logger.log(`当前风味：${name} 已存在`);
      return existingFlavor;
    }
    return this.flavorRepository.create({ name });
  }
}
