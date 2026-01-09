
import React, { useState, useEffect, useCallback } from 'react';
import { View, ReminderItem, BoletoStatus, TransactionType } from './types';
import * as storage from './services/storageService';
import Dashboard from './components/Dashboard';
import Companies from './components/Companies';
import Transactions from './components/Transactions';
import Reports from './components/Reports';
import Suppliers from './components/Suppliers';
import Boletos from './components/Boletos';
import { performBackup, performRestore } from './services/backupService';
import BottomNav from './components/BottomNav';
import MoreMenuModal from './components/MoreMenuModal';
import CurrencySelector from './components/CurrencySelector';
import ReminderBell from './components/ReminderBell';
import ReminderSettings from './components/ReminderSettings';
import GitHubExportModal from './components/GitHubExportModal';

const Sidebar: React.FC<{ 
    currentView: View; 
    setView: (view: View) => void;
    onExportGithub: () => void;
}> = ({ currentView, setView, onExportGithub }) => {
    const navItems = [
        { id: 'dashboard', name: 'Dashboard', icon: 'grid-outline' },
        { id: 'transactions', name: 'Lançamentos', icon: 'swap-horizontal-outline' },
        { id: 'receivable', name: 'Contas a Receber', icon: 'arrow-up-circle-outline' },
        { id: 'payable', name: 'Contas a Pagar', icon: 'arrow-down-circle-outline' },
        { id: 'boletos', name: 'Lançamento de Boletos', icon: 'barcode-outline' },
        { id: 'reports', name: 'Relatórios', icon: 'document-text-outline' },
        { id: 'companies', name: 'Empresas', icon: 'business-outline' },
        { id: 'suppliers', name: 'Fornecedores', icon: 'people-outline' },
    ];

    const baseClass = "flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200";
    const activeClass = "bg-gray-700 text-white font-semibold";

    return (
        <div className="hidden md:flex w-64 bg-gray-900 border-r border-gray-800 flex-col h-full overflow-y-auto">
            <div className="px-6 py-4 flex items-center gap-3">
                <span className="text-2xl">💸</span>
                <h1 className="text-xl font-bold text-white">Morpheus System</h1>
            </div>
            <nav className="flex-grow px-4 flex flex-col justify-between">
                <ul className="space-y-1">
                    {navItems.map(item => (
                        <li key={item.id}>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); setView(item.id as View); }}
                                className={`${baseClass} ${currentView === item.id ? activeClass : ''}`}
                            >
                                <ion-icon name={item.icon} className="mr-3 text-xl"></ion-icon>
                                {item.name}
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="pb-4 mt-6">
                    <CurrencySelector id="currency-selector-desktop" className="px-4 mb-2" />
                    <div className="my-2">
                        <ReminderSettings />
                    </div>
                    <ul className="space-y-1 border-t border-gray-800 pt-4">
                         <li>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); onExportGithub(); }}
                                className={`${baseClass} text-blue-400 hover:text-blue-300`}
                            >
                                <ion-icon name="logo-github" className="mr-3 text-xl"></ion-icon>
                                Exportar p/ GitHub
                            </a>
                        </li>
                         <li>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); performBackup(); }}
                                className={baseClass}
                            >
                                <ion-icon name="download-outline" className="mr-3 text-xl"></ion-icon>
                                Fazer Backup
                            </a>
                        </li>
                         <li>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); performRestore(); }}
                                className={baseClass}
                            >
                                <ion-icon name="upload-outline" className="mr-3 text-xl"></ion-icon>
                                Restaurar Backup
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
};

const App: React.FC = () => {
    const [view, setView] = useState<View>('dashboard');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [reminders, setReminders] = useState<ReminderItem[]>([]);

    const calculateReminders = useCallback(() => {
        const settings = storage.getSettings();
        if (settings.reminderDays < 0) {
            setReminders([]);
            return;
        };

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const reminderStartDate = new Date(today);
        reminderStartDate.setDate(today.getDate() - settings.reminderDays);

        const reminderEndDate = new Date(today);
        reminderEndDate.setDate(today.getDate() + settings.reminderDays);

        const reminderItems: ReminderItem[] = [];
        
        const suppliers = storage.getSuppliers();
        const boletos = storage.getBoletos();
        
        boletos.forEach(b => {
            const dueDate = new Date(b.dueDate + 'T00:00:00');
            const isOverdue = dueDate < today;

            if (b.status === BoletoStatus.PENDING) {
                const isUpcoming = dueDate >= today && dueDate <= reminderEndDate;
                if (isOverdue || isUpcoming) {
                    const supplier = suppliers.find(s => s.id === b.supplierId);
                    reminderItems.push({
                        id: `boleto-${b.id}`,
                        sourceId: b.id,
                        type: 'boleto',
                        description: `Boleto: ${supplier?.name || 'Fornecedor desconhecido'}`,
                        dueDate: b.dueDate,
                        amount: b.amount,
                        view: 'boletos',
                        status: isOverdue ? 'overdue' : 'pending',
                    });
                }
            } else if (b.status === BoletoStatus.PAID) {
                if (isOverdue && dueDate >= reminderStartDate) {
                    const supplier = suppliers.find(s => s.id === b.supplierId);
                    reminderItems.push({
                        id: `boleto-${b.id}`,
                        sourceId: b.id,
                        type: 'boleto',
                        description: `Boleto: ${supplier?.name || 'Fornecedor desconhecido'}`,
                        dueDate: b.dueDate,
                        amount: b.amount,
                        view: 'boletos',
                        status: 'paid',
                    });
                }
            }
        });

        const transactions = storage.getTransactions();
        transactions
            .filter(t => t.type === TransactionType.EXPENSE)
            .forEach(t => {
                const dueDate = new Date(t.date + 'T00:00:00');
                const isOverdue = dueDate < today;
                const isUpcoming = dueDate >= today && dueDate <= reminderEndDate;
                
                if (isOverdue || isUpcoming) {
                    reminderItems.push({
                        id: `txn-${t.id}`,
                        sourceId: t.id,
                        type: 'transaction',
                        description: t.description,
                        dueDate: t.date,
                        amount: t.amount,
                        view: 'payable',
                        status: isOverdue ? 'overdue' : 'pending',
                    });
                }
            });
            
        setReminders(reminderItems.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
    }, []);

    useEffect(() => {
        calculateReminders();
    }, [view, calculateReminders]);


    const renderView = () => {
        switch (view) {
            case 'dashboard':
                return <Dashboard />;
            case 'companies':
                return <Companies />;
            case 'transactions':
                return <Transactions initialTab="all" />;
            case 'payable':
                return <Transactions initialTab="expense" />;
            case 'receivable':
                return <Transactions initialTab="revenue" />;
            case 'boletos':
                return <Boletos />;
            case 'reports':
                return <Reports />;
            case 'suppliers':
                return <Suppliers />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-800 text-gray-200">
            <Sidebar currentView={view} setView={setView} onExportGithub={() => setIsExportModalOpen(true)} />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8 relative">
                <div className="absolute top-4 right-4 md:top-8 md:right-8 z-30">
                    <ReminderBell reminders={reminders} setView={setView} />
                </div>
                {renderView()}
            </main>
            <BottomNav currentView={view} setView={setView} onMenuClick={() => setIsMenuOpen(true)} />
            <MoreMenuModal 
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                setView={setView}
            />
            <GitHubExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
        </div>
    );
};

export default App;
