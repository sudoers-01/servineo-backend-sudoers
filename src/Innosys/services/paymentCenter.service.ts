import mongoose from 'mongoose';
// import { Fixer } from '../models/Fixer'; // Descomentar cuando exista el modelo

/**
 * Interface para los datos del centro de pagos
 */
export interface PaymentCenterData {
  saldoActual: number;
  totalGanado: number;
  trabajosCompletados: number;
  fixerId: string;
  isTestData: boolean;
}

/**
 * Interface para la wallet del fixer
 */
export interface WalletUpdate {
  success: boolean;
  message?: string;
  currentBalance?: number;
}

/**
 * Servicio para manejar la lógica de negocio del centro de pagos
 */
export class PaymentCenterService {
  
  /**
   * Obtener datos del fixer para el centro de pagos
   * @param fixerId - ID del fixer
   * @returns Datos del centro de pagos o null si no existe
   */
  async getFixerPaymentData(fixerId: string): Promise<PaymentCenterData | null> {
    try {
      // TODO: Descomentar cuando se defina la estructura de la base de datos
      
      // OPCIÓN 1: Si toda la información está en la colección 'fixers'
      /*
      const fixer = await Fixer.findOne({ 
        _id: new mongoose.Types.ObjectId(fixerId) 
      }).select('wallet stats');
      
      if (!fixer) {
        return null;
      }
      
      return {
        saldoActual: fixer.wallet?.currentBalance || 0,
        totalGanado: fixer.wallet?.totalEarnings || 0,
        trabajosCompletados: fixer.stats?.completedJobs || 0,
        fixerId: fixerId,
        isTestData: false
      };
      */

      // OPCIÓN 2: Si hay colecciones separadas
      /*
      const db = mongoose.connection.db;
      if (!db) {
        throw new Error('Database connection not established');
      }
      
      const walletsCollection = db.collection('fixer_wallets');
      const jobsCollection = db.collection('jobs');
      
      // Obtener datos de la wallet
      const walletData = await walletsCollection.findOne({ 
        fixerId: fixerId 
      });
      
      if (!walletData) {
        return null;
      }
      
      // Contar trabajos completados
      const completedJobs = await jobsCollection.countDocuments({
        fixerId: fixerId,
        status: 'completed'
      });
      
      return {
        saldoActual: walletData.currentBalance || 0,
        totalGanado: walletData.totalEarnings || 0,
        trabajosCompletados: completedJobs,
        fixerId: fixerId,
        isTestData: false
      };
      */

      // OPCIÓN 3: Calcular todo desde jobs
      /*
      const db = mongoose.connection.db;
      if (!db) {
        throw new Error('Database connection not established');
      }
      
      const jobsCollection = db.collection('jobs');
      const walletsCollection = db.collection('fixer_wallets');
      
      // Verificar si el fixer existe
      const fixerExists = await jobsCollection.findOne({ fixerId: fixerId });
      if (!fixerExists) {
        return null;
      }
      
      // Obtener saldo actual de la wallet
      const wallet = await walletsCollection.findOne({ fixerId: fixerId });
      
      // Calcular total ganado
      const earnings = await jobsCollection.aggregate([
        { 
          $match: { 
            fixerId: fixerId, 
            status: 'completed' 
          } 
        },
        { 
          $group: { 
            _id: null, 
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          } 
        }
      ]).toArray();
      
      const totalEarnings = earnings[0]?.total || 0;
      const completedJobs = earnings[0]?.count || 0;
      
      return {
        saldoActual: wallet?.currentBalance || 0,
        totalGanado: totalEarnings,
        trabajosCompletados: completedJobs,
        fixerId: fixerId,
        isTestData: false
      };
      */

      // DATOS DE PRUEBA (mientras se define la estructura)
      console.log(`[PRUEBA] Consultando datos para fixer: ${fixerId}`);
      
      // Simular diferentes datos según el ID para testing
      const testData: { [key: string]: PaymentCenterData } = {
        '123456': {
          saldoActual: 13.00,
          totalGanado: 15420.00,
          trabajosCompletados: 23,
          fixerId: fixerId,
          isTestData: true
        },
        '789012': {
          saldoActual: 250.75,
          totalGanado: 28340.50,
          trabajosCompletados: 45,
          fixerId: fixerId,
          isTestData: true
        }
      };

      // Retornar datos de prueba si existe, sino null
      return testData[fixerId] || null;

    } catch (error) {
      console.error('Error en getFixerPaymentData:', error);
      throw error;
    }
  }

  /**
   * Actualizar saldo de la wallet del fixer
   * @param fixerId - ID del fixer
   * @param amount - Monto a agregar/deducir
   * @param type - Tipo de transacción: 'charge' o 'deduction'
   * @returns Wallet actualizada
   */
  async updateWalletBalance(
    fixerId: string, 
    amount: number, 
    type: 'charge' | 'deduction' = 'charge'
  ): Promise<WalletUpdate> {
    try {
      // TODO: Implementar cuando se defina la estructura
      /*
      const db = mongoose.connection.db;
      if (!db) {
        throw new Error('Database connection not established');
      }
      
      const walletsCollection = db.collection('fixer_wallets');
      
      const operation = type === 'charge' 
        ? { $inc: { currentBalance: amount } }
        : { $inc: { currentBalance: -amount } };
      
      const result = await walletsCollection.findOneAndUpdate(
        { fixerId: fixerId },
        operation,
        { returnDocument: 'after' }
      );
      
      if (!result.value) {
        throw new Error('Wallet not found');
      }
      
      return {
        success: true,
        currentBalance: result.value.currentBalance
      };
      */
      
      console.log(`[PRUEBA] Actualizar balance para ${fixerId}: ${type} ${amount}`);
      return { 
        success: true, 
        message: 'Función pendiente de implementar' 
      };
      
    } catch (error) {
      console.error('Error en updateWalletBalance:', error);
      throw error;
    }
  }
}
