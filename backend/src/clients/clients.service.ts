import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const existingClient = await this.clientRepository.findOne({
      where: { email: createClientDto.email },
    });

    if (existingClient) {
      throw new ConflictException('Email already exists');
    }

    const client = this.clientRepository.create(createClientDto);
    return await this.clientRepository.save(client);
  }

  async findAll(
    search?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Client[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (search) {
      where.name = Like(`%${search}%`);
    }

    const [data, total] = await this.clientRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);

    if (updateClientDto.email && updateClientDto.email !== client.email) {
      const existingClient = await this.clientRepository.findOne({
        where: { email: updateClientDto.email },
      });

      if (existingClient) {
        throw new ConflictException('Email already exists');
      }
    }

    Object.assign(client, updateClientDto);
    return await this.clientRepository.save(client);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.clientRepository.softDelete(id);
  }
}
