// servineo-backend/src/controllers/bankAccount.controller.ts

import { Request, Response } from 'express';
import { BankAccount } from '../models/bankAccount.model';

/**
 * @route POST /api/bank-accounts
 * @desc Registra una nueva cuenta bancaria para un Fixer.
 * @access Private (Debería ser validado por middleware, pero aquí solo se guarda)
 */
export const createBankAccount = async (req: Request, res: Response) => {
    try {
        const { 
            fixerId, 
            nameFixer, 
            identification, 
            accountType, 
            accountNumber, 
            bankName, 
            isFavorite 
        } = req.body;

        // Validación básica (Mongoose se encarga del resto con "required: true")
        if (!fixerId || !accountNumber || !bankName) {
            return res.status(400).json({ 
                message: 'Faltan campos obligatorios (fixerId, accountNumber, bankName).',
                error: 'Missing required fields'
            });
        }

        // Crear una nueva instancia de Cuenta Bancaria
        const newBankAccount = new BankAccount({
            fixerId,
            nameFixer,
            identification,
            accountType,
            accountNumber,
            bankName,
            isFavorite: isFavorite || false // Aseguramos un valor booleano
        });

        // Guardar en la base de datos
        await newBankAccount.save();

        // Respuesta exitosa
        res.status(201).json({
            message: 'Cuenta bancaria registrada exitosamente.',
            data: newBankAccount.toJSON() // Retorna el objeto guardado
        });

    } catch (error: any) {
        // Manejo de errores, especialmente si el número de cuenta ya existe (unique: true)
        if (error.code === 11000) {
            return res.status(409).json({ 
                message: 'El número de cuenta bancaria ya ha sido registrado.',
                error: 'Duplicate account number'
            });
        }
        console.error('Error al crear cuenta bancaria:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor al registrar la cuenta bancaria.',
            error: error.message 
        });
    }
};
