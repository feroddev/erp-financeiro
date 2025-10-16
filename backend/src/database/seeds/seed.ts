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
import { Role } from '../../auth/enums/role.enum';

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

    const forceReset = process.argv.includes('--reset');

    const existingUser = await userRepository.findOne({
      where: { email: 'admin@example.com' },
    });

    if (existingUser && !forceReset) {
      console.log('Seeds já foram executados anteriormente');
      console.log('Use "npm run seed:run -- --reset" para limpar e recriar os dados');
      await dataSource.destroy();
      return;
    }

    if (forceReset) {
      console.log('🗑️  Limpando dados existentes...');
      await dataSource.query('TRUNCATE TABLE "transactions" CASCADE');
      await dataSource.query('TRUNCATE TABLE "clients" CASCADE');
      await dataSource.query('TRUNCATE TABLE "users" CASCADE');
      console.log('✓ Dados limpos');
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = userRepository.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: Role.ADMIN,
      isActive: true,
    });
    await userRepository.save(user);
    console.log('✓ Usuário admin criado');

    const clients = [
      {
        name: 'João Silva',
        email: 'joao.silva@example.com',
        phone: '11987654321',
        document: '12345678900',
        address: 'Rua das Flores, 123 - São Paulo, SP',
      },
      {
        name: 'Maria Santos',
        email: 'maria.santos@example.com',
        phone: '21912345678',
        document: '98765432100',
        address: 'Av. Principal, 456 - Rio de Janeiro, RJ',
      },
      {
        name: 'Empresa XYZ Ltda',
        email: 'contato@empresaxyz.com',
        phone: '1134567890',
        document: '12345678000190',
        address: 'Av. Paulista, 1000 - São Paulo, SP',
      },
      {
        name: 'Pedro Oliveira',
        email: 'pedro.oliveira@example.com',
        phone: '11976543210',
        document: '45678912300',
        address: 'Rua dos Pinheiros, 789 - São Paulo, SP',
      },
      {
        name: 'Ana Costa',
        email: 'ana.costa@example.com',
        phone: '21987654321',
        document: '78945612300',
        address: 'Rua das Acácias, 321 - Rio de Janeiro, RJ',
      },
      {
        name: 'TechSolutions Ltda',
        email: 'contato@techsolutions.com',
        phone: '1133445566',
        document: '98765432000145',
        address: 'Av. Faria Lima, 2500 - São Paulo, SP',
      },
      {
        name: 'Carlos Mendes',
        email: 'carlos.mendes@example.com',
        phone: '31988776655',
        document: '32165498700',
        address: 'Rua da Bahia, 456 - Belo Horizonte, MG',
      },
      {
        name: 'Inovação Digital ME',
        email: 'contato@inovacaodigital.com',
        phone: '4133221100',
        document: '11223344000156',
        address: 'Av. Cândido de Abreu, 800 - Curitiba, PR',
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
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 60);

    const transactions = [
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PAID,
        description: 'Desenvolvimento de website institucional',
        amount: 5500.0,
        dueDate: new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000),
        paymentDate: new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000),
        clientId: savedClients[0].id,
        notes: 'Pagamento recebido via PIX',
      },
      {
        kind: TransactionKind.PAYABLE,
        status: TransactionStatus.PAID,
        description: 'Aluguel do escritório',
        amount: 3500.0,
        dueDate: new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000),
        paymentDate: new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000),
        notes: 'Pagamento via transferência bancária',
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PAID,
        description: 'Consultoria em TI - 20 horas',
        amount: 2800.0,
        dueDate: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000),
        paymentDate: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000),
        clientId: savedClients[1].id,
      },
      {
        kind: TransactionKind.PAYABLE,
        status: TransactionStatus.PAID,
        description: 'Salários e encargos',
        amount: 12000.0,
        dueDate: new Date(startDate.getTime() + 10 * 24 * 60 * 60 * 1000),
        paymentDate: new Date(startDate.getTime() + 10 * 24 * 60 * 60 * 1000),
        notes: 'Folha de pagamento',
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PAID,
        description: 'Manutenção de sistema',
        amount: 1800.0,
        dueDate: new Date(startDate.getTime() + 12 * 24 * 60 * 60 * 1000),
        paymentDate: new Date(startDate.getTime() + 12 * 24 * 60 * 60 * 1000),
        clientId: savedClients[2].id,
      },
      {
        kind: TransactionKind.PAYABLE,
        status: TransactionStatus.PAID,
        description: 'Conta de energia elétrica',
        amount: 680.0,
        dueDate: new Date(startDate.getTime() + 15 * 24 * 60 * 60 * 1000),
        paymentDate: new Date(startDate.getTime() + 15 * 24 * 60 * 60 * 1000),
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PAID,
        description: 'Projeto de e-commerce - Parcela 1/3',
        amount: 8000.0,
        dueDate: new Date(startDate.getTime() + 18 * 24 * 60 * 60 * 1000),
        paymentDate: new Date(startDate.getTime() + 18 * 24 * 60 * 60 * 1000),
        clientId: savedClients[3].id,
        notes: 'Primeira parcela do projeto',
      },
      {
        kind: TransactionKind.PAYABLE,
        status: TransactionStatus.PAID,
        description: 'Internet e telefonia',
        amount: 450.0,
        dueDate: new Date(startDate.getTime() + 20 * 24 * 60 * 60 * 1000),
        paymentDate: new Date(startDate.getTime() + 20 * 24 * 60 * 60 * 1000),
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PAID,
        description: 'Suporte técnico mensal',
        amount: 1200.0,
        dueDate: new Date(startDate.getTime() + 22 * 24 * 60 * 60 * 1000),
        paymentDate: new Date(startDate.getTime() + 23 * 24 * 60 * 60 * 1000),
        clientId: savedClients[4].id,
      },
      {
        kind: TransactionKind.PAYABLE,
        status: TransactionStatus.PAID,
        description: 'Impostos e taxas - DAS',
        amount: 980.0,
        dueDate: new Date(startDate.getTime() + 25 * 24 * 60 * 60 * 1000),
        paymentDate: new Date(startDate.getTime() + 25 * 24 * 60 * 60 * 1000),
        notes: 'DAS MEI',
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PAID,
        description: 'Desenvolvimento de aplicativo mobile',
        amount: 15000.0,
        dueDate: new Date(startDate.getTime() + 28 * 24 * 60 * 60 * 1000),
        paymentDate: new Date(startDate.getTime() + 28 * 24 * 60 * 60 * 1000),
        clientId: savedClients[5].id,
        notes: 'Projeto completo entregue',
      },
      {
        kind: TransactionKind.PAYABLE,
        status: TransactionStatus.PAID,
        description: 'Hospedagem e domínios',
        amount: 320.0,
        dueDate: new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000),
        paymentDate: new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PAID,
        description: 'Consultoria estratégica',
        amount: 4500.0,
        dueDate: new Date(startDate.getTime() + 32 * 24 * 60 * 60 * 1000),
        paymentDate: new Date(startDate.getTime() + 32 * 24 * 60 * 60 * 1000),
        clientId: savedClients[6].id,
      },
      {
        kind: TransactionKind.PAYABLE,
        status: TransactionStatus.PAID,
        description: 'Material de escritório',
        amount: 580.0,
        dueDate: new Date(startDate.getTime() + 35 * 24 * 60 * 60 * 1000),
        paymentDate: new Date(startDate.getTime() + 35 * 24 * 60 * 60 * 1000),
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PAID,
        description: 'Licença de software anual',
        amount: 3200.0,
        dueDate: new Date(startDate.getTime() + 37 * 24 * 60 * 60 * 1000),
        paymentDate: new Date(startDate.getTime() + 37 * 24 * 60 * 60 * 1000),
        clientId: savedClients[7].id,
      },
      {
        kind: TransactionKind.PAYABLE,
        status: TransactionStatus.PAID,
        description: 'Serviços de contabilidade',
        amount: 850.0,
        dueDate: new Date(startDate.getTime() + 40 * 24 * 60 * 60 * 1000),
        paymentDate: new Date(startDate.getTime() + 40 * 24 * 60 * 60 * 1000),
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.OVERDUE,
        description: 'Projeto de integração de sistemas',
        amount: 6800.0,
        dueDate: new Date(startDate.getTime() + 42 * 24 * 60 * 60 * 1000),
        clientId: savedClients[0].id,
        notes: 'Cliente solicitou prazo adicional',
      },
      {
        kind: TransactionKind.PAYABLE,
        status: TransactionStatus.PAID,
        description: 'Equipamentos de informática',
        amount: 4200.0,
        dueDate: new Date(startDate.getTime() + 45 * 24 * 60 * 60 * 1000),
        paymentDate: new Date(startDate.getTime() + 45 * 24 * 60 * 60 * 1000),
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PENDING,
        description: 'Projeto de e-commerce - Parcela 2/3',
        amount: 8000.0,
        dueDate: new Date(startDate.getTime() + 48 * 24 * 60 * 60 * 1000),
        clientId: savedClients[3].id,
        notes: 'Segunda parcela',
      },
      {
        kind: TransactionKind.PAYABLE,
        status: TransactionStatus.PENDING,
        description: 'Fornecedor de software',
        amount: 2500.0,
        dueDate: new Date(startDate.getTime() + 50 * 24 * 60 * 60 * 1000),
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PENDING,
        description: 'Manutenção preventiva de sistemas',
        amount: 1500.0,
        dueDate: new Date(startDate.getTime() + 52 * 24 * 60 * 60 * 1000),
        clientId: savedClients[1].id,
      },
      {
        kind: TransactionKind.PAYABLE,
        status: TransactionStatus.PENDING,
        description: 'Aluguel do escritório',
        amount: 3500.0,
        dueDate: new Date(startDate.getTime() + 55 * 24 * 60 * 60 * 1000),
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PENDING,
        description: 'Consultoria em segurança da informação',
        amount: 5200.0,
        dueDate: new Date(startDate.getTime() + 57 * 24 * 60 * 60 * 1000),
        clientId: savedClients[2].id,
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PENDING,
        description: 'Desenvolvimento de landing page',
        amount: 2200.0,
        dueDate: new Date(startDate.getTime() + 59 * 24 * 60 * 60 * 1000),
        clientId: savedClients[4].id,
      },
      {
        kind: TransactionKind.PAYABLE,
        status: TransactionStatus.PENDING,
        description: 'Salários e encargos',
        amount: 12000.0,
        dueDate: new Date(today),
        notes: 'Folha de pagamento do mês',
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PENDING,
        description: 'Suporte técnico mensal',
        amount: 1200.0,
        dueDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
        clientId: savedClients[5].id,
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PENDING,
        description: 'Projeto de automação',
        amount: 9500.0,
        dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
        clientId: savedClients[6].id,
      },
      {
        kind: TransactionKind.PAYABLE,
        status: TransactionStatus.PENDING,
        description: 'Conta de energia elétrica',
        amount: 720.0,
        dueDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PENDING,
        description: 'Treinamento em tecnologia',
        amount: 3800.0,
        dueDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
        clientId: savedClients[7].id,
      },
      {
        kind: TransactionKind.PAYABLE,
        status: TransactionStatus.PENDING,
        description: 'Internet e telefonia',
        amount: 450.0,
        dueDate: new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000),
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PENDING,
        description: 'Projeto de e-commerce - Parcela 3/3',
        amount: 8000.0,
        dueDate: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000),
        clientId: savedClients[3].id,
        notes: 'Parcela final',
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PENDING,
        description: 'Consultoria em cloud computing',
        amount: 4200.0,
        dueDate: new Date(today.getTime() + 18 * 24 * 60 * 60 * 1000),
        clientId: savedClients[0].id,
      },
      {
        kind: TransactionKind.PAYABLE,
        status: TransactionStatus.PENDING,
        description: 'Impostos e taxas - DAS',
        amount: 980.0,
        dueDate: new Date(today.getTime() + 20 * 24 * 60 * 60 * 1000),
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PENDING,
        description: 'Desenvolvimento de API REST',
        amount: 7200.0,
        dueDate: new Date(today.getTime() + 25 * 24 * 60 * 60 * 1000),
        clientId: savedClients[1].id,
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PENDING,
        description: 'Auditoria de código',
        amount: 3500.0,
        dueDate: new Date(today.getTime() + 28 * 24 * 60 * 60 * 1000),
        clientId: savedClients[2].id,
      },
    ];

    for (const transactionData of transactions) {
      const transaction = transactionRepository.create(transactionData);
      await transactionRepository.save(transaction);
    }
    console.log(`✓ ${transactions.length} transações criadas`);

    const paidTransactions = transactions.filter((t) => t.status === TransactionStatus.PAID);
    const totalReceivable = paidTransactions
      .filter((t) => t.kind === TransactionKind.RECEIVABLE)
      .reduce((sum, t) => sum + t.amount, 0);
    const totalPayable = paidTransactions
      .filter((t) => t.kind === TransactionKind.PAYABLE)
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalReceivable - totalPayable;

    console.log('\n📊 Resumo Financeiro (Transações Pagas):');
    console.log(`   Receitas: R$ ${totalReceivable.toFixed(2)}`);
    console.log(`   Despesas: R$ ${totalPayable.toFixed(2)}`);
    console.log(`   Saldo: R$ ${balance.toFixed(2)}`);

    console.log('\n✅ Seeds executados com sucesso!');
    console.log('\n🔑 Credenciais de acesso:');
    console.log('   Email: admin@example.com');
    console.log('   Senha: Admin@123');

    console.log('\n📈 Dados para Relatórios:');
    console.log(`   - ${transactions.length} transações criadas`);
    console.log(`   - ${paidTransactions.length} transações pagas`);
    console.log(
      `   - ${transactions.filter((t) => t.status === TransactionStatus.PENDING).length} transações pendentes`,
    );
    console.log(
      `   - ${transactions.filter((t) => t.status === TransactionStatus.OVERDUE).length} transações atrasadas`,
    );
    console.log(
      `   - Período: ${startDate.toLocaleDateString('pt-BR')} a ${today.toLocaleDateString('pt-BR')}`,
    );
    console.log('\n💡 Teste o relatório de cashflow em:');
    console.log('   GET /reports/cashflow?from=YYYY-MM-DD&to=YYYY-MM-DD\n');

    await dataSource.destroy();
  } catch (error) {
    console.error('Erro ao executar seeds:', error);
    process.exit(1);
  }
}

seed();
