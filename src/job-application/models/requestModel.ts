export interface IRequestForm {
  _id?: any;
  jobMotive: string;
  jobDescription: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  startTime: string;
  endTime: string;
  suggestedRate: number;
  createdAt: Date;
  updatedAt: Date;
}

// Índice para geoqueries  
// db.requestforms.createIndex({ location: "2dsphere" })