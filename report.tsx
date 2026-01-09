import React from 'react';
import ReactDOM from 'react-dom/client';
import ReportPage from './components/ReportPage';
import { CurrencyProvider } from './contexts/CurrencyContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

const reportDataString = sessionStorage.getItem('morpheusReportData');

if (reportDataString) {
    try {
        const reportData = JSON.parse(reportDataString);
        root.render(
          <React.StrictMode>
            <CurrencyProvider initialCurrency={reportData.currency}>
              <ReportPage data={reportData} />
            </CurrencyProvider>
          </React.StrictMode>
        );
    } catch (e) {
        root.render(
            <div className="text-white p-8">
                <h1 className="text-2xl font-bold text-red-500">Erro ao carregar os dados do relatório.</h1>
                <p>O formato dos dados é inválido. Por favor, tente gerar o relatório novamente.</p>
                <p className="text-sm text-gray-400 mt-4">Detalhes do erro: {(e as Error).message}</p>
            </div>
        );
        console.error("Failed to parse report data from sessionStorage", e);
    }
} else {
    root.render(
        <div className="text-white p-8">
            <h1 className="text-2xl font-bold">Nenhum dado de relatório encontrado.</h1>
            <p>Por favor, volte para a aplicação principal e gere um relatório novamente.</p>
        </div>
    );
}
