import { Request, Response } from 'express';
import { Portfolio } from '../models/portfolio.model';

export const createPortfolioItem = async (req: Request, res: Response) => {
  try {
    const portfolioItem = new Portfolio(req.body);
    await portfolioItem.save();
    res.status(201).json(portfolioItem);
  } catch (error) {
    res.status(400).json({ message: 'Error creating portfolio item', error });
  }
};

export const getPortfolioByFixerId = async (req: Request, res: Response) => {
  try {
    const { fixerId } = req.params;
    const portfolioItems = await Portfolio.find({ fixerId });
    res.status(200).json(portfolioItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching portfolio items', error });
  }
};

export const deletePortfolioItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const portfolioItem = await Portfolio.findByIdAndDelete(id);
    if (!portfolioItem) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }
    res.status(200).json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting portfolio item', error });
  }
};
