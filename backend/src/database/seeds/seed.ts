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
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const transactions = [
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PAID,
        description: 'Pagamento de serviços - Janeiro',
        amount: 1500.0,
        dueDate: new Date(currentYear, currentMonth, 5),
        paymentDate: new Date(currentYear, currentMonth, 5),
        clientId: savedClients[0].id,
        notes: 'Pagamento recebido via PIX',
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PENDING,
        description: 'Fatura de consultoria',
        amount: 2500.0,
        dueDate: new Date(currentYear, currentMonth, 15),
        clientId: savedClients[1].id,
      },
      {
        kind: TransactionKind.PAYABLE,
        status: TransactionStatus.PAID,
        description: 'Aluguel do escritório',
        amount: 3000.0,
        dueDate: new Date(currentYear, currentMonth, 10),
        paymentDate: new Date(currentYear, currentMonth, 10),
        notes: 'Pagamento via transferência bancária',
      },
      {
        kind: TransactionKind.PAYABLE,
        status: TransactionStatus.PENDING,
        description: 'Fornecedor de materiais',
        amount: 800.0,
        dueDate: new Date(currentYear, currentMonth, 20),
        clientId: savedClients[2].id,
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.OVERDUE,
        description: 'Serviço prestado - Mês anterior',
        amount: 1200.0,
        dueDate: new Date(currentYear, currentMonth - 1, 25),
        clientId: savedClients[0].id,
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PAID,
        description: 'Projeto de desenvolvimento',
        amount: 5000.0,
        dueDate: new Date(currentYear, currentMonth, 1),
        paymentDate: new Date(currentYear, currentMonth, 2),
        clientId: savedClients[2].id,
        notes: 'Projeto concluído com sucesso',
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PAID,
        description: 'Manutenção de sistema',
        amount: 2200.0,
        dueDate: new Date(currentYear, currentMonth, 8),
        paymentDate: new Date(currentYear, currentMonth, 8),
        clientId: savedClients[1].id,
        notes: 'Manutenção mensal',
      },
      {
        kind: TransactionKind.PAYABLE,
        status: TransactionStatus.PAID,
        description: 'Conta de energia',
        amount: 450.0,
        dueDate: new Date(currentYear, currentMonth, 12),
        paymentDate: new Date(currentYear, currentMonth, 12),
        notes: 'Conta referente ao mês anterior',
      },
      {
        kind: TransactionKind.PAYABLE,
        status: TransactionStatus.PAID,
        description: 'Internet e telefonia',
        amount: 350.0,
        dueDate: new Date(currentYear, currentMonth, 15),
        paymentDate: new Date(currentYear, currentMonth, 15),
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PAID,
        description: 'Consultoria técnica',
        amount: 3500.0,
        dueDate: new Date(currentYear, currentMonth, 18),
        paymentDate: new Date(currentYear, currentMonth, 18),
        clientId: savedClients[2].id,
        notes: 'Consultoria de 40 horas',
      },
      {
        kind: TransactionKind.PAYABLE,
        status: TransactionStatus.PAID,
        description: 'Salários',
        amount: 8000.0,
        dueDate: new Date(currentYear, currentMonth, 5),
        paymentDate: new Date(currentYear, currentMonth, 5),
        notes: 'Folha de pagamento',
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PAID,
        description: 'Licença de software',
        amount: 1800.0,
        dueDate: new Date(currentYear, currentMonth, 22),
        paymentDate: new Date(currentYear, currentMonth, 22),
        clientId: savedClients[0].id,
      },
      {
        kind: TransactionKind.PAYABLE,
        status: TransactionStatus.PENDING,
        description: 'Fornecedor de equipamentos',
        amount: 4500.0,
        dueDate: new Date(currentYear, currentMonth, 25),
        clientId: savedClients[2].id,
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PENDING,
        description: 'Projeto web - Parcela 1',
        amount: 3000.0,
        dueDate: new Date(currentYear, currentMonth, 28),
        clientId: savedClients[1].id,
      },
      {
        kind: TransactionKind.PAYABLE,
        status: TransactionStatus.PAID,
        description: 'Impostos e taxas',
        amount: 1200.0,
        dueDate: new Date(currentYear, currentMonth, 20),
        paymentDate: new Date(currentYear, currentMonth, 20),
        notes: 'DAS MEI',
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PAID,
        description: 'Suporte técnico mensal',
        amount: 900.0,
        dueDate: new Date(currentYear, currentMonth - 1, 28),
        paymentDate: new Date(currentYear, currentMonth - 1, 28),
        clientId: savedClients[0].id,
      },
      {
        kind: TransactionKind.PAYABLE,
        status: TransactionStatus.PAID,
        description: 'Hospedagem e domínios',
        amount: 280.0,
        dueDate: new Date(currentYear, currentMonth - 1, 15),
        paymentDate: new Date(currentYear, currentMonth - 1, 15),
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.PAID,
        description: 'Desenvolvimento de app mobile',
        amount: 7500.0,
        dueDate: new Date(currentYear, currentMonth - 1, 20),
        paymentDate: new Date(currentYear, currentMonth - 1, 22),
        clientId: savedClients[2].id,
        notes: 'Projeto finalizado com 2 dias de atraso',
      },
      {
        kind: TransactionKind.PAYABLE,
        status: TransactionStatus.PAID,
        description: 'Material de escritório',
        amount: 320.0,
        dueDate: new Date(currentYear, currentMonth - 1, 10),
        paymentDate: new Date(currentYear, currentMonth - 1, 10),
      },
      {
        kind: TransactionKind.RECEIVABLE,
        status: TransactionStatus.CANCELLED,
        description: 'Projeto cancelado pelo cliente',
        amount: 2000.0,
        dueDate: new Date(currentYear, currentMonth, 30),
        clientId: savedClients[1].id,
        notes: 'Cliente desistiu do projeto',
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
    console.log('   Senha: admin123');

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
      `   - Período: ${new Date(currentYear, currentMonth - 1, 1).toLocaleDateString('pt-BR')} a ${new Date(currentYear, currentMonth, 28).toLocaleDateString('pt-BR')}`,
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
