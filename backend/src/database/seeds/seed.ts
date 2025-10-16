import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { User } from '../../users/entities/user.entity';
import { Client } from '../../clients/entities/client.entity';
import {
  Transaction,
  TransactionKind,
  TransactionStatus,
} from '../../transactions/entities/transaction.entity';

config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'mini_erp',
  entities: [User, Client, Transaction],
  synchronize: false,
});

async function seed() {
  try {
    await dataSource.initialize();
    console.log('Conectado ao banco de dados');

    const userRepository = dataSource.getRepository(User);
    const clientRepository = dataSource.getRepository(Client);
    const transactionRepository = dataSource.getRepository(Transaction);

    const existingUser = await userRepository.findOne({
      where: { email: 'admin@example.com' },
    });

    if (existingUser) {
      console.log('Seeds já foram executados anteriormente');
      await dataSource.destroy();
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = userRepository.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      isActive: true,
    });
    await userRepository.save(user);
    console.log('✓ Usuário admin criado');

    const clients = [
      {
        name: 'João Silva',
        email: 'joao.silva@example.com',
        phone: '(11) 98765-4321',
        document: '123.456.789-00',
        address: 'Rua das Flores, 123 - São Paulo, SP',
      },
      {
        name: 'Maria Santos',
        email: 'maria.santos@example.com',
        phone: '(21) 91234-5678',
        document: '987.654.321-00',
        address: 'Av. Principal, 456 - Rio de Janeiro, RJ',
      },
      {
        name: 'Empresa XYZ Ltda',
        email: 'contato@empresaxyz.com',
        phone: '(11) 3456-7890',
        document: '12.345.678/0001-90',
        address: 'Av. Paulista, 1000 - São Paulo, SP',
      },
    ];

    const savedClients = [];
    for (const clientData of clients) {
      const client = clientRepository.create(clientData);
      const saved = await clientRepository.save(client);
      savedClients.push(saved);
    }
    console.log(`✓ ${savedClients.length} clientes criados`);

    const today = new Date();
    const transactions = [
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PAID,
        description: 'Pagamento de serviços - Janeiro',
        amount: 1500.0,
        dueDate: new Date(today.getFullYear(), today.getMonth(), 5),
        paymentDate: new Date(today.getFullYear(), today.getMonth(), 5),
        clientId: savedClients[0].id,
        notes: 'Pagamento recebido via PIX',
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PENDING,
        description: 'Fatura de consultoria',
        amount: 2500.0,
        dueDate: new Date(today.getFullYear(), today.getMonth(), 15),
        clientId: savedClients[1].id,
      },
      {
        kind: TransactionKind.PAYABLE,
        status: TransactionStatus.PAID,
        description: 'Aluguel do escritório',
        amount: 3000.0,
        dueDate: new Date(today.getFullYear(), today.getMonth(), 10),
        paymentDate: new Date(today.getFullYear(), today.getMonth(), 10),
        notes: 'Pagamento via transferência bancária',
      },
      {
        kind: TransactionKind.PAYABLE,
        status: TransactionStatus.PENDING,
        description: 'Fornecedor de materiais',
        amount: 800.0,
        dueDate: new Date(today.getFullYear(), today.getMonth(), 20),
        clientId: savedClients[2].id,
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.OVERDUE,
        description: 'Serviço prestado - Dezembro',
        amount: 1200.0,
        dueDate: new Date(today.getFullYear(), today.getMonth() - 1, 25),
        clientId: savedClients[0].id,
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PAID,
        description: 'Projeto de desenvolvimento',
        amount: 5000.0,
        dueDate: new Date(today.getFullYear(), today.getMonth(), 1),
        paymentDate: new Date(today.getFullYear(), today.getMonth(), 2),
        clientId: savedClients[2].id,
        notes: 'Projeto concluído com sucesso',
      },
    ];

    for (const transactionData of transactions) {
      const transaction = transactionRepository.create(transactionData);
      await transactionRepository.save(transaction);
    }
    console.log(`✓ ${transactions.length} transações criadas`);

    console.log('\n✅ Seeds executados com sucesso!');
    console.log('\nCredenciais de acesso:');
    console.log('Email: admin@example.com');
    console.log('Senha: admin123\n');

    await dataSource.destroy();
  } catch (error) {
    console.error('Erro ao executar seeds:', error);
    process.exit(1);
  }
}

seed();
